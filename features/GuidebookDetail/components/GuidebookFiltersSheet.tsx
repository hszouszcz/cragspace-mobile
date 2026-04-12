import { useThemeColors } from '@/components/ui/use-theme-colors';
import { FilterChipsRow } from '@/features/SearchBar/FilterChipsRow';
import type { SearchFilterMeta } from '@/features/SearchBar/types';
import type { GradeRange } from '@/services/guidebooks/guidebook-detail-search';
import { KURTYKI_GRADES } from '@/services/guidebooks/types';
import { radii, spacing, typeScale } from '@/src/theme';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GradeRangeSlider } from './GradeRangeSlider';

const STYLE_FILTERS: SearchFilterMeta[] = [
  { id: 'all', label: 'All', value: 'all', group: 'style' },
  { id: 'sport', label: 'Sport', value: 'sport', group: 'style' },
  { id: 'trad', label: 'Trad', value: 'trad', group: 'style' },
  { id: 'bouldering', label: 'Boulder', value: 'bouldering', group: 'style' },
];

const DEFAULT_MIN = KURTYKI_GRADES[0];
const DEFAULT_MAX = KURTYKI_GRADES[KURTYKI_GRADES.length - 1];
const SNAP_POINTS = ['55%'];

interface GuidebookFiltersSheetProps {
  styleValue: string;
  onStyleChange: (value: string) => void;
  gradeRange: GradeRange;
  onGradeRangeChange: (range: GradeRange) => void;
  onClose: () => void;
}

export const GuidebookFiltersSheet = forwardRef<
  BottomSheet,
  GuidebookFiltersSheetProps
>(function GuidebookFiltersSheet(
  { styleValue, onStyleChange, gradeRange, onGradeRangeChange, onClose },
  ref,
) {
  const colors = useThemeColors();

  const handleChange = (index: number) => {
    if (index === -1) onClose();
  };

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.4}
    />
  );

  const handleReset = () => {
    onStyleChange('all');
    onGradeRangeChange({ min: DEFAULT_MIN, max: DEFAULT_MAX });
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={SNAP_POINTS}
      enablePanDownToClose
      onChange={handleChange}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.surfaceSheet }}
      handleIndicatorStyle={{ backgroundColor: colors.iconTertiary }}
      style={styles.sheet}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Filters
          </Text>
          <Pressable
            onPress={handleReset}
            accessibilityRole="button"
            accessibilityLabel="Reset all filters"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={[styles.resetText, { color: colors.brandSecondary }]}>
              Reset
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>
          TYPE
        </Text>
        <FilterChipsRow
          filters={STYLE_FILTERS}
          selectedValues={[styleValue]}
          onToggleFilter={onStyleChange}
        />

        <Text
          style={[
            styles.sectionLabel,
            styles.gradeLabel,
            { color: colors.textTertiary },
          ]}
        >
          GRADE RANGE
        </Text>
        <GradeRangeSlider
          range={gradeRange}
          onRangeChange={onGradeRangeChange}
        />
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
  },
  content: {
    paddingBottom: spacing['4xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typeScale.headlineSm,
  },
  resetText: {
    ...typeScale.bodySm,
  },
  sectionLabel: {
    ...typeScale.captionSm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    letterSpacing: typeScale.statLabel.letterSpacing,
  },
  gradeLabel: {
    marginTop: spacing.lg,
  },
});
