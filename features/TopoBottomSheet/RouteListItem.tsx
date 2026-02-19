import { PRIMARY_COLOR, type TopoColorTokens } from '@/constants/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type RouteListItemData } from './types';

const STAR_COUNT = 5;

type RouteListItemProps = {
  item: RouteListItemData;
  index: number;
  colors: TopoColorTokens;
  onPress?: (route: RouteListItemData) => void;
};

export const RouteListItem = ({
  item,
  index,
  colors,
  onPress,
}: RouteListItemProps) => {
  const rating = Math.max(0, Math.min(STAR_COUNT, item.rating ?? 0));
  const isHighlighted = item.isHighlighted;
  const isMuted = item.isMuted;

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.routeRow,
        {
          backgroundColor: isHighlighted
            ? colors.rowBackground
            : isMuted
              ? colors.rowMuted
              : colors.rowBase,
          borderColor: isHighlighted ? colors.rowBorder : colors.rowMutedBorder,
        },
        pressed && { backgroundColor: colors.rowPressed },
      ]}
    >
      <View
        style={[
          styles.routeBadge,
          {
            backgroundColor: isHighlighted
              ? colors.badgeBackground
              : colors.badgeMutedBackground,
          },
        ]}
      >
        <Text
          style={[
            styles.routeBadgeText,
            { color: isHighlighted ? colors.badgeText : colors.badgeMutedText },
          ]}
        >
          {index + 1}
        </Text>
      </View>
      <View style={styles.routeDetails}>
        <View style={styles.routeTitleRow}>
          <Text style={[styles.routeName, { color: colors.textPrimary }]}>
            {item.name}
          </Text>
          {item.grade ? (
            <View
              style={[
                styles.routeGrade,
                { backgroundColor: colors.gradeBackground },
              ]}
            >
              <Text
                style={[styles.routeGradeText, { color: colors.gradeText }]}
              >
                {item.grade}
              </Text>
            </View>
          ) : null}
        </View>
        {item.rating !== undefined ? (
          <View style={styles.routeRating}>
            {Array.from({ length: STAR_COUNT }).map((_, starIndex) => (
              <MaterialIcons
                key={`${item.id}-star-${starIndex}`}
                name="star"
                size={14}
                color={starIndex < rating ? PRIMARY_COLOR : colors.starEmpty}
                style={styles.starIcon}
              />
            ))}
          </View>
        ) : null}
      </View>
      <MaterialIcons name="chevron-right" size={22} color={colors.chevron} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  routeBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  routeBadgeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  routeDetails: {
    flex: 1,
  },
  routeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeName: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  routeGrade: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  routeGradeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  routeRating: {
    flexDirection: 'row',
    marginTop: 6,
  },
  starIcon: {
    marginRight: 2,
  },
});
