import { typeScale } from '@/src/theme';
import { Pressable, Text, View, type ViewStyle } from 'react-native';
import { useCurrentScheme, useThemeColors } from '../use-theme-colors';
import { createSegmentedControlStyles } from './segmented-control.styles';

interface SegmentedControlProps {
  /** Array of segment labels */
  segments: string[];
  /** Index of the currently selected segment */
  selectedIndex: number;
  /** Selection change handler */
  onChange: (index: number) => void;
  /** Additional container style */
  style?: ViewStyle;
}

/**
 * SegmentedControl — inline tab switcher for toggling between views.
 *
 * ```tsx
 * <SegmentedControl
 *   segments={['Map', 'List', 'Chart']}
 *   selectedIndex={activeTab}
 *   onChange={setActiveTab}
 * />
 * ```
 */
export function SegmentedControl({
  segments,
  selectedIndex,
  onChange,
  style,
}: SegmentedControlProps) {
  const colors = useThemeColors();
  const scheme = useCurrentScheme();
  const isDark = scheme === 'dark';
  const styles = createSegmentedControlStyles(colors, isDark);

  return (
    <View style={[styles.container, style]} accessibilityRole="tablist">
      {segments.map((label, index) => {
        const isActive = index === selectedIndex;

        return (
          <Pressable
            key={label}
            onPress={() => onChange(index)}
            style={[
              styles.segment,
              isActive ? styles.segmentActive : styles.segmentInactive,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={label}
          >
            <Text
              style={[
                typeScale.labelSm,
                isActive ? styles.labelActive : styles.labelInactive,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
