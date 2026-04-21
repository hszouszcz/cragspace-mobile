import { useThemeColors } from '@/components/ui/use-theme-colors';
import { radii, shadows, spacing, typeScale } from '@/src/theme';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import type { OfflineStatus } from '../hooks/useOfflinePack';

interface MapDownloadBannerProps {
  status: OfflineStatus;
  progress: number;
  onDownload: () => void;
}

/**
 * Overlay banner at the bottom of the map that manages offline tile downloads.
 *
 * - checking: hidden while determining pack state
 * - unknown: "Download map for offline use" CTA
 * - downloading: animated progress bar
 * - complete: "✓ Available offline" badge, auto-hides after 3s
 * - error: "Download failed — retry" CTA
 */
export function MapDownloadBanner({
  status,
  progress,
  onDownload,
}: MapDownloadBannerProps) {
  const colors = useThemeColors();
  const opacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Fade in/out based on status
  useEffect(() => {
    const shouldShow = status !== 'checking' && status !== 'complete';
    Animated.timing(opacity, {
      toValue: shouldShow ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [status, opacity]);

  // Auto-hide after complete
  useEffect(() => {
    if (status !== 'complete') return;
    // Brief flash of "available offline"
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(2500),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [status, opacity]);

  // Animate progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress / 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  if (status === 'checking') return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceCard, opacity },
        shadows.sm,
      ]}
      pointerEvents={status === 'checking' ? 'none' : 'auto'}
    >
      {status === 'unknown' && (
        <Pressable
          onPress={onDownload}
          accessibilityRole="button"
          accessibilityLabel="Download map for offline use"
        >
          <Text style={[styles.text, { color: colors.brandPrimary }]}>
            Download map for offline use
          </Text>
        </Pressable>
      )}

      {status === 'downloading' && (
        <View>
          <Text style={[styles.text, { color: colors.textPrimary }]}>
            Downloading… {progress}%
          </Text>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: colors.backgroundTertiary },
            ]}
          >
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.brandPrimary,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      )}

      {status === 'complete' && (
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          ✓ Map available offline
        </Text>
      )}

      {status === 'error' && (
        <Pressable
          onPress={onDownload}
          accessibilityRole="button"
          accessibilityLabel="Download failed, tap to retry"
        >
          <Text style={[styles.text, { color: colors.semanticError }]}>
            Download failed — tap to retry
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing['3xl'],
    left: spacing.lg,
    right: spacing.lg + 56 + spacing.sm, // leave room for CenterOnMeFAB (56px wide)
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
  },
  text: {
    ...typeScale.labelSm,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
