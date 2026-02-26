import BottomSheet from '@gorhom/bottom-sheet';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { useCurrentScheme, useThemeColors } from '@/components/ui';
import BottomSheetNavigator from '@/features/TopoBottomSheet/BottomSheetNavigator';
import { TopoBottomSheetHandle } from '@/features/TopoBottomSheet/TopoBottomSheetHandle';
import { type RouteListItemData } from '@/features/TopoBottomSheet/types';
import { radii, shadows, spacing } from '@/src/theme';
import { useNavigationContainerRef } from '@react-navigation/native';
import { SharedValue } from 'react-native-reanimated';

export const SNAP_POINTS = ['12%', '52%', '100%'];
export const SNAP_POINTS_IN_NUMBERS = SNAP_POINTS.map((point) =>
  Number(point.replace('%', '')),
);

type TopoBottomSheetProps = {
  data?: RouteListItemData[];
  sectorName?: string;
  sectorTitle?: string;
  onRoutePress?: (route: RouteListItemData) => void;
  onFilterPress?: () => void;
  animatedIndex: SharedValue<number>;
  snapPoints?: string[];
  onSnapPointChange?: (fromIndex: number, toIndex: number) => void;
  onGoBack?: () => void;
};

const TopoBottomSheet = ({
  data = [],
  sectorName = 'Longs Peak',
  sectorTitle = 'The Diamond',
  onRoutePress,
  onFilterPress,
  animatedIndex,
  onSnapPointChange,
  onGoBack,
}: TopoBottomSheetProps) => {
  const sheetNavigationRef = useNavigationContainerRef();
  const colors = useThemeColors();
  const scheme = useCurrentScheme();
  const isDark = scheme === 'dark';

  const [canGoBack, setCanGoBack] = useState(false);
  const [currentSnapPoint, setCurrentSnapPoint] = useState(1);

  useEffect(() => {
    const updateCanGoBack = () => {
      if (!sheetNavigationRef.isReady()) {
        setCanGoBack(false);
        return;
      }

      setCanGoBack(sheetNavigationRef.canGoBack());
    };

    const unsubscribe = sheetNavigationRef.addListener(
      'state',
      updateCanGoBack,
    );
    updateCanGoBack();

    return unsubscribe;
  }, [sheetNavigationRef]);

  const handleOnGoBack = () => {
    if (onGoBack) {
      onGoBack();
    }
  };

  return (
    <BottomSheet
      snapPoints={SNAP_POINTS}
      index={1}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      animatedIndex={animatedIndex}
      onAnimate={(fromIndex, toIndex) => {
        setCurrentSnapPoint(toIndex);
        onSnapPointChange?.(fromIndex, toIndex);
      }}
      enableContentPanningGesture={false}
      enableHandlePanningGesture
      handleComponent={() => (
        <TopoBottomSheetHandle
          sectorName={sectorName}
          sectorTitle={sectorTitle}
          onFilterPress={onFilterPress || (() => {})}
          canGoBack={canGoBack}
          sheetNavigationRef={sheetNavigationRef}
          onGoBackPressed={handleOnGoBack}
        />
      )}
      animateOnMount={false}
      backgroundStyle={[
        styles.sheetBackground,
        {
          backgroundColor: colors.surfaceSheet,
          borderTopColor: colors.separator,
        },
      ]}
      style={isDark ? shadows.none : shadows.xl}
    >
      <BottomSheetNavigator
        data={data}
        onRoutePress={onRoutePress}
        ref={sheetNavigationRef}
        currentSnapPoint={currentSnapPoint}
      />
    </BottomSheet>
  );
};

export default TopoBottomSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
    borderTopWidth: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
    paddingTop: spacing.sm,
  },
});
