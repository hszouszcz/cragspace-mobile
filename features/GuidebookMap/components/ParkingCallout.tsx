import { useThemeColors } from '@/components/ui/use-theme-colors';
import { radii, spacing, typeScale } from '@/src/theme';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { StyleSheet, Text } from 'react-native';

import type { MapSelection } from '../hooks/useMapSelection';

const SNAP_POINTS = ['24%'];

interface ParkingCalloutProps {
  selection: MapSelection;
  onClose: () => void;
}

export const ParkingCallout = forwardRef<BottomSheet, ParkingCalloutProps>(
  function ParkingCallout({ selection, onClose }, ref) {
    const colors = useThemeColors();

    const parking = selection?.type === 'parking' ? selection : null;

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
          {parking && (
            <>
              <Text
                style={[styles.label, { color: colors.textPrimary }]}
                numberOfLines={1}
              >
                {parking.label}
              </Text>
              {parking.directions && (
                <Text
                  style={[styles.directions, { color: colors.textSecondary }]}
                >
                  {parking.directions}
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
    paddingBottom: spacing['2xl'],
  },
  label: {
    ...typeScale.headlineSm,
    marginBottom: spacing.xs,
  },
  directions: {
    ...typeScale.bodySm,
  },
});
