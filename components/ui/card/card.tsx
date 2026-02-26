import { Pressable, View, type ViewProps, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useCurrentScheme, useThemeColors } from '../use-theme-colors';
import { createCardStyles } from './card.styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps extends ViewProps {
  /** Card content */
  children: React.ReactNode;
  /** Press handler — makes the card tappable with press animation */
  onPress?: () => void;
  /** Additional container style */
  style?: ViewStyle;
  /** Whether to add default content padding (default: true) */
  padded?: boolean;
}

/**
 * Card — the primary content container.
 * Applies surface color, border radius, and shadow (light mode only).
 *
 * When `onPress` is provided, the card becomes pressable with a subtle
 * scale + opacity animation per the design system spec.
 */
export function Card({
  children,
  onPress,
  style,
  padded = true,
  ...rest
}: CardProps) {
  const colors = useThemeColors();
  const scheme = useCurrentScheme();
  const isDark = scheme === 'dark';
  const styles = createCardStyles(colors, isDark);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!onPress) {
    return (
      <View
        style={[styles.container, padded && styles.contentPadding, style]}
        {...rest}
      >
        {children}
      </View>
    );
  }

  function handlePressIn() {
    scale.value = withTiming(0.99, { duration: 80 });
    opacity.value = withTiming(0.92, { duration: 80 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    opacity.value = withSpring(1, { damping: 15, stiffness: 150 });
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        padded && styles.contentPadding,
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}

/**
 * CardSeparator — a hairline separator inside a Card.
 */
export function CardSeparator() {
  const colors = useThemeColors();
  const scheme = useCurrentScheme();
  const styles = createCardStyles(colors, scheme === 'dark');
  return <View style={styles.separator} />;
}
