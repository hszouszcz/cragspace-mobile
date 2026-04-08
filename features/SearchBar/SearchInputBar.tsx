import { TextInput } from '@/components/ui';
import { spacing } from '@/src/theme';
import { StyleSheet, View } from 'react-native';

interface SearchInputBarProps {
  query: string;
  placeholder: string;
  onQueryChange: (value: string) => void;
  onFocusChange?: (isFocused: boolean) => void;
  onSubmit?: (value: string) => void;
}

export function SearchInputBar({
  query,
  placeholder,
  onQueryChange,
  onFocusChange,
  onSubmit,
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
  },
});
