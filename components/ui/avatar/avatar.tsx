import { Image, type ImageSource } from 'expo-image';
import { View, type ViewStyle } from 'react-native';
import { IconSymbol } from '../icon-symbol';
import { useThemeColors } from '../use-theme-colors';
import {
  createAvatarStyles,
  getAvatarDimension,
  type AvatarSize,
} from './avatar.styles';

interface AvatarProps {
  /** Avatar size preset */
  size?: AvatarSize;
  /** Image source (uri or require) */
  source?: ImageSource;
  /** Whether to show a border (for overlapping contexts) */
  bordered?: boolean;
  /** Additional container style */
  style?: ViewStyle;
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Avatar — circular image component with size presets.
 *
 * Shows a placeholder silhouette icon when no source is provided.
 * Use `bordered` when overlapping other content (cover photos, etc.).
 */
export function Avatar({
  size = 'md',
  source,
  bordered = false,
  style,
  accessibilityLabel,
}: AvatarProps) {
  const colors = useThemeColors();
  const styles = createAvatarStyles(colors);
  const dimension = getAvatarDimension(size);
  const iconSize = Math.round(dimension * 0.55);

  return (
    <View
      style={[
        styles.container,
        { width: dimension, height: dimension },
        !source && styles.placeholder,
        bordered && styles.border,
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? 'Avatar'}
    >
      {source ? (
        <Image
          source={source}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <IconSymbol
          name="person.fill"
          size={iconSize}
          color={colors.iconTertiary}
        />
      )}
    </View>
  );
}
