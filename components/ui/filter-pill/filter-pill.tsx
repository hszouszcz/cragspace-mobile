import { typeScale } from '@/src/theme';
import { Pressable, Text, type ViewStyle } from 'react-native';
import { useThemeColors } from '../use-theme-colors';
import { createFilterPillStyles } from './filter-pill.styles';

interface FilterPillProps {
  /** Pill label */
  label: string;
  /** Whether the pill is active/selected */
  active?: boolean;
  /** Toggle handler */
  onPress?: () => void;
  /** Additional container style */
  style?: ViewStyle;
}

/**
 * FilterPill — toggleable pill for filter chips.
 *
 * Inactive: transparent bg, default border, secondary text.
 * Active: brand muted bg, brand border, brand text.
 */
export function FilterPill({
  label,
  active = false,
  onPress,
  style,
}: FilterPillProps) {
  const colors = useThemeColors();
  const styles = createFilterPillStyles(colors);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        active ? styles.active : styles.inactive,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
    >
      <Text
        style={[
          typeScale.labelSm,
          active ? styles.textActive : styles.textInactive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
