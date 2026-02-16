import { SNAP_POINTS_IN_NUMBERS } from '@/components/TopoBottomSheet';
import { getTopoColorTokens } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme.web';
import { useBottomSheetScrollableCreator } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { RouteListItem } from './RouteListItem';
import { type RouteListItemData } from './types';

const ESTIMATED_ITEM_SIZE = 76;

interface RoutesListProps {
  routes: RouteListItemData[];
  onRoutePress?: (route: RouteListItemData) => void;
  currentSnapPoint?: number;
}

export const RoutesList = ({
  routes,
  onRoutePress,
  currentSnapPoint = 2,
}: RoutesListProps) => {
  const colorScheme = useColorScheme();
  const Scrollable = useBottomSheetScrollableCreator();
  const { height: screenHeight } = useWindowDimensions();
  const { navigate } = useNavigation<any>();

  const snapHeights = SNAP_POINTS_IN_NUMBERS.map(
    (p) => screenHeight * (parseFloat(p) / 100),
  );

  const availableHeight = snapHeights[currentSnapPoint] - 81;
  const onRoutePressWrapper = (route: RouteListItemData) => {
    navigate('Details', { routeId: route.id });
    if (onRoutePress) {
      onRoutePress(route);
    }
  };

  const colors = getTopoColorTokens(colorScheme === 'dark' ? 'dark' : 'light');
  const renderItem = ({
    item,
    index,
  }: {
    item: RouteListItemData;
    index: number;
  }) => (
    <RouteListItem
      item={item}
      index={index}
      colors={colors}
      onPress={onRoutePressWrapper}
    />
  );
  console.log('curentSnapPoint', currentSnapPoint);

  return (
    <View style={{ height: availableHeight }}>
      <FlashList
        data={routes}
        extraData={currentSnapPoint}
        renderItem={renderItem}
        contentContainerStyle={[styles.content]}
        showsVerticalScrollIndicator={true}
        renderScrollComponent={Scrollable}
        contentInsetAdjustmentBehavior="automatic"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
});
