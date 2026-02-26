import { typeScale, type TypeScaleKey } from '@/src/theme';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useThemeColors } from '../use-theme-colors';
import { createTypographyStyles } from './typography.styles';

type TextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverse'
  | 'link'
  | 'brand'
  | 'error'
  | 'success';

interface TypographyProps extends RNTextProps {
  /** Type scale preset from the design system */
  variant?: TypeScaleKey;
  /** Semantic color variant (default: 'primary') */
  color?: TextColor;
  /** Text content */
  children: React.ReactNode;
}

/**
 * Typography — themed text component using design system type scale.
 *
 * Combines a `variant` (type scale preset) with a semantic `color`.
 *
 * ```tsx
 * <Typography variant="headlineSm">Section Title</Typography>
 * <Typography variant="bodySm" color="secondary">Description</Typography>
 * <Typography variant="stat">12.4 km</Typography>
 * ```
 */
export function Typography({
  variant = 'bodyLg',
  color = 'primary',
  children,
  style,
  ...rest
}: TypographyProps) {
  const colors = useThemeColors();
  const colorStyles = createTypographyStyles(colors);

  return (
    <RNText style={[typeScale[variant], colorStyles[color], style]} {...rest}>
      {children}
    </RNText>
  );
}
