import { FilterPill } from '@/components/ui';
import { spacing } from '@/src/theme';
import { memo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { type SearchFilterMeta } from './types';

interface FilterChipsRowProps {
  filters: SearchFilterMeta[];
  selectedValues: string[];
  onToggleFilter: (value: string) => void;
}

function FilterChipsRowComponent({
  filters,
  selectedValues,
  onToggleFilter,
}: FilterChipsRowProps) {
  const selectedSet = new Set(selectedValues);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        accessibilityRole="list"
        accessibilityLabel="Search filters"
      >
        {filters.map((filter) => (
          <FilterPill
            key={filter.id}
            label={filter.label}
            active={selectedSet.has(filter.value)}
            onPress={() => onToggleFilter(filter.value)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export const FilterChipsRow = memo(FilterChipsRowComponent);

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
  },
});
