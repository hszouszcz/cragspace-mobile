import { sizes, typeScale } from '@/src/theme';
import { Pressable, Text, View, type ViewStyle } from 'react-native';
import { IconSymbol } from '../icon-symbol';
import { useThemeColors } from '../use-theme-colors';
import { createListItemStyles } from './list-item.styles';

interface ListItemProps {
  /** Primary text */
  title: string;
  /** Secondary description text */
  subtitle?: string;
  /** Leading element (icon or avatar) */
  leading?: React.ReactNode;
  /** Trailing element (rendered before chevron) */
  trailing?: React.ReactNode;
  /** Show trailing chevron indicator */
  showChevron?: boolean;
  /** Use compact variant (44px height) */
  compact?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Additional container style */
  style?: ViewStyle;
  /** Accessibility label override */
  accessibilityLabel?: string;
}

/**
 * ListItem — a pressable row for lists and menus.
 *
 * Two variants:
 * - **standard** (default): 56px min height, titleLg + bodySm.
 * - **compact**: 44px min height, titleSm text.
 *
 * ```tsx
 * <ListItem
 *   title="Route Name"
 *   subtitle="Boulder, CO"
 *   leading={<Avatar size="md" source={...} />}
 *   showChevron
 *   onPress={() => {}}
 * />
 * ```
 */
export function ListItem({
  title,
  subtitle,
  leading,
  trailing,
  showChevron = false,
  compact = false,
  onPress,
  style,
  accessibilityLabel,
}: ListItemProps) {
  const colors = useThemeColors();
  const styles = createListItemStyles(colors);

  const containerStyle = compact ? styles.containerCompact : styles.container;
  const titleStyle = compact ? typeScale.titleSm : typeScale.titleLg;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        containerStyle,
        pressed && styles.pressedOverlay,
        style,
      ]}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={accessibilityLabel ?? title}
    >
      {leading}

      <View style={styles.textContainer}>
        <Text style={[titleStyle, styles.primaryText]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[typeScale.bodySm, styles.secondaryText]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {trailing || showChevron ? (
        <View style={styles.trailing}>
          {trailing}
          {showChevron ? (
            <IconSymbol
              name="chevron.right"
              size={sizes.iconMd}
              color={colors.iconSecondary}
            />
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

interface ListSeparatorProps {
  /** Whether there's a leading avatar/icon (increases left inset) */
  hasLeading?: boolean;
}

/**
 * ListSeparator — hairline divider between ListItem rows.
 */
export function ListSeparator({ hasLeading = false }: ListSeparatorProps) {
  const colors = useThemeColors();
  const styles = createListItemStyles(colors);

  return (
    <View style={hasLeading ? styles.separatorWithLeading : styles.separator} />
  );
}
