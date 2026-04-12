import { TextInput } from '@/components/ui';
import { spacing } from '@/src/theme';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

const DEBOUNCE_MS = 150;

interface SearchInputBarProps {
  query: string;
  placeholder: string;
  onQueryChange: (value: string) => void;
  onFocusChange?: (isFocused: boolean) => void;
  onSubmit?: (value: string) => void;
  inputContainerStyle?: ViewStyle;
  trailingAction?: React.ReactNode;
}

export function SearchInputBar({
  query,
  placeholder,
  onQueryChange,
  onFocusChange,
  onSubmit,
  inputContainerStyle,
  trailingAction,
}: SearchInputBarProps) {
  const [localQuery, setLocalQuery] = useState(query);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external resets (e.g. clear button in parent) to local state
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleChangeText(value: string) {
    setLocalQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onQueryChange(value);
    }, DEBOUNCE_MS);
  }

  return (
    <View style={styles.container}>
      <TextInput
        variant="search"
        value={localQuery}
        placeholder={placeholder}
        onChangeText={handleChangeText}
        onFocus={() => onFocusChange?.(true)}
        onBlur={() => onFocusChange?.(false)}
        onSubmitEditing={() => onSubmit?.(localQuery)}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Search input"
        accessibilityHint="Type to search by keyword"
        containerStyle={inputContainerStyle}
        trailingAction={trailingAction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
  },
});
