import { Dimensions } from 'react-native';
import {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

export const useTopoViewAnimations = (
  imageRatio: SharedValue<number>,
  animatedIndexSharedValue: SharedValue<number>,
  viewBox: string | null,
) => {
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

  return {
    containerSize,
    containerAnimatedStyle,
  };
};
