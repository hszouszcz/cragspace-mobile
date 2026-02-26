import { typeScale } from '@/src/theme';
import { Pressable, Text, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useCurrentScheme, useThemeColors } from '../use-theme-colors';
import { createButtonStyles } from './button.styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps {
  /** Button visual variant */
  variant?: 'primary' | 'secondary' | 'destructive' | 'text';
  /** Button label text */
  label: string;
  /** Press handler */
  onPress?: () => void;
  /** Disable interactions */
  disabled?: boolean;
  /** Leading icon render function */
  leadingIcon?: React.ReactNode;
  /** Trailing icon render function */
  trailingIcon?: React.ReactNode;
  /** Additional container style overrides */
  style?: ViewStyle;
  /** Accessibility label override */
  accessibilityLabel?: string;
}

export function Button({
  variant = 'primary',
  label,
  onPress,
  disabled = false,
  leadingIcon,
  trailingIcon,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const colors = useThemeColors();
  const scheme = useCurrentScheme();
  const isDark = scheme === 'dark';
  const styles = createButtonStyles(colors, isDark);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    const scaleTarget =
      variant === 'primary' || variant === 'destructive' ? 0.97 : 0.98;
    scale.value = withSpring(scaleTarget, { damping: 15, stiffness: 200 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  }

  const containerStyles = getContainerStyles(variant, styles);
  const labelStyle = getLabelStyle(variant, styles);
  const textStyle = getTextVariant(variant);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        containerStyles,
        disabled && getDisabledStyle(variant, styles),
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
    >
      {leadingIcon}
      <Text style={[textStyle, labelStyle]}>{label}</Text>
      {trailingIcon}
    </AnimatedPressable>
  );
}

function getContainerStyles(
  variant: ButtonProps['variant'],
  styles: ReturnType<typeof createButtonStyles>,
) {
  switch (variant) {
    case 'secondary':
      return styles.secondaryContainer;
    case 'destructive':
      return styles.destructiveContainer;
    case 'text':
      return styles.textContainer;
    default:
      return styles.primaryContainer;
  }
}

function getLabelStyle(
  variant: ButtonProps['variant'],
  styles: ReturnType<typeof createButtonStyles>,
) {
  switch (variant) {
    case 'secondary':
      return styles.secondaryLabel;
    case 'destructive':
      return styles.destructiveLabel;
    case 'text':
      return styles.textLabel;
    default:
      return styles.primaryLabel;
  }
}

function getDisabledStyle(
  variant: ButtonProps['variant'],
  styles: ReturnType<typeof createButtonStyles>,
) {
  switch (variant) {
    case 'secondary':
      return styles.secondaryContainerDisabled;
    case 'destructive':
      return styles.destructiveContainerDisabled;
    case 'text':
      return styles.textContainerDisabled;
    default:
      return styles.primaryContainerDisabled;
  }
}

function getTextVariant(variant: ButtonProps['variant']) {
  switch (variant) {
    case 'secondary':
      return typeScale.labelSm;
    case 'text':
      return typeScale.labelLg;
    default:
      return typeScale.labelLg;
  }
}
