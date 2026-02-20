import { useBottomSheetAvailableHeight } from '@/hooks/topo/useBottomSheetAvailableHeight';
import { useBottomSheetScrollableCreator } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';
import { RouteListItem } from './RouteListItem';
import { styles } from './routes-list.styles';
import { type RouteListItemData } from './types';

interface RoutesListProps {
  routes: RouteListItemData[];
  onRoutePress?: (route: RouteListItemData) => void;
  currentSnapPoint?: number;
}

export function RoutesList({
  routes,
  onRoutePress,
  currentSnapPoint = 2,
}: RoutesListProps) {
  const Scrollable = useBottomSheetScrollableCreator();
  const { navigate } = useNavigation<any>();
  const { availableHeight } = useBottomSheetAvailableHeight(currentSnapPoint);

  function handleRoutePress(route: RouteListItemData) {
    navigate('Details', { routeId: route.id });
    onRoutePress?.(route);
  }

  const renderItem = ({
    item,
    index,
  }: {
    item: RouteListItemData;
    index: number;
  }) => <RouteListItem item={item} index={index} onPress={handleRoutePress} />;

  return (
    <View style={{ height: availableHeight }}>
      <FlashList
        data={routes}
        extraData={currentSnapPoint}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator
        renderScrollComponent={Scrollable}
        contentInsetAdjustmentBehavior="automatic"
      />
    </View>
  );
}
