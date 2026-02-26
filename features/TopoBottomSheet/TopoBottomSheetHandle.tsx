import {
  Button,
  FilterPill,
  Typography,
  useThemeColors,
} from '@/components/ui';
import { radii, sizes, spacing } from '@/src/theme';
import { StyleSheet, View } from 'react-native';

interface TopoBottomSheetHandleProps {
  canGoBack: boolean;
  sheetNavigationRef: any; // Replace with correct type if available
  sectorName: string;
  sectorTitle: string;
  onFilterPress: () => void;
  onGoBackPressed?: () => void;
}

export const TopoBottomSheetHandle = ({
  canGoBack,
  sheetNavigationRef,
  sectorName,
  sectorTitle,
  onFilterPress,
  onGoBackPressed,
}: TopoBottomSheetHandleProps) => {
  const colors = useThemeColors();

  const handleGoBack = () => {
    if (onGoBackPressed) {
      onGoBackPressed();
    }
    sheetNavigationRef.goBack();
  };

  return (
    <View
      style={[styles.handleContainer, { backgroundColor: colors.surfaceSheet }]}
    >
      <View
        style={[
          styles.handleIndicator,
          { backgroundColor: colors.separatorOpaque },
        ]}
      />
      <View style={styles.headerRow}>
        {canGoBack && (
          <Button variant="text" label="Back" onPress={handleGoBack} />
        )}
        <View style={styles.headerTitles}>
          <Typography variant="statLabel" color="brand">
            {sectorName.toUpperCase()}
          </Typography>
          <Typography
            variant="headlineLg"
            color="primary"
            style={styles.titleSpacing}
          >
            {sectorTitle}
          </Typography>
        </View>
        <FilterPill label="Filter" active onPress={onFilterPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  handleContainer: {
    paddingTop: spacing.sm_,
    paddingBottom: spacing.md,
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
  },
  handleIndicator: {
    alignSelf: 'center',
    width: sizes.handleWidth,
    height: sizes.handleHeight,
    borderRadius: radii.full,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  headerTitles: {
    flex: 1,
  },
  titleSpacing: {
    marginTop: spacing.xs,
  },
});
