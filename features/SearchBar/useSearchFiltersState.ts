import { useState } from 'react';
import {
  type SearchAppliedFiltersPayload,
  type SearchContextConfig,
  type SearchFilterMeta,
} from './types';

interface UseSearchFiltersStateOptions {
  contextId: string;
  filters: SearchFilterMeta[];
  initialQuery?: string;
  initialSelectedValues?: string[];
}

export function buildAppliedFiltersPayload(
  contextId: string,
  query: string,
  selectedValues: string[],
  filters: SearchFilterMeta[],
): SearchAppliedFiltersPayload {
  const selectedSet = new Set(selectedValues);
  const selectedFilters = filters.filter((filter) =>
    selectedSet.has(filter.value),
  );

  return {
    contextId,
    query: query.trim(),
    selectedValues: [...selectedSet],
    selectedFilters,
  };
}

export function createSearchStateOptions(
  config: SearchContextConfig,
): UseSearchFiltersStateOptions {
  return {
    contextId: config.contextId,
    filters: config.filters,
    initialQuery: config.initialQuery,
    initialSelectedValues: config.initialSelectedValues,
  };
}

export function useSearchFiltersState({
  contextId,
  filters,
  initialQuery = '',
  initialSelectedValues = [],
}: UseSearchFiltersStateOptions) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedValues, setSelectedValues] = useState<string[]>([
    ...new Set(initialSelectedValues),
  ]);

  const selectedSet = new Set(selectedValues);

  const isSelected = (value: string) => selectedSet.has(value);

  const toggleFilter = (value: string) => {
    setSelectedValues((current) => {
      const hasValue = current.includes(value);
      if (hasValue) {
        return current.filter((item) => item !== value);
      }

      return [...current, value];
    });
  };

  const clearAllFilters = () => {
    setSelectedValues([]);
  };

  const resetAll = () => {
    setQuery('');
    setSelectedValues([]);
  };

  const appliedPayload = buildAppliedFiltersPayload(
    contextId,
    query,
    selectedValues,
    filters,
  );

  return {
    query,
    setQuery,
    selectedValues,
    isSelected,
    toggleFilter,
    clearAllFilters,
    resetAll,
    appliedPayload,
  };
}
