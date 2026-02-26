import { typeScale } from '@/src/theme';
import { Text, View, type ViewStyle } from 'react-native';
import { useThemeColors } from '../use-theme-colors';
import { createStatBlockStyles } from './stat-block.styles';

interface StatItem {
  /** Display value (e.g. "12.4 km") */
  value: string;
  /** Label below value (e.g. "DISTANCE") — rendered uppercase via statLabel preset */
  label: string;
}

interface StatBlockProps {
  /** Array of stat items to display in a row */
  items: StatItem[];
  /** Use hero-sized stat values (profile pages) */
  hero?: boolean;
  /** Additional container style */
  style?: ViewStyle;
}

/**
 * StatBlock — the signature data display pattern.
 *
 * Renders value + label pairs in an evenly distributed horizontal row.
 * Each stat is center-aligned within its flex column.
 *
 * ```tsx
 * <StatBlock items={[
 *   { value: '12.4 km', label: 'Distance' },
 *   { value: '52:30', label: 'Time' },
 *   { value: '120 m', label: 'Elev Gain' },
 * ]} />
 * ```
 */
export function StatBlock({ items, hero = false, style }: StatBlockProps) {
  const colors = useThemeColors();
  const styles = createStatBlockStyles(colors);

  const valueVariant = hero ? typeScale.heroStat : typeScale.stat;
  const labelVariant = hero ? typeScale.labelSm : typeScale.statLabel;

  return (
    <View style={[styles.row, style]} accessibilityRole="text">
      {items.map((item) => (
        <View key={item.label} style={styles.item}>
          <Text
            style={[valueVariant, styles.value]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {item.value}
          </Text>
          <Text style={[labelVariant, styles.label]}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}
