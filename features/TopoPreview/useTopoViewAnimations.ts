import { SNAP_POINTS_IN_NUMBERS } from '@/components/TopoBottomSheet';
import { Dimensions } from 'react-native';
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
  containerSize: ReturnType<typeof useDerivedValue>;
  containerAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  contentAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  imageContainerOffsetStyle: ReturnType<typeof useAnimatedStyle>;
};

export const useTopoViewAnimations = ({
  imageRatio,
  animatedIndexSharedValue,
  viewBox,
}: UseTopoViewAnimationsParams): useTopoViewAnimationsReturn => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get('window');

  const containerSize = useDerivedValue(() => {
    const ratio = imageRatio.value || 1;
    // const baseWidth = viewBox
    //   ? parseFloat(viewBox.split(' ')[2]) / ratio
    //   : SCREEN_WIDTH;
    // const baseHeight = viewBox
    //   ? parseFloat(viewBox.split(' ')[3])
    //   : SCREEN_HEIGHT;
    // const maxWidth = (baseWidth * SCREEN_HEIGHT) / baseHeight;
    const width = interpolate(
      animatedIndexSharedValue.value,
      [0, 1, 2],
      [SCREEN_WIDTH, SCREEN_WIDTH, SCREEN_WIDTH],
    );
    const height = interpolate(
      animatedIndexSharedValue.value,
      [0, 1, 2],
      [SCREEN_HEIGHT, SCREEN_HEIGHT * 0.45, SCREEN_WIDTH * 0.45],
    );
    return { width, height };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: containerSize.value.width,
      height: containerSize.value.height,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
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

  const imageContainerOffsetStyle = useAnimatedStyle(() => {
    const sheetHeight = SCREEN_HEIGHT * SNAP_POINTS_IN_NUMBERS[0];
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
    containerAnimatedStyle,
    contentAnimatedStyle,
    imageContainerOffsetStyle,
  };
};
