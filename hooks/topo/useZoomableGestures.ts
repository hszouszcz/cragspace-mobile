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
  containerWidth?: number;
  containerHeight?: number;
  contentWidth?: number;
  contentHeight?: number;
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
  const containerWidth = options.containerWidth;
  const containerHeight = options.containerHeight;
  const contentWidth = options.contentWidth;
  const contentHeight = options.contentHeight;

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

  const getBounds = () => {
    'worklet';
    if (
      containerWidth === undefined ||
      containerHeight === undefined ||
      contentWidth === undefined ||
      contentHeight === undefined
    ) {
      return null;
    }

    const scaledWidth = contentWidth * scale.value;
    const scaledHeight = contentHeight * scale.value;
    const maxX = Math.max(0, (scaledWidth - containerWidth) / 2);
    const maxY = Math.max(0, (scaledHeight - containerHeight) / 2);

    return { maxX, maxY };
  };

  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .onUpdate((e) => {
          if (e.scale < minScale) {
            scale.value = minScale;
            return;
          }
          scale.value = savedScale.value * e.scale;

          const bounds = getBounds();
          if (bounds) {
            translateX.value = clamp(
              translateX.value,
              -bounds.maxX,
              bounds.maxX,
            );
            translateY.value = clamp(
              translateY.value,
              -bounds.maxY,
              bounds.maxY,
            );
          }
        })
        .onEnd(() => {
          if (scale.value <= minScale) {
            scale.value = withTiming(minScale);
            translateX.value = withTiming(0);
            translateY.value = withTiming(0);
            savedTranslateX.value = 0;
            savedTranslateY.value = 0;
            savedScale.value = minScale;
            return;
          } else if (scale.value > maxScale) {
            scale.value = withTiming(maxScale);
          }

          const bounds = getBounds();
          if (bounds) {
            translateX.value = clamp(
              translateX.value,
              -bounds.maxX,
              bounds.maxX,
            );
            translateY.value = clamp(
              translateY.value,
              -bounds.maxY,
              bounds.maxY,
            );
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
          }
          savedScale.value = scale.value;
        }),
    [
      containerHeight,
      containerWidth,
      contentHeight,
      contentWidth,
      getBounds,
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
          }
        })
        .onEnd(() => {
          if (savedScale.value > minScale) {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
          }
        }),
    [
      containerHeight,
      containerWidth,
      contentHeight,
      contentWidth,
      getBounds,
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
