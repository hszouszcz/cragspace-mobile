import { BackButton } from '@/components/ui/back-button/BackButton';
import { FilterPill } from '@/components/ui/filter-pill/filter-pill';
import { Typography } from '@/components/ui/typography/typography';
import { useThemeColors } from '@/components/ui/use-theme-colors';
import { WallDotIndicator } from '@/features/SectorTopo/WallDotIndicator';
import { radii, sizes, spacing } from '@/src/theme';
import { StyleSheet, View } from 'react-native';

interface TopoBottomSheetHandleProps {
  canGoBack: boolean;
  sheetNavigationRef: { goBack: () => void };
  sectorName: string;
  sectorTitle: string;
  isFilterActive?: boolean;
  onFilterPress: () => void;
  onGoBackPressed?: () => void;
  wallIndex?: number;
  wallCount?: number;
  wallName?: string;
}

export const TopoBottomSheetHandle = ({
  canGoBack,
  sheetNavigationRef,
  sectorName,
  sectorTitle,
  isFilterActive = false,
  onFilterPress,
  onGoBackPressed,
  wallIndex,
  wallCount,
  wallName,
}: TopoBottomSheetHandleProps) => {
  const colors = useThemeColors();

  const handleGoBack = () => {
    onGoBackPressed?.();
    sheetNavigationRef.goBack();
  };

  return (
    <View
      style={[styles.handleContainer, { backgroundColor: colors.surfaceSheet }]}
    >
      <View
        accessible={false}
        style={[
          styles.handleIndicator,
          { backgroundColor: colors.separatorOpaque },
        ]}
      />
      {/* Wall dots — only when multiple walls */}
      {wallCount !== undefined && wallCount > 1 && wallIndex !== undefined && (
        <WallDotIndicator count={wallCount} activeIndex={wallIndex} />
      )}
      <View style={styles.headerRow}>
        {canGoBack && <BackButton onPress={handleGoBack} />}
        <View
          style={styles.headerTitles}
          accessible={true}
          accessibilityLabel={`${sectorName}, ${sectorTitle}`}
        >
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
        <FilterPill
          label="Filter"
          active={isFilterActive}
          onPress={onFilterPress}
        />
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
