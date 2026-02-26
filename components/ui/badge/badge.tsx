import { typeScale } from '@/src/theme';
import { Text, View, type ViewStyle } from 'react-native';
import { useThemeColors } from '../use-theme-colors';
import { createBadgeStyles } from './badge.styles';

interface BadgeProps {
  /** Badge visual variant */
  variant?: 'primary' | 'secondary';
  /** Badge label */
  label: string;
  /** Additional container style */
  style?: ViewStyle;
}

/**
 * Badge — small status indicator or label.
 *
 * - **primary**: Orange background, white text (KOM, achievements).
 * - **secondary**: Gray background, dark text (grades, categories).
 */
export function Badge({ variant = 'primary', label, style }: BadgeProps) {
  const colors = useThemeColors();
  const styles = createBadgeStyles(colors);

  const containerStyle =
    variant === 'primary' ? styles.primaryContainer : styles.secondaryContainer;
  const textStyle =
    variant === 'primary' ? styles.primaryText : styles.secondaryText;

  return (
    <View
      style={[containerStyle, style]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Text style={[typeScale.labelSm, textStyle]}>{label}</Text>
    </View>
  );
}
