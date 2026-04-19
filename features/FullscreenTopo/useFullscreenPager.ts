import React, { useRef, useState } from 'react';
import { Gesture, type GestureType } from 'react-native-gesture-handler';
import {
  type SharedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const SWIPE_VELOCITY_THRESHOLD = 400;

interface UseFullscreenPagerOptions {
  wallCount: number;
  initialWallIndex: number;
  screenWidthSV: SharedValue<number>;
  activeIsZoomedSharedValue: SharedValue<boolean>;
}

interface UseFullscreenPagerResult {
  currentWallIndex: number;
  currentWallIndexSharedValue: SharedValue<number>;
  translateXSharedValue: SharedValue<number>;
  pagerGesture: ReturnType<typeof Gesture.Pan>;
  pagerGestureRef: React.RefObject<GestureType | undefined>;
  goToWall: (index: number) => void;
  /** Snap to a wall immediately with no animation — use when (re)opening the modal */
  snapToWallInstant: (index: number) => void;
}

export function useFullscreenPager({
  wallCount,
  initialWallIndex,
  screenWidthSV,
  activeIsZoomedSharedValue,
}: UseFullscreenPagerOptions): UseFullscreenPagerResult {
  const [currentWallIndex, setCurrentWallIndex] = useState(initialWallIndex);
  const currentWallIndexSharedValue = useSharedValue(initialWallIndex);
  const translateXSharedValue = useSharedValue(
    -initialWallIndex * screenWidthSV.value,
  );
  const dragStartTranslateX = useSharedValue(0);
  const pagerGestureRef = useRef<GestureType | null>(
    null,
  ) as React.MutableRefObject<GestureType | undefined>;

  const snapToWall = (index: number, animate: boolean = true) => {
    'worklet';
    const clampedIndex = Math.max(0, Math.min(index, wallCount - 1));
    const targetX = -clampedIndex * screenWidthSV.value;
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

  const snapToWallInstant = (index: number) => {
    snapToWall(index, false);
  };

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
      if (activeIsZoomedSharedValue.value) return;
      const newX = dragStartTranslateX.value + e.translationX;
      const minX = -(wallCount - 1) * screenWidthSV.value;
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
      if (activeIsZoomedSharedValue.value) {
        snapToWall(currentWallIndexSharedValue.value);
        return;
      }
      const currentIndex = currentWallIndexSharedValue.value;
      const swipeDistanceThreshold = screenWidthSV.value * 0.4;
      const velocityTriggered =
        Math.abs(e.velocityX) > SWIPE_VELOCITY_THRESHOLD;
      const distanceTriggered =
        Math.abs(e.translationX) > swipeDistanceThreshold;

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
    snapToWallInstant,
  };
}
