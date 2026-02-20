import { View, type ViewStyle } from 'react-native';
import { useThemeColors } from '../use-theme-colors';
import { createSeparatorStyles } from './separator.styles';

interface SeparatorProps {
  /** Separator visual variant */
  variant?: 'hairline' | 'opaque' | 'section';
  /** Left inset (in px) for list row separators */
  insetLeft?: number;
  /** Additional style */
  style?: ViewStyle;
}

/**
 * Separator — horizontal divider between content.
 *
 * Three variants:
 * - **hairline** (default): 0.5px transparent-based separator.
 * - **opaque**: 0.5px opaque separator for transparent backgrounds.
 * - **section**: 8px tall section break.
 *
 * ```tsx
 * <Separator />
 * <Separator variant="section" />
 * <Separator insetLeft={68} />
 * ```
 */
export function Separator({
  variant = 'hairline',
  insetLeft,
  style,
}: SeparatorProps) {
  const colors = useThemeColors();
  const styles = createSeparatorStyles(colors);

  const variantStyle = (() => {
    switch (variant) {
      case 'opaque':
        return styles.hairlineOpaque;
      case 'section':
        return styles.section;
      default:
        return styles.hairline;
    }
  })();

  return (
    <View
      style={[
        variantStyle,
        insetLeft !== undefined && { marginLeft: insetLeft },
        style,
      ]}
      accessibilityRole="none"
    />
  );
}
