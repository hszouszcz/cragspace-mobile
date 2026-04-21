import React, { useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { Gesture, type GestureType } from 'react-native-gesture-handler';
import {
  type SharedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_VELOCITY_THRESHOLD = 400;
const SWIPE_DISTANCE_THRESHOLD = SCREEN_WIDTH * 0.4;

interface UseSectorPagerOptions {
  wallCount: number;
  /**
   * SharedValue written by the active WallViewer on the UI thread. The pager
   * reads this directly in its onUpdate/onEnd worklets — no JS roundtrip needed.
   */
  activeIsZoomedSharedValue: SharedValue<boolean>;
}

interface UseSectorPagerResult {
  /** Current wall index as React state (use for rendering) */
  currentWallIndex: number;
  /** Current wall index as SharedValue (use in worklets) */
  currentWallIndexSharedValue: SharedValue<number>;
  /** Horizontal translation for the pager container animated style */
  translateXSharedValue: SharedValue<number>;
  /** GestureHandler gesture — attach to the pager wrapper */
  pagerGesture: ReturnType<typeof Gesture.Pan>;
  /** Ref to the pager gesture — pass to WallViewer so its inner pan can run simultaneously */
  pagerGestureRef: React.RefObject<GestureType | undefined>;
  /** Programmatically navigate to a wall index */
  goToWall: (index: number) => void;
}

export function useSectorPager({
  wallCount,
  activeIsZoomedSharedValue,
}: UseSectorPagerOptions): UseSectorPagerResult {
  const [currentWallIndex, setCurrentWallIndex] = useState(0);
  const currentWallIndexSharedValue = useSharedValue(0);
  const translateXSharedValue = useSharedValue(0);
  const dragStartTranslateX = useSharedValue(0);
  const pagerGestureRef = useRef<GestureType | null>(
    null,
  ) as React.MutableRefObject<GestureType | undefined>;

  const snapToWall = (index: number, animate: boolean = true) => {
    'worklet';
    const clampedIndex = Math.max(0, Math.min(index, wallCount - 1));
    const targetX = -clampedIndex * SCREEN_WIDTH;
    if (animate) {
      translateXSharedValue.value = withSpring(targetX, {
        damping: 50,
        stiffness: 250,
      });
    } else {
      translateXSharedValue.value = targetX;
    }
    currentWallIndexSharedValue.value = clampedIndex;
    scheduleOnRN(setCurrentWallIndex, clampedIndex);
  };

  const goToWall = (index: number) => {
    snapToWall(index);
  };

  // Keep the pager always registered (no .enabled() JS state).
  // Zoom gating is handled entirely on the UI thread via onUpdate/onEnd guards.
  // maxPointers(1) prevents the pager from firing during 2-finger pinch.
  // failOffsetY([-25, 25]) gives enough tolerance for natural diagonal swipes —
  // iOS Photos-style gesture axis detection rather than strict horizontal-only.
  const pagerGesture = Gesture.Pan()
    .withRef(pagerGestureRef)
    .maxPointers(1)
    .activeOffsetX([-16, 16])
    .failOffsetY([-25, 25])
    .onBegin(() => {
      'worklet';
      dragStartTranslateX.value = translateXSharedValue.value;
    })
    .onUpdate((e) => {
      'worklet';
      // UI-thread zoom guard — prevents the pager from moving the track while
      // the image is zoomed in, with zero JS latency.
      if (activeIsZoomedSharedValue.value) return;
      const newX = dragStartTranslateX.value + e.translationX;
      // Rubber band at boundaries
      const minX = -(wallCount - 1) * SCREEN_WIDTH;
      const maxX = 0;
      if (newX > maxX) {
        translateXSharedValue.value = maxX + (newX - maxX) * 0.2;
      } else if (newX < minX) {
        translateXSharedValue.value = minX + (newX - minX) * 0.2;
      } else {
        translateXSharedValue.value = newX;
      }
    })
    .onEnd((e) => {
      'worklet';
      // Snap back without changing wall if the guard fires on end.
      if (activeIsZoomedSharedValue.value) {
        snapToWall(currentWallIndexSharedValue.value);
        return;
      }
      const currentIndex = currentWallIndexSharedValue.value;
      const velocityTriggered =
        Math.abs(e.velocityX) > SWIPE_VELOCITY_THRESHOLD;
      const distanceTriggered =
        Math.abs(e.translationX) > SWIPE_DISTANCE_THRESHOLD;

      if (velocityTriggered || distanceTriggered) {
        const direction = e.velocityX > 0 || e.translationX > 0 ? -1 : 1;
        snapToWall(currentIndex + direction);
      } else {
        snapToWall(currentIndex);
      }
    });

  return {
    currentWallIndex,
    currentWallIndexSharedValue,
    translateXSharedValue,
    pagerGesture,
    pagerGestureRef,
    goToWall,
  };
}
