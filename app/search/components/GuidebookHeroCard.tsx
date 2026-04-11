import { Badge, Button, Typography } from '@/components/ui';
import { radii, spacing } from '@/src/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import type { HeroGuidebook } from '../types';

const CARD_WIDTH = Dimensions.get('window').width - spacing.lg * 2;

interface GuidebookHeroCardProps {
  item: HeroGuidebook;
}

export function GuidebookHeroCard({ item }: GuidebookHeroCardProps) {
  const router = useRouter();

  const handleExplore = useCallback(() => {
    router.push({ pathname: '/guidebook/[id]', params: { id: item.id } });
  }, [router, item.id]);

  return (
    <Pressable
      style={styles.card}
      onPress={handleExplore}
      accessibilityRole="button"
      accessibilityLabel={`Otwórz przewodnik ${item.title}`}
    >
      {item.image != null ? (
        <Image
          source={{ uri: item.image }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: item.color },
          ]}
        />
      )}

      {item.badge != null && (
        <Badge variant="primary" label={item.badge} style={styles.badge} />
      )}

      {/* Bottom scrim + content */}
      <View style={styles.scrim}>
        <View style={styles.content}>
          <Typography
            variant="headlineSm"
            color="inverse"
            numberOfLines={2}
            style={styles.title}
          >
            {item.title}
          </Typography>

          <Typography
            variant="captionLg"
            color="inverse"
            style={styles.location}
          >
            {item.location}
            {item.year != null ? `  ·  ${item.year}` : ''}
          </Typography>

          {item.publisher != null && (
            <Typography
              variant="captionSm"
              color="inverse"
              style={styles.publisher}
            >
              {item.publisher}
            </Typography>
          )}

          <Button
            variant="primary"
            label="Explore"
            style={styles.button}
            onPress={handleExplore}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radii.lg,
    overflow: 'hidden',
    aspectRatio: 2 / 3,
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    // Two-stop scrim: transparent top → dark bottom
    backgroundColor: 'transparent',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing['3xl'],
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  title: {
    marginBottom: spacing.xs,
  },
  location: {
    opacity: 0.85,
  },
  publisher: {
    opacity: 0.6,
    marginTop: spacing.xxs,
  },
  button: {
    alignSelf: 'stretch',
    marginTop: spacing.lg,
  },
});
