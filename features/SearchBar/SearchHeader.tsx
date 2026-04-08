import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { FilterChipsRow } from './FilterChipsRow';
import { SearchInputBar } from './SearchInputBar';
import { type SearchFilterMeta } from './types';

interface SearchHeaderProps {
  query: string;
  placeholder: string;
  filters: SearchFilterMeta[];
  selectedValues: string[];
  onQueryChange: (value: string) => void;
  onToggleFilter: (value: string) => void;
  onSubmit?: (value: string) => void;
  onFocusChange?: (isFocused: boolean) => void;
}

export function SearchHeader({
  query,
  placeholder,
  filters,
  selectedValues,
  onQueryChange,
  onToggleFilter,
  onSubmit,
  onFocusChange,
}: SearchHeaderProps) {
  const mountProgress = useSharedValue(0);
  const focusProgress = useSharedValue(0);

  useEffect(() => {
    mountProgress.value = withTiming(1, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [mountProgress]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(mountProgress.value, [0, 1], [0, 1]),
    transform: [
      {
        translateY: interpolate(mountProgress.value, [0, 1], [8, 0]),
      },
    ],
  }));

  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(focusProgress.value, [0, 1], [1, 1.01]),
      },
    ],
  }));

  function handleFocusChange(isFocused: boolean) {
    focusProgress.value = withTiming(isFocused ? 1 : 0, {
      duration: isFocused ? 160 : 140,
      easing: Easing.out(Easing.quad),
    });
    onFocusChange?.(isFocused);
  }

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <Animated.View style={animatedInputStyle}>
        <SearchInputBar
          query={query}
          placeholder={placeholder}
          onQueryChange={onQueryChange}
          onFocusChange={handleFocusChange}
          onSubmit={onSubmit}
        />
      </Animated.View>
      <FilterChipsRow
        filters={filters}
        selectedValues={selectedValues}
        onToggleFilter={onToggleFilter}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
