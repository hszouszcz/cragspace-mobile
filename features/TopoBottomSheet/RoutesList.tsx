import { getTopoColorTokens } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme.web';
import { BottomSheetFlashList } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { RouteData } from '../TopoPreview/topo.types';
import { RouteListItem } from './RouteListItem';
import { type RouteListItemData } from './types';

const ESTIMATED_ITEM_SIZE = 76;

interface RoutesListProps {
  routes: RouteListItemData[];
  onRoutePress?: (route: RouteListItemData) => void;
}

export const RoutesList = ({ routes, onRoutePress }: RoutesListProps) => {
  const colorScheme = useColorScheme();

  const { navigate } = useNavigation<any>();

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
    <BottomSheetFlashList
      data={routes}
      keyExtractor={(item: RouteData) => item.name + item.length + item.grade}
      estimatedItemSize={ESTIMATED_ITEM_SIZE}
      renderItem={renderItem}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
});
