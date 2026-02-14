import { useColorScheme } from '@/hooks/use-color-scheme.web';
import { BottomSheetFlashList } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { RouteData } from '../TopoPreview/topo.types';
import { RouteListItem } from './RouteListItem';
import { type RouteListItemData } from './types';
import { useState } from 'react';

const ESTIMATED_ITEM_SIZE = 76;

interface RoutesListProps {
  routes: RouteListItemData[];
  onRoutePress?: (route: RouteListItemData) => void;
  animatedIndex: SharedValue<number>;
}

export const RoutesList = ({
  routes,
  onRoutePress,
  animatedIndex,
}: RoutesListProps) => {
  const colorScheme = useColorScheme();

  const { navigate } = useNavigation<any>();

  const [pressedListItem, setPressedListItem] = useState<string | null>(null);

  const handleListItemPressIn = (routeId: string) => {
    setPressedListItem(routeId);
  };

  const handleListItemPressOut = () => {
    setPressedListItem(null);
  };

  const handleListItemPress = (route: RouteListItemData) => {
    if (onRoutePress) {
      onRoutePress(route);
    } else {
      navigate('RouteDetail', { routeId: route.id });
    }
  };

  const renderItem = ({ item }: { item: RouteListItemData }) => (
    <RouteListItem
      item={item}
      onPress={handleListItemPress}
      pressedListItem={pressedListItem}
      onPressIn={handleListItemPressIn}
      onPressOut={handleListItemPressOut}
    />
  );

  return (
    <BottomSheetFlashList
      data={routes}
      extraData={animatedIndex.value}
      keyExtractor={(item: RouteData) => item.name + item.length + item.grade}
      estimatedItemSize={ESTIMATED_ITEM_SIZE}
      renderItem={renderItem}
      contentContainerStyle={[
        styles.contentContainer,
        {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#fff',
  },
});
