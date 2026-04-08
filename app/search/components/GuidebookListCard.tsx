import { Card, Typography } from '@/components/ui';
import { radii, spacing } from '@/src/theme';
import { StyleSheet, View } from 'react-native';
import type { ListGuidebook } from '../types';

interface GuidebookListCardProps {
  item: ListGuidebook;
}

export function GuidebookListCard({ item }: GuidebookListCardProps) {
  return (
    <Card style={styles.card} onPress={() => {}}>
      <View style={styles.inner}>
        <View style={[styles.thumbnail, { backgroundColor: item.color }]} />
        <View style={styles.content}>
          <Typography variant="titleSm">{item.title}</Typography>
          <Typography variant="captionLg" color="secondary">
            {item.subtitle}
          </Typography>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: radii.sm,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
});
