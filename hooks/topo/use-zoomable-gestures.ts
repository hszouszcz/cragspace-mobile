import { useMemo } from 'react';
import { Gesture, type GestureType } from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type UseZoomableGestureOptions = {
  onSingleTap?: () => void;
  minScale?: number;
  maxScale?: number;
  doubleTapScale?: number;
};

type UseZoomableGestureResult = {
  gesture: GestureType;
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
};

export const useZoomableGestures = (
  options: UseZoomableGestureOptions = {},
): UseZoomableGestureResult => {
  const minScale = options.minScale ?? 1;
  const maxScale = options.maxScale ?? 5;
  const doubleTapScale = Math.min(
    maxScale,
    Math.max(minScale, options.doubleTapScale ?? 3),
  );

  const scale = useSharedValue(minScale);
  const savedScale = useSharedValue(minScale);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .onUpdate((e) => {
          if (e.scale < minScale) {
            scale.value = minScale;
            return;
          }
          scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
          if (scale.value <= minScale) {
            scale.value = withTiming(minScale);
            translateX.value = withTiming(0);
            translateY.value = withTiming(0);
            savedTranslateX.value = 0;
            savedTranslateY.value = 0;
          } else if (scale.value > maxScale) {
            scale.value = withTiming(maxScale);
          }
          savedScale.value = scale.value;
        }),
    [
      maxScale,
      minScale,
      savedScale,
      savedTranslateX,
      savedTranslateY,
      scale,
      translateX,
      translateY,
    ],
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onUpdate((e) => {
          if (savedScale.value > minScale) {
            translateX.value = savedTranslateX.value + e.translationX;
            translateY.value = savedTranslateY.value + e.translationY;
          }
        })
        .onEnd(() => {
          if (savedScale.value > minScale) {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
          }
        }),
    [
      minScale,
      savedScale,
      savedTranslateX,
      savedTranslateY,
      translateX,
      translateY,
    ],
  );

  const doubleTapGesture = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
          if (scale.value > minScale) {
            scale.value = withTiming(minScale);
            savedScale.value = minScale;
            translateX.value = withTiming(0);
            translateY.value = withTiming(0);
            savedTranslateX.value = 0;
            savedTranslateY.value = 0;
          } else {
            scale.value = withTiming(doubleTapScale);
            savedScale.value = doubleTapScale;
          }
        }),
    [
      doubleTapScale,
      minScale,
      savedScale,
      savedTranslateX,
      savedTranslateY,
      scale,
      translateX,
      translateY,
    ],
  );

  const singleTapGesture = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(1)
        .maxDuration(250)
        .runOnJS(true)
        .onEnd(() => {
          options.onSingleTap?.();
        }),
    [options.onSingleTap],
  );

  const composedGesture = useMemo(
    () =>
      Gesture.Race(
        Gesture.Exclusive(doubleTapGesture, singleTapGesture),
        Gesture.Simultaneous(pinchGesture, panGesture),
      ),
    [doubleTapGesture, panGesture, pinchGesture, singleTapGesture],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return { gesture: composedGesture, animatedStyle };
};
