import {
  Badge,
  IconSymbol,
  Typography,
  useThemeColors,
  XStack,
} from '@/components/ui';
import { sizes } from '@/src/theme';
import { Pressable, View } from 'react-native';
import { createRouteListItemStyles } from './RouteListItem.styles';
import { type RouteListItemData } from './types';

const STAR_COUNT = 5;

interface RouteListItemProps {
  item: RouteListItemData;
  index: number;
  onPress?: (route: RouteListItemData) => void;
}

export function RouteListItem({ item, index, onPress }: RouteListItemProps) {
  const colors = useThemeColors();
  const styles = createRouteListItemStyles(colors);

  const rating = Math.max(0, Math.min(STAR_COUNT, item.rating ?? 0));
  const isHighlighted = item.isHighlighted;
  const isMuted = item.isMuted;

  const rowBg = isHighlighted
    ? colors.brandPrimaryMuted
    : isMuted
      ? colors.backgroundSecondary
      : colors.surfaceCard;

  const rowBorderColor = isHighlighted
    ? colors.borderBrand
    : colors.borderDefault;

  const ratingLabel =
    item.rating !== undefined ? `, ${rating} out of ${STAR_COUNT} stars` : '';

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      accessibilityRole="button"
      accessibilityLabel={`Route ${index + 1}: ${item.name}${item.grade ? `, grade ${item.grade}` : ''}${ratingLabel}`}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: rowBg,
          borderColor: rowBorderColor,
        },
        pressed && styles.pressedOverlay,
      ]}
    >
      <View
        style={[
          styles.numberBadge,
          {
            backgroundColor: isHighlighted
              ? colors.badgePrimaryBg
              : colors.badgeSecondaryBg,
          },
        ]}
      >
        <Typography
          variant="titleSm"
          color={isHighlighted ? 'inverse' : 'secondary'}
        >
          {index + 1}
        </Typography>
      </View>

      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Typography variant="titleLg" numberOfLines={1} style={styles.name}>
            {item.name}
          </Typography>
          {item.grade ? <Badge variant="secondary" label={item.grade} /> : null}
        </View>
        {item.rating !== undefined ? (
          <View
            style={styles.metadataRow}
            accessibilityElementsHidden
            importantForAccessibility="no"
          >
            <XStack gap={3} align="center">
              <IconSymbol
                name="star.fill"
                size={sizes.iconSm}
                color={rating ? colors.brandPrimary : colors.iconTertiary}
                style={styles.starIcon}
              />
              <Typography variant="bodySm" color="secondary">
                {item.rating}
              </Typography>
            </XStack>
            <XStack gap={4} align="center">
              <IconSymbol
                name="star.fill"
                size={sizes.iconSm}
                color={rating ? colors.brandPrimary : colors.iconTertiary}
                style={styles.starIcon}
              />
              <Typography variant="bodySm" color="secondary">
                {item.length}
              </Typography>
            </XStack>
            <XStack gap={3} align="center">
              <IconSymbol
                name="star.fill"
                size={sizes.iconSm}
                color={rating ? colors.brandPrimary : colors.iconTertiary}
                style={styles.starIcon}
              />
              <Typography variant="bodySm" color="secondary">
                {item.rating}
              </Typography>
            </XStack>
            <XStack gap={3} align="center">
              <IconSymbol
                name="star.fill"
                size={sizes.iconSm}
                color={rating ? colors.brandPrimary : colors.iconTertiary}
                style={styles.starIcon}
              />
              <Typography variant="bodySm" color="secondary">
                {item.type}
              </Typography>
            </XStack>
          </View>
        ) : null}
      </View>

      <IconSymbol
        name="chevron.right"
        size={sizes.iconMd}
        color={colors.iconSecondary}
      />
    </Pressable>
  );
}
