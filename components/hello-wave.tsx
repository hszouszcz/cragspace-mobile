import { theme } from '@/src/theme';
import Animated from 'react-native-reanimated';

const { typeScale } = theme.typography;

export function HelloWave() {
  return (
    <Animated.Text
      style={{
        ...typeScale.displaySm,
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}
    >
      👋
    </Animated.Text>
  );
}
