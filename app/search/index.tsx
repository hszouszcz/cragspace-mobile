import {
  Button,
  EmptyState,
  Typography,
  useThemeColors,
} from '@/components/ui';
import {
  SearchHeader,
  createSearchStateOptions,
  type SearchContextConfig,
  type SearchFilterMeta,
  useSearchFiltersState,
} from '@/features/SearchBar';
import { radii, spacing } from '@/src/theme';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SearchScreenParams = {
  contextId?: string | string[];
  placeholder?: string | string[];
  filters?: string | string[];
  initialQuery?: string | string[];
  initialSelectedValues?: string | string[];
};

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseFiltersMeta(rawValue?: string): SearchFilterMeta[] {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (filter): filter is SearchFilterMeta =>
        filter &&
        typeof filter.id === 'string' &&
        typeof filter.label === 'string' &&
        typeof filter.value === 'string',
    );
  } catch {
    return [];
  }
}

function parseSelectedValues(rawValue?: string): string[] {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((value): value is string => typeof value === 'string');
  } catch {
    return [];
  }
}

export default function SearchScreen() {
  const colors = useThemeColors();
  const params = useLocalSearchParams<SearchScreenParams>();
  const filtersMeta = useMemo(
    () => parseFiltersMeta(getSingleParam(params.filters)),
    [params.filters],
  );

  const contextConfig = useMemo<SearchContextConfig>(
    () => ({
      contextId: getSingleParam(params.contextId) ?? 'dynamic-search',
      placeholder: getSingleParam(params.placeholder) ?? 'Search',
      filters: filtersMeta,
      initialQuery: getSingleParam(params.initialQuery),
      initialSelectedValues: parseSelectedValues(
        getSingleParam(params.initialSelectedValues),
      ),
    }),
    [
      filtersMeta,
      params.contextId,
      params.initialQuery,
      params.initialSelectedValues,
      params.placeholder,
    ],
  );

  const {
    query,
    setQuery,
    selectedValues,
    toggleFilter,
    resetAll,
    appliedPayload,
  } = useSearchFiltersState(createSearchStateOptions(contextConfig));

  const selectedCount = selectedValues.length;

  const hasConfig = contextConfig.filters.length > 0;

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.screen, { backgroundColor: colors.backgroundPrimary }]}
    >
      {!hasConfig ? (
        <EmptyState
          title="No filters metadata provided"
          description="Pass filters via route params to render the dynamic search experience."
          action={
            <Typography variant="bodySm">
              Param: filters (JSON array)
            </Typography>
          }
          style={styles.emptyState}
        />
      ) : (
        <View style={styles.content}>
          <SearchHeader
            query={query}
            placeholder={contextConfig.placeholder}
            filters={contextConfig.filters}
            selectedValues={selectedValues}
            onQueryChange={setQuery}
            onToggleFilter={toggleFilter}
          />

          <View style={styles.actionsRow}>
            <Typography variant="bodySm" color="secondary">
              Context: {contextConfig.contextId}
            </Typography>
            <Button variant="text" label="Clear all" onPress={resetAll} />
          </View>

          <ScrollView
            style={[styles.previewCard, { borderColor: colors.borderDefault }]}
            contentContainerStyle={styles.previewContent}
          >
            <Typography variant="labelSm" color="secondary">
              APPLIED PAYLOAD
            </Typography>
            <Typography variant="bodySm">
              Query: {appliedPayload.query || '-'}
            </Typography>
            <Typography variant="bodySm">
              Selected filters: {selectedCount}
            </Typography>
            <Typography variant="bodySm">
              Values: {appliedPayload.selectedValues.join(', ') || '-'}
            </Typography>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: spacing.md,
  },
  actionsRow: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewCard: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  previewContent: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  emptyState: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
});
