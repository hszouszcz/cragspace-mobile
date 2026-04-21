import { SNAP_POINTS_IN_NUMBERS } from '@/components/TopoBottomSheet';
import { Dimensions, ImageStyle, ViewStyle } from 'react-native';
import type { DerivedValue } from 'react-native-reanimated';
import {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

type UseTopoViewAnimationsParams = {
  imageRatio: SharedValue<number>;
  animatedIndexSharedValue: SharedValue<number>;
  viewBox?: string | null;
};

type useTopoViewAnimationsReturn = {
  containerSize: DerivedValue<{ width: number; height: number }>;
  contentSize: DerivedValue<{ width: number; height: number }>;
  containerAnimatedStyle: ViewStyle;
  contentImageAnimatedStyle: ImageStyle;
  contentViewAnimatedStyle: ViewStyle;
  imageContainerOffsetStyle: ViewStyle;
};

export const useTopoViewAnimations = ({
  imageRatio,
  animatedIndexSharedValue,
  viewBox,
}: UseTopoViewAnimationsParams): useTopoViewAnimationsReturn => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get('window');

  // At each snap point, the image should fill exactly the space not covered by the sheet.
  // SNAP_POINTS = ['12%', '52%', '100%'] → image heights: full, 48%, small.
  const imageHeightAtSnap1 =
    SCREEN_HEIGHT * (1 - SNAP_POINTS_IN_NUMBERS[1] / 100);

  const containerSize = useDerivedValue(() => {
    const width = interpolate(
      animatedIndexSharedValue.value,
      [0, 1, 2],
      [SCREEN_WIDTH, SCREEN_WIDTH, SCREEN_WIDTH],
    );
    const height = interpolate(
      animatedIndexSharedValue.value,
      [0, 1, 2],
      [SCREEN_HEIGHT, imageHeightAtSnap1, SCREEN_WIDTH * 0.45],
    );
    return { width, height };
  });

  const containerAnimatedStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      width: containerSize.value.width,
      height: containerSize.value.height,
    };
  });

  const contentSize = useDerivedValue(() => {
    const ratio = imageRatio.value || 1;
    const containerWidth = containerSize.value.width;
    const containerHeight = containerSize.value.height;
    const coverWidth = Math.max(containerWidth, containerHeight * ratio);
    const coverHeight = coverWidth / ratio;
    const containWidth = containerWidth;
    const containHeight = containerWidth / ratio;
    const width = interpolate(
      animatedIndexSharedValue.value,
      [0, 1, 2],
      [containWidth, coverWidth, coverWidth],
    );
    const height = interpolate(
      animatedIndexSharedValue.value,
      [0, 1, 2],
      [containHeight, coverHeight, coverHeight],
    );
    return { width, height };
  });

  const contentImageAnimatedStyle = useAnimatedStyle<ImageStyle>(() => {
    return {
      width: contentSize.value.width,
      height: contentSize.value.height,
    };
  });

  const contentViewAnimatedStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      width: contentSize.value.width,
      height: contentSize.value.height,
    };
  });

  const imageContainerOffsetStyle = useAnimatedStyle<ViewStyle>(() => {
    const sheetHeight = SCREEN_HEIGHT * (SNAP_POINTS_IN_NUMBERS[0] / 100);
    const centeredOffset = -sheetHeight / 2;
    const translateY = interpolate(
      animatedIndexSharedValue.value,
      [0, 1, 2],
      [centeredOffset, 0, 0],
    );
    return {
      transform: [{ translateY }],
    };
  });

  return {
    containerSize,
    contentSize,
    containerAnimatedStyle,
    contentImageAnimatedStyle,
    contentViewAnimatedStyle,
    imageContainerOffsetStyle,
  };
};
