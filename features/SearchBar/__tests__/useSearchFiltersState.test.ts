import { act, renderHook } from '@testing-library/react-native';
import {
  buildAppliedFiltersPayload,
  createSearchStateOptions,
  useSearchFiltersState,
} from '../useSearchFiltersState';
import { type SearchContextConfig } from '../types';

const filters = [
  { id: 'f1', label: 'All Disciplines', value: 'all' },
  { id: 'f2', label: 'Bouldering', value: 'bouldering' },
  { id: 'f3', label: 'Sport Climbing', value: 'sport' },
];

describe('useSearchFiltersState', () => {
  it('updates query and toggles multi-select filters', () => {
    const { result } = renderHook(() =>
      useSearchFiltersState({
        contextId: 'routes',
        filters,
      }),
    );

    act(() => {
      result.current.setQuery('Arenes');
      result.current.toggleFilter('bouldering');
      result.current.toggleFilter('sport');
    });

    expect(result.current.query).toBe('Arenes');
    expect(result.current.selectedValues).toEqual(['bouldering', 'sport']);
    expect(result.current.isSelected('bouldering')).toBe(true);
    expect(result.current.isSelected('all')).toBe(false);
  });

  it('clears selected filters and resets all state', () => {
    const { result } = renderHook(() =>
      useSearchFiltersState({
        contextId: 'guidebook',
        filters,
        initialQuery: 'Mamutowa',
        initialSelectedValues: ['all', 'sport'],
      }),
    );

    act(() => {
      result.current.clearAllFilters();
    });

    expect(result.current.selectedValues).toEqual([]);
    expect(result.current.query).toBe('Mamutowa');

    act(() => {
      result.current.resetAll();
    });

    expect(result.current.query).toBe('');
    expect(result.current.selectedValues).toEqual([]);
  });
});

describe('search filters payload builders', () => {
  it('builds deterministic applied payload', () => {
    const payload = buildAppliedFiltersPayload(
      'routes',
      '  challenge  ',
      ['sport', 'sport', 'all'],
      filters,
    );

    expect(payload).toEqual({
      contextId: 'routes',
      query: 'challenge',
      selectedValues: ['sport', 'all'],
      selectedFilters: [filters[0], filters[2]],
    });
  });

  it('creates state options from context config', () => {
    const config: SearchContextConfig = {
      contextId: 'guidebook',
      placeholder: 'Find a guidebook',
      filters,
      initialQuery: 'Podzamcze',
      initialSelectedValues: ['all'],
    };

    expect(createSearchStateOptions(config)).toEqual({
      contextId: 'guidebook',
      filters,
      initialQuery: 'Podzamcze',
      initialSelectedValues: ['all'],
    });
  });
});
