import { getTopoColorTokens } from '@/constants/theme';
import { useBottomSheetAvailableHeight } from '@/hooks/topo/useBottomSheetAvailableHeight';
import { useColorScheme } from '@/hooks/use-color-scheme.web';
import { useBottomSheetScrollableCreator } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';
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

  const { navigate } = useNavigation<any>();
  const { availableHeight } = useBottomSheetAvailableHeight(currentSnapPoint);

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
