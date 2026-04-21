import { FAB } from '@/components/ui/fab/fab';
import { sizes , spacing } from '@/src/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/components/ui/use-theme-colors';
import { StyleSheet, View } from 'react-native';

import type { LocationStatus } from '../hooks/useUserLocation';

interface CenterOnMeFABProps {
  locationStatus: LocationStatus;
  onRequestPermission: () => void;
  onCenter: () => void;
}

/**
 * Floating action button to request GPS permission or fly the camera to the
 * user's current position.
 *
 * - undetermined: shows location icon → tapping requests permission
 * - granted: shows location icon → tapping centers the camera
 * - denied: hidden (don't nag the user)
 */
export function CenterOnMeFAB({
  locationStatus,
  onRequestPermission,
  onCenter,
}: CenterOnMeFABProps) {
  const colors = useThemeColors();

  if (locationStatus === 'denied') return null;

  const handlePress =
    locationStatus === 'granted' ? onCenter : onRequestPermission;
  const label =
    locationStatus === 'granted'
      ? 'Center map on my location'
      : 'Enable location to show your position on the map';

  return (
    <View style={styles.container} pointerEvents="box-none">
      <FAB
        onPress={handlePress}
        accessibilityLabel={label}
        icon={
          <IconSymbol
            name="location.fill"
            size={sizes.iconMd}
            color={colors.iconInverse}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing['3xl'],
    right: spacing.lg,
  },
});
