import { sizes, typeScale } from '@/src/theme';
import React, { useState } from 'react';
import {
  Pressable,
  TextInput as RNTextInput,
  View,
  type TextInputProps as RNTextInputProps,
  type ViewStyle,
} from 'react-native';
import { IconSymbol } from '../icon-symbol';
import { useThemeColors } from '../use-theme-colors';
import { createTextInputStyles } from './text-input.styles';

interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  /** Show as search bar pill variant */
  variant?: 'default' | 'search';
  /** Show leading search icon (always visible in search variant) */
  showSearchIcon?: boolean;
  /** Show clear button when input has content */
  showClearButton?: boolean;
  /** Additional container style */
  containerStyle?: ViewStyle;
  /** Input text style overrides */
  inputStyle?: RNTextInputProps['style'];
  /** Optional trailing element rendered after the clear button */
  trailingAction?: React.ReactNode;
}

/**
 * TextInput — themed text input with search bar variant.
 *
 * Two variants:
 * - **default**: Standard input with `radii.md` corners.
 * - **search**: Pill-shaped search bar with `radii.full` corners.
 *
 * Supports leading search icon and trailing clear button.
 *
 * ```tsx
 * <TextInput
 *   variant="search"
 *   placeholder="Search routes, sectors…"
 *   value={query}
 *   onChangeText={setQuery}
 * />
 * ```
 */
export function TextInput({
  variant = 'default',
  showSearchIcon,
  showClearButton = true,
  containerStyle,
  inputStyle,
  trailingAction,
  value,
  onChangeText,
  placeholder,
  ...rest
}: TextInputProps) {
  const colors = useThemeColors();
  const styles = createTextInputStyles(colors);
  const [isFocused, setIsFocused] = useState(false);

  const isSearch = variant === 'search';
  const shouldShowSearchIcon = showSearchIcon ?? isSearch;
  const hasValue = Boolean(value && value.length > 0);

  const baseContainer = isSearch ? styles.searchContainer : styles.container;
  const focusedContainer = isSearch
    ? styles.searchContainerFocused
    : styles.containerFocused;
  const { onFocus, onBlur, ...restInputProps } = rest;

  function handleClear() {
    onChangeText?.('');
  }

  return (
    <View
      style={[baseContainer, isFocused && focusedContainer, containerStyle]}
    >
      {shouldShowSearchIcon ? (
        <IconSymbol
          name="magnifyingglass"
          size={sizes.iconMd}
          color={colors.iconSecondary}
        />
      ) : null}

      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        style={[typeScale.bodyLg, styles.input, inputStyle]}
        selectionColor={colors.brandPrimary}
        {...restInputProps}
      />

      {showClearButton && hasValue ? (
        <Pressable
          onPress={handleClear}
          style={styles.clearButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Clear input"
        >
          <IconSymbol
            name="xmark.circle.fill"
            size={sizes.iconSm}
            color={colors.iconTertiary}
          />
        </Pressable>
      ) : null}

      {trailingAction ?? null}
    </View>
  );
}
