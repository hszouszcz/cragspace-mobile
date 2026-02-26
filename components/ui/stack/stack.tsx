import { type Spacing } from '@/src/theme';
import { View, type FlexStyle, type ViewProps } from 'react-native';
import { createStackStyles } from './stack.styles';

type SpacingKey = keyof Spacing;

interface StackBaseProps extends ViewProps {
  /** Gap between children — spacing token key or raw number */
  gap?: SpacingKey | number;
  /** Padding on all sides — spacing token key or raw number */
  padding?: SpacingKey | number;
  /** Horizontal padding — spacing token key or raw number */
  paddingHorizontal?: SpacingKey | number;
  /** Vertical padding — spacing token key or raw number */
  paddingVertical?: SpacingKey | number;
  /** Cross-axis alignment (alignItems) */
  align?: FlexStyle['alignItems'];
  /** Main-axis alignment (justifyContent) */
  justify?: FlexStyle['justifyContent'];
  /** Allow children to wrap to the next line */
  wrap?: boolean;
  /** Flex value for the container */
  flex?: number;
  children?: React.ReactNode;
}

/**
 * XStack — horizontal flex container (flexDirection: 'row').
 *
 * Provides ergonomic props for flexbox layout along the X axis.
 *
 * ```tsx
 * <XStack gap="md" align="center" justify="space-between">
 *   <Avatar size="sm" />
 *   <Typography variant="bodySm">Username</Typography>
 * </XStack>
 * ```
 */
export function XStack({
  gap,
  padding,
  paddingHorizontal,
  paddingVertical,
  align,
  justify,
  wrap,
  flex,
  style,
  children,
  ...rest
}: StackBaseProps) {
  const styles = createStackStyles({
    direction: 'row',
    gap,
    padding,
    paddingHorizontal,
    paddingVertical,
    align,
    justify,
    wrap,
    flex,
  });

  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
}

/**
 * YStack — vertical flex container (flexDirection: 'column').
 *
 * Provides ergonomic props for flexbox layout along the Y axis.
 *
 * ```tsx
 * <YStack gap="lg" padding="lg">
 *   <Typography variant="headlineSm">Title</Typography>
 *   <Typography variant="bodySm">Description</Typography>
 * </YStack>
 * ```
 */
export function YStack({
  gap,
  padding,
  paddingHorizontal,
  paddingVertical,
  align,
  justify,
  wrap,
  flex,
  style,
  children,
  ...rest
}: StackBaseProps) {
  const styles = createStackStyles({
    direction: 'column',
    gap,
    padding,
    paddingHorizontal,
    paddingVertical,
    align,
    justify,
    wrap,
    flex,
  });

  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
}
