import { TextInput } from '@/components/ui';
import { spacing } from '@/src/theme';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

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
  return (
    <View style={styles.container}>
      <TextInput
        variant="search"
        value={query}
        placeholder={placeholder}
        onChangeText={onQueryChange}
        onFocus={() => onFocusChange?.(true)}
        onBlur={() => onFocusChange?.(false)}
        onSubmitEditing={() => onSubmit?.(query)}
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
