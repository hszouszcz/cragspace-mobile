import type { ViewStyle } from 'react-native';
import { Gesture, type GestureType } from 'react-native-gesture-handler';
import {
  cancelAnimation,
  type DerivedValue,
  Easing,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const ZOOM_THRESHOLD = 0.05;
const RUBBER_BAND_FACTOR = 0.0;
const EDGE_EPSILON = 4;
const EDGE_HANDOFF_VELOCITY = 400;
// Intentional animations (reset, double-tap): short, clean timing.
const TIMING_CONFIG = {
  duration: 220,
  easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
} as const;
// Physics corrections (pinch over-extension, bounds after sheet snap): subtle spring.
const SPRING_CONFIG = { damping: 30, stiffness: 300 } as const;

type UseGalleryGesturesOptions = {
  containerSize: DerivedValue<{ width: number; height: number }>;
  contentSize: DerivedValue<{ width: number; height: number }>;
  minScale?: number;
  maxScale?: number;
  doubleTapScale?: number;
  onSingleTap?: () => void;
  /**
   * Called when the user pans a zoomed image to a horizontal boundary and
   * continues swiping with sufficient velocity. Use to trigger pager navigation.
   */
  onEdgeSwipe?: (direction: 'next' | 'prev') => void;
  /**
   * Ref to an external pager gesture. When provided the inner pan gesture runs
   * simultaneously with the pager so both detectors can receive the touch.
   */
  pagerGestureRef?: React.RefObject<GestureType | undefined>;
};

type UseGalleryGesturesResult = {
  gesture: ReturnType<typeof Gesture.Race>;
  animatedStyle: ViewStyle;
  scale: SharedValue<number>;
  isZoomedDerived: DerivedValue<boolean>;
  setTransform: (params: {
    scale: number;
    translateX: number;
    translateY: number;
    animate?: boolean;
  }) => void;
  resetTransform: (animate?: boolean) => void;
  /**
   * Clamp the current pan position to the image bounds for the current scale.
   * Call this as a worklet whenever the container/content size changes (e.g.
   * when the bottom sheet snaps to a new position).
   * @param animate - When false, applies the correction immediately (no spring).
   *   Use false when correcting after a snap-point change so the image jumps
   *   to the correct position rather than animating from an out-of-bounds state.
   */
  clampToBounds: (animate?: boolean) => void;
};

export function useGalleryGestures(
  options: UseGalleryGesturesOptions,
): UseGalleryGesturesResult {
  const minScale = options.minScale ?? 1;
  const maxScale = options.maxScale ?? 5;
  const doubleTapScale = Math.min(
    maxScale,
    Math.max(minScale, options.doubleTapScale ?? 2.5),
  );
  const onSingleTap = options.onSingleTap;
  const onEdgeSwipe = options.onEdgeSwipe;
  const pagerGestureRef = options.pagerGestureRef;

  // ── Transform state ──────────────────────────────────────────────────────────
  const scale = useSharedValue(minScale);
  const savedScale = useSharedValue(minScale);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // ── Pinch focal tracking ─────────────────────────────────────────────────────
  // Content-space origin pinned under the pinch center at gesture start.
  const pinchOriginX = useSharedValue(0);
  const pinchOriginY = useSharedValue(0);
  // Guard: prevents pan from stomping translate while pinch is active.
  const isPinching = useSharedValue(false);
  // Guard: prevents the bounds-correction reaction from fighting an active pan.
  const isPanning = useSharedValue(false);

  const isZoomedDerived = useDerivedValue(
    () => scale.value > minScale + ZOOM_THRESHOLD,
  );

  // ── Worklet helpers ──────────────────────────────────────────────────────────

  const getBoundsForScale = (targetScale: number) => {
    'worklet';
    const cw = options.containerSize.value.width;
    const ch = options.containerSize.value.height;
    const iw = options.contentSize.value.width;
    const ih = options.contentSize.value.height;
    const maxX = Math.max(0, (iw * targetScale - cw) / 2);
    const maxY = Math.max(0, (ih * targetScale - ch) / 2);
    return { maxX, maxY };
  };

  const getBounds = () => {
    'worklet';
    return getBoundsForScale(scale.value);
  };

  const resetTransform = (animate: boolean = true) => {
    'worklet';
    if (animate) {
      scale.value = withTiming(minScale, TIMING_CONFIG);
      translateX.value = withTiming(0, TIMING_CONFIG);
      translateY.value = withTiming(0, TIMING_CONFIG);
    } else {
      scale.value = minScale;
      translateX.value = 0;
      translateY.value = 0;
    }
    savedScale.value = minScale;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  // Clamp the current pan position to the image bounds for the current scale.
  // Called after the bottom sheet snaps to a new position to eliminate blank edges.
  // Pass animate=false to jump immediately (e.g. on snap-point change).
  const clampToBounds = (animate: boolean = true) => {
    'worklet';
    const b = getBounds();
    const clampedX = Math.min(Math.max(translateX.value, -b.maxX), b.maxX);
    const clampedY = Math.min(Math.max(translateY.value, -b.maxY), b.maxY);
    if (translateX.value !== clampedX) {
      translateX.value = animate
        ? withSpring(clampedX, SPRING_CONFIG)
        : clampedX;
      savedTranslateX.value = clampedX;
    }
    if (translateY.value !== clampedY) {
      translateY.value = animate
        ? withSpring(clampedY, SPRING_CONFIG)
        : clampedY;
      savedTranslateY.value = clampedY;
    }
  };

  // setTransform is called from JS context (useFocusOnRoute in a useEffect).
  // Reading SharedValue.value from JS is safe in Reanimated.
  const setTransform = ({
    scale: nextScale,
    translateX: nextX,
    translateY: nextY,
    animate,
  }: {
    scale: number;
    translateX: number;
    translateY: number;
    animate?: boolean;
  }) => {
    const cw = options.containerSize.value.width;
    const ch = options.containerSize.value.height;
    const iw = options.contentSize.value.width;
    const ih = options.contentSize.value.height;
    const maxX = Math.max(0, (iw * nextScale - cw) / 2);
    const maxY = Math.max(0, (ih * nextScale - ch) / 2);
    const cx = Math.min(Math.max(nextX, -maxX), maxX);
    const cy = Math.min(Math.max(nextY, -maxY), maxY);
    if (animate) {
      scale.value = withTiming(nextScale, TIMING_CONFIG);
      translateX.value = withTiming(cx, TIMING_CONFIG);
      translateY.value = withTiming(cy, TIMING_CONFIG);
    } else {
      scale.value = nextScale;
      translateX.value = cx;
      translateY.value = cy;
    }
    savedScale.value = nextScale;
    savedTranslateX.value = cx;
    savedTranslateY.value = cy;
  };

  // ── Pinch gesture ────────────────────────────────────────────────────────────
  // Keeps the content pixel under the pinch focal point fixed in screen space.
  // Hard-clamps at min/max scale (RUBBER_BAND_FACTOR=0); springs back on release.
  const pinchGesture = Gesture.Pinch()
    .onBegin((e) => {
      'worklet';
      isPinching.value = true;
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      // Snapshot the current transform as the base for this gesture.
      savedScale.value = scale.value;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      // Identify the content-space point currently under the pinch center.
      const cw = options.containerSize.value.width;
      const ch = options.containerSize.value.height;
      pinchOriginX.value = (e.focalX - cw / 2 - translateX.value) / scale.value;
      pinchOriginY.value = (e.focalY - ch / 2 - translateY.value) / scale.value;
    })
    .onUpdate((e) => {
      'worklet';
      const rawScale = savedScale.value * e.scale;
      // Clamp within boundaries (RUBBER_BAND_FACTOR=0 means hard clamp).
      let newScale: number;
      if (rawScale > maxScale) {
        newScale = maxScale + (rawScale - maxScale) * RUBBER_BAND_FACTOR;
      } else if (rawScale < minScale) {
        newScale = minScale - (minScale - rawScale) * RUBBER_BAND_FACTOR;
      } else {
        newScale = rawScale;
      }
      scale.value = newScale;
      // Translate so the pinned content point stays at the focal screen position.
      const cw = options.containerSize.value.width;
      const ch = options.containerSize.value.height;
      translateX.value = e.focalX - cw / 2 - pinchOriginX.value * newScale;
      translateY.value = e.focalY - ch / 2 - pinchOriginY.value * newScale;
    })
    .onEnd(() => {
      'worklet';
      isPinching.value = false;
      // Snap back to minScale if the user effectively "pinched closed".
      if (scale.value <= minScale + ZOOM_THRESHOLD) {
        resetTransform(true);
        return;
      }
      // Spring-correct if scale or translate strayed beyond valid range.
      const targetScale = Math.min(Math.max(scale.value, minScale), maxScale);
      const currentTx = translateX.value;
      const currentTy = translateY.value;
      const b = getBoundsForScale(targetScale);
      const clampedTx = Math.min(Math.max(currentTx, -b.maxX), b.maxX);
      const clampedTy = Math.min(Math.max(currentTy, -b.maxY), b.maxY);
      if (scale.value !== targetScale) {
        scale.value = withSpring(targetScale, SPRING_CONFIG);
      }
      translateX.value = withSpring(clampedTx, SPRING_CONFIG);
      translateY.value = withSpring(clampedTy, SPRING_CONFIG);
      savedScale.value = targetScale;
      savedTranslateX.value = clampedTx;
      savedTranslateY.value = clampedTy;
    })
    .onFinalize(() => {
      'worklet';
      // Clear the guard even if the gesture was cancelled mid-way.
      isPinching.value = false;
    });

  // ── Pan gesture ──────────────────────────────────────────────────────────────
  // Single-finger only (maxPointers=1) so it never fires during a 2-finger pinch.
  // Hard-clamps at image edges (RUBBER_BAND_FACTOR=0); decays with momentum on release.
  // At scale==1 the bounds are [0,0] so the gesture has no visual effect and the
  // pager handles horizontal navigation instead.
  const panGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(1)
    .onBegin(() => {
      'worklet';
      isPanning.value = true;
      // Cancel any running decay and snapshot the current position.
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((e) => {
      'worklet';
      if (isPinching.value) return;
      const nextX = savedTranslateX.value + e.translationX;
      const nextY = savedTranslateY.value + e.translationY;
      const b = getBounds();
      // Hard-clamp at image boundaries (RUBBER_BAND_FACTOR=0 → no elastic stretch).
      translateX.value =
        nextX > b.maxX
          ? b.maxX + (nextX - b.maxX) * RUBBER_BAND_FACTOR
          : nextX < -b.maxX
            ? -b.maxX + (nextX + b.maxX) * RUBBER_BAND_FACTOR
            : nextX;
      translateY.value =
        nextY > b.maxY
          ? b.maxY + (nextY - b.maxY) * RUBBER_BAND_FACTOR
          : nextY < -b.maxY
            ? -b.maxY + (nextY + b.maxY) * RUBBER_BAND_FACTOR
            : nextY;
    })
    .onEnd((e) => {
      'worklet';
      if (isPinching.value) return;

      // Edge handoff: when at a horizontal boundary with high velocity, defer
      // navigation to the parent pager (only fires from JS — acceptable).
      if (onEdgeSwipe) {
        const b = getBounds();
        if (b.maxX > 0) {
          if (
            translateX.value <= -b.maxX + EDGE_EPSILON &&
            e.velocityX < -EDGE_HANDOFF_VELOCITY
          ) {
            scheduleOnRN(onEdgeSwipe, 'next');
          } else if (
            translateX.value >= b.maxX - EDGE_EPSILON &&
            e.velocityX > EDGE_HANDOFF_VELOCITY
          ) {
            scheduleOnRN(onEdgeSwipe, 'prev');
          }
        } else {
          if (e.velocityX < -EDGE_HANDOFF_VELOCITY) {
            scheduleOnRN(onEdgeSwipe, 'next');
          } else if (e.velocityX > EDGE_HANDOFF_VELOCITY) {
            scheduleOnRN(onEdgeSwipe, 'prev');
          }
        }
      }

      // Momentum decay clamped to image bounds.
      const b = getBounds();
      translateX.value = withDecay({
        velocity: e.velocityX,
        clamp: [-b.maxX, b.maxX],
        deceleration: 0.994,
      });
      translateY.value = withDecay({
        velocity: e.velocityY,
        clamp: [-b.maxY, b.maxY],
        deceleration: 0.994,
      });
    })
    .onFinalize(() => {
      'worklet';
      isPanning.value = false;
    });

  // ── Double-tap gesture ───────────────────────────────────────────────────────
  // At scale==1: zoom to doubleTapScale centred on the tapped screen position.
  // At scale>1: return to scale==1.
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((e) => {
      'worklet';
      if (scale.value > minScale + ZOOM_THRESHOLD) {
        resetTransform(true);
        return;
      }
      const cw = options.containerSize.value.width;
      const ch = options.containerSize.value.height;
      // Translate so the content point under the tap stays at the tap position.
      // Math: newTranslateX = (tapX - containerCenterX) * (1 - targetScale)
      const dx = (e.x - cw / 2) * (1 - doubleTapScale);
      const dy = (e.y - ch / 2) * (1 - doubleTapScale);
      const b = getBoundsForScale(doubleTapScale);
      const cx = Math.min(Math.max(dx, -b.maxX), b.maxX);
      const cy = Math.min(Math.max(dy, -b.maxY), b.maxY);
      scale.value = withTiming(doubleTapScale, TIMING_CONFIG);
      translateX.value = withTiming(cx, TIMING_CONFIG);
      translateY.value = withTiming(cy, TIMING_CONFIG);
      savedScale.value = doubleTapScale;
      savedTranslateX.value = cx;
      savedTranslateY.value = cy;
    });

  // ── Single-tap gesture ───────────────────────────────────────────────────────
  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .maxDuration(250)
    .runOnJS(true)
    .onEnd(() => {
      onSingleTap?.();
    });

  // ── Continuous bounds correction ─────────────────────────────────────────────
  // Re-clamp translateX/Y whenever the container size changes (e.g. as the bottom
  // sheet snaps between positions). Fires every frame during sheet animation but
  // clampToBounds(false) is O(1) — just a comparison + immediate assignment.
  // The isPanning/isPinching guards prevent interference with active gestures.
  useAnimatedReaction(
    () =>
      options.containerSize.value.width + options.containerSize.value.height,
    (curr, prev) => {
      if (prev === null || curr === prev) return;
      if (isPanning.value || isPinching.value) return;
      clampToBounds(false);
    },
  );

  // ── Gesture composition ──────────────────────────────────────────────────────
  // Pan runs simultaneously with the pager so both detectors receive the touch
  // and the pager can animate the track while pan applies bounds clamping.
  const resolvedPanGesture = pagerGestureRef
    ? panGesture.simultaneousWithExternalGesture(pagerGestureRef)
    : panGesture;

  const composedGesture = Gesture.Race(
    Gesture.Exclusive(doubleTapGesture, singleTapGesture),
    Gesture.Simultaneous(pinchGesture, resolvedPanGesture),
  );

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return {
    gesture: composedGesture,
    animatedStyle,
    scale,
    isZoomedDerived,
    setTransform,
    resetTransform,
    clampToBounds,
  };
}
