import BottomSheet from '@gorhom/bottom-sheet';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { getTopoColorTokens } from '@/constants/theme';
import BottomSheetNavigator from '@/features/TopoBottomSheet/BottomSheetNavigator';
import { TopoBottomSheetHandle } from '@/features/TopoBottomSheet/TopoBottomSheetHandle';
import { type RouteListItemData } from '@/features/TopoBottomSheet/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
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
  const colorScheme = useColorScheme();
  const colors = getTopoColorTokens(colorScheme === 'dark' ? 'dark' : 'light');

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
          colors={colors}
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
          backgroundColor: colors.sheetBackground,
          borderTopColor: colors.sheetBorder,
        },
      ]}
      style={styles.sheetContainer}
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
  sheetContainer: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  sheetBackground: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
  },
  handleContainer: {
    paddingTop: 6,
    paddingBottom: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
});
