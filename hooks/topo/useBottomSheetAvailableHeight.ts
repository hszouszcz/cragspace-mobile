import { SNAP_POINTS_IN_NUMBERS } from '@/components/TopoBottomSheet';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MOCK_HANDLE_HEIGHT = 81;

export const useBottomSheetAvailableHeight = (currentSnapPoint: number) => {
  const { bottom, top } = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const snapHeights = SNAP_POINTS_IN_NUMBERS.map(
    (p: number) => screenHeight * (Number(p) / 100),
  );
  const availableHeight =
    snapHeights[currentSnapPoint] - MOCK_HANDLE_HEIGHT - bottom - top;
  return { availableHeight };
};
