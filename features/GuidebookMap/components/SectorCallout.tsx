import { useThemeColors } from '@/components/ui/use-theme-colors';
import { radii, spacing, typeScale } from '@/src/theme';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { MapSelection } from '../hooks/useMapSelection';

const SNAP_POINTS = ['32%'];

interface SectorCalloutProps {
  selection: MapSelection;
  onNavigate: (sectorId: string) => void;
  onClose: () => void;
}

export const SectorCallout = forwardRef<BottomSheet, SectorCalloutProps>(
  function SectorCallout({ selection, onNavigate, onClose }, ref) {
    const colors = useThemeColors();

    const sector = selection?.type === 'sector' ? selection : null;

    const renderBackdrop = (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.2}
      />
    );

    const handleChange = (index: number) => {
      if (index === -1) onClose();
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={SNAP_POINTS}
        enablePanDownToClose
        onChange={handleChange}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.surfaceSheet }}
        handleIndicatorStyle={{ backgroundColor: colors.iconTertiary }}
        style={styles.sheet}
      >
        <BottomSheetView style={styles.content}>
          {sector && (
            <>
              <Text
                style={[styles.name, { color: colors.textPrimary }]}
                numberOfLines={1}
              >
                {sector.name}
              </Text>

              <View style={styles.metaRow}>
                <Text style={[styles.meta, { color: colors.textSecondary }]}>
                  {sector.routeCount} routes
                </Text>
                {sector.approachMinutes !== null && (
                  <>
                    <Text
                      style={[styles.metaDot, { color: colors.textTertiary }]}
                    >
                      ·
                    </Text>
                    <Text
                      style={[styles.meta, { color: colors.textSecondary }]}
                    >
                      {sector.approachMinutes} min approach
                    </Text>
                  </>
                )}
              </View>

              {sector.hasWalls ? (
                <Pressable
                  onPress={() => onNavigate(sector.sectorId)}
                  style={[
                    styles.ctaButton,
                    { backgroundColor: colors.brandPrimary },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`View topo for ${sector.name}`}
                >
                  <Text style={[styles.ctaText, { color: colors.textInverse }]}>
                    View Topo
                  </Text>
                </Pressable>
              ) : (
                <Text
                  style={[styles.noTopoText, { color: colors.textTertiary }]}
                >
                  No topo available
                </Text>
              )}
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing['3xl'],
  },
  name: {
    ...typeScale.headlineSm,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  meta: {
    ...typeScale.bodySm,
  },
  metaDot: {
    ...typeScale.bodySm,
  },
  ctaButton: {
    height: 48,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    ...typeScale.labelLg,
  },
  noTopoText: {
    ...typeScale.bodySm,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
