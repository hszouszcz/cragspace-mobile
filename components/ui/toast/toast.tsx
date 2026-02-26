import { typeScale } from '@/src/theme';
import { useEffect } from 'react';
import { Pressable, Text, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import { useCurrentScheme, useThemeColors } from '../use-theme-colors';
import { createToastStyles } from './toast.styles';

interface ToastProps {
  /** Toast message */
  message: string;
  /** Leading icon element */
  icon?: React.ReactNode;
  /** Action button label */
  actionLabel?: string;
  /** Action button handler */
  onAction?: () => void;
  /** Auto-dismiss duration in ms (default: 4000). Set 0 to disable. */
  duration?: number;
  /** Dismiss callback */
  onDismiss?: () => void;
  /** Whether the toast is visible */
  visible: boolean;
  /** Additional style */
  style?: ViewStyle;
}

/**
 * Toast — ephemeral notification that appears from the bottom.
 *
 * Auto-dismisses after 4 seconds by default. Supports an optional action button.
 *
 * ```tsx
 * <Toast
 *   visible={showToast}
 *   message="Route saved to favorites"
 *   actionLabel="Undo"
 *   onAction={handleUndo}
 *   onDismiss={() => setShowToast(false)}
 * />
 * ```
 */
export function Toast({
  message,
  icon,
  actionLabel,
  onAction,
  duration = 4000,
  onDismiss,
  visible,
  style,
}: ToastProps) {
  const colors = useThemeColors();
  const scheme = useCurrentScheme();
  const isDark = scheme === 'dark';
  const styles = createToastStyles(colors, isDark);

  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 18, stiffness: 120 });
      opacity.value = withTiming(1, { duration: 250 });

      if (duration > 0 && onDismiss) {
        translateY.value = withDelay(
          duration,
          withTiming(100, { duration: 200 }),
        );
        opacity.value = withDelay(
          duration,
          withTiming(0, { duration: 200 }, (finished) => {
            if (finished && onDismiss) {
              runOnJS(onDismiss)();
            }
          }),
        );
      }
    } else {
      translateY.value = withTiming(100, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, duration, onDismiss, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.container, styles.containerMargin, animatedStyle, style]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      {icon}
      <Text style={[typeScale.labelLg, styles.message]} numberOfLines={2}>
        {message}
      </Text>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={[typeScale.labelLg, styles.action]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}
