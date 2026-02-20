import { typeScale } from '@/src/theme';
import { Text, View, type ViewStyle } from 'react-native';
import { useThemeColors } from '../use-theme-colors';
import { createEmptyStateStyles } from './empty-state.styles';

interface EmptyStateProps {
  /** Headline text */
  title: string;
  /** Supporting description */
  description?: string;
  /** Illustration element (e.g. an image or icon) */
  illustration?: React.ReactNode;
  /** Action element (e.g. a Button) */
  action?: React.ReactNode;
  /** Additional container style */
  style?: ViewStyle;
}

/**
 * EmptyState — centered placeholder for empty list / no results.
 *
 * ```tsx
 * <EmptyState
 *   title="No routes found"
 *   description="Try adjusting your filters or searching again"
 *   action={<Button variant="secondary" label="Clear Filters" onPress={...} />}
 * />
 * ```
 */
export function EmptyState({
  title,
  description,
  illustration,
  action,
  style,
}: EmptyStateProps) {
  const colors = useThemeColors();
  const styles = createEmptyStateStyles(colors);

  return (
    <View style={[styles.container, style]}>
      {illustration ? (
        <View style={styles.illustration}>{illustration}</View>
      ) : null}

      <Text style={[typeScale.headlineSm, styles.title]}>{title}</Text>

      {description ? (
        <Text style={[typeScale.bodySm, styles.description]}>
          {description}
        </Text>
      ) : null}

      {action ? <View style={styles.actionWrapper}>{action}</View> : null}
    </View>
  );
}
