import type { ViewStyle } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  type DerivedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type UseZoomableGestureOptions = {
  onSingleTap?: () => void;
  minScale?: number;
  maxScale?: number;
  doubleTapScale?: number;
  minScaleResetThreshold?: number;
  containerWidth?: number;
  containerHeight?: number;
  contentWidth?: number;
  contentHeight?: number;
  containerSize?: DerivedValue<{ width: number; height: number }>;
  contentSize?: DerivedValue<{ width: number; height: number }>;
};

type UseZoomableGestureResult = {
  gesture: ReturnType<typeof Gesture.Race>;
  animatedStyle: ViewStyle;
  setTransform: (params: {
    scale: number;
    translateX: number;
    translateY: number;
    animate?: boolean;
  }) => void;
  resetTransform: (animate?: boolean) => void;
};

export const useZoomableGestures = (
  options: UseZoomableGestureOptions = {},
): UseZoomableGestureResult => {
  const minScale = options.minScale ?? 1;
  const maxScale = options.maxScale ?? 5;
  const minScaleResetThreshold = options.minScaleResetThreshold ?? 0.02;
  const doubleTapScale = Math.min(
    maxScale,
    Math.max(minScale, options.doubleTapScale ?? 3),
  );
  const containerWidth = options.containerWidth;
  const onSingleTap = options.onSingleTap;
  const containerHeight = options.containerHeight;
  const contentWidth = options.contentWidth;
  const contentHeight = options.contentHeight;
  const containerSize = options.containerSize;
  const contentSize = options.contentSize;

  const scale = useSharedValue(minScale);
  const savedScale = useSharedValue(minScale);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const clamp = (value: number, min: number, max: number) => {
    'worklet';
    return Math.min(Math.max(value, min), max);
  };

  const getBoundsForScale = (targetScale: number) => {
    'worklet';
    const resolvedContainerWidth =
      containerSize?.value?.width ?? containerWidth;
    const resolvedContainerHeight =
      containerSize?.value?.height ?? containerHeight;
    const resolvedContentWidth = contentSize?.value?.width ?? contentWidth;
    const resolvedContentHeight = contentSize?.value?.height ?? contentHeight;

    if (
      resolvedContainerWidth === undefined ||
      resolvedContainerHeight === undefined ||
      resolvedContentWidth === undefined ||
      resolvedContentHeight === undefined
    ) {
      return null;
    }

    const scaledWidth = resolvedContentWidth * targetScale;
    const scaledHeight = resolvedContentHeight * targetScale;
    const maxX = Math.max(0, (scaledWidth - resolvedContainerWidth) / 2);
    const maxY = Math.max(0, (scaledHeight - resolvedContainerHeight) / 2);

    return { maxX, maxY };
  };

  const getBounds = () => {
    'worklet';
    return getBoundsForScale(scale.value);
  };

  const resetTransform = (animate: boolean = true) => {
    'worklet';
    if (animate) {
      scale.value = withTiming(minScale);
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
    } else {
      scale.value = minScale;
      translateX.value = 0;
      translateY.value = 0;
    }
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    savedScale.value = minScale;
  };

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
    const bounds = getBoundsForScale(nextScale);
    const clampedX = bounds ? clamp(nextX, -bounds.maxX, bounds.maxX) : nextX;
    const clampedY = bounds ? clamp(nextY, -bounds.maxY, bounds.maxY) : nextY;
    if (animate) {
      scale.value = withTiming(nextScale);
      translateX.value = withTiming(clampedX);
      translateY.value = withTiming(clampedY);
    } else {
      scale.value = nextScale;
      translateX.value = clampedX;
      translateY.value = clampedY;
    }
    savedScale.value = nextScale;
    savedTranslateX.value = clampedX;
    savedTranslateY.value = clampedY;
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      if (e.scale < minScale) {
        scale.value = minScale;
        return;
      }
      scale.value = savedScale.value * e.scale;

      const bounds = getBounds();
      if (bounds) {
        translateX.value = clamp(translateX.value, -bounds.maxX, bounds.maxX);
        translateY.value = clamp(translateY.value, -bounds.maxY, bounds.maxY);
      }
    })
    .onEnd(() => {
      if (scale.value <= minScale + minScaleResetThreshold) {
        resetTransform(true);
        return;
      } else if (scale.value > maxScale) {
        scale.value = withTiming(maxScale);
      }

      const bounds = getBounds();
      if (bounds) {
        translateX.value = clamp(translateX.value, -bounds.maxX, bounds.maxX);
        translateY.value = clamp(translateY.value, -bounds.maxY, bounds.maxY);
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      }
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const nextX = savedTranslateX.value + e.translationX;
      const nextY = savedTranslateY.value + e.translationY;
      const bounds = getBounds();

      if (bounds) {
        translateX.value = clamp(nextX, -bounds.maxX, bounds.maxX);
        translateY.value = clamp(nextY, -bounds.maxY, bounds.maxY);
      } else {
        translateX.value = nextX;
        translateY.value = nextY;
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > minScale) {
        resetTransform(true);
      } else {
        scale.value = withTiming(doubleTapScale);
        savedScale.value = doubleTapScale;
      }
    });

  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .maxDuration(250)
    .runOnJS(true)
    .onEnd(() => {
      onSingleTap?.();
    });

  const composedGesture = Gesture.Race(
    Gesture.Exclusive(doubleTapGesture, singleTapGesture),
    Gesture.Simultaneous(pinchGesture, panGesture),
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
    setTransform,
    resetTransform,
  };
};
