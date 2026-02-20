import { sizes } from '@/src/theme';
import { Pressable, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { IconSymbol } from '../icon-symbol';
import { useCurrentScheme, useThemeColors } from '../use-theme-colors';
import { createFabStyles } from './fab.styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FabProps {
  /** Press handler */
  onPress?: () => void;
  /** Custom icon element. Defaults to a "+" icon. */
  icon?: React.ReactNode;
  /** Additional container style */
  style?: ViewStyle;
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * FAB — Floating Action Button.
 *
 * 56×56 circular brand-colored button, positioned bottom-right.
 * Includes press scale animation and shadow (light mode).
 *
 * ```tsx
 * <FAB onPress={handleAdd} accessibilityLabel="Add new route" />
 * ```
 */
export function FAB({
  onPress,
  icon,
  style,
  accessibilityLabel = 'Action button',
}: FabProps) {
  const colors = useThemeColors();
  const scheme = useCurrentScheme();
  const isDark = scheme === 'dark';
  const styles = createFabStyles(colors, isDark);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    scale.value = withSpring(0.93, { damping: 15, stiffness: 200 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle, style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {icon ?? (
        <IconSymbol
          name="plus"
          size={sizes.iconLg}
          color={colors.iconInverse}
        />
      )}
    </AnimatedPressable>
  );
}
