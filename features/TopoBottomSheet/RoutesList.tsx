import { useColorScheme } from '@/hooks/use-color-scheme.web';
import { BottomSheetFlashList } from '@gorhom/bottom-sheet';
import { useNavigation } from 'expo-router';
import { StyleSheet } from 'react-native';
import { RouteData } from '../TopoPreview/topo.types';
import { RouteListItem } from './RouteListItem';

const ESTIMATED_ITEM_SIZE = 76;
const PRIMARY_COLOR = '#f94f06';

type RouteListItemData = {
  id: string;
  name: string;
  grade?: string;
  rating?: number;
  isHighlighted?: boolean;
  isMuted?: boolean;
};

type ColorTokens = {
  sheetBackground: string;
  sheetBorder: string;
  handle: string;
  headerTitle: string;
  headerSubtitle: string;
  rowBase: string;
  rowBackground: string;
  rowBorder: string;
  rowMuted: string;
  rowMutedBorder: string;
  rowPressed: string;
  badgeBackground: string;
  badgeText: string;
  badgeMutedBackground: string;
  badgeMutedText: string;
  gradeBackground: string;
  gradeText: string;
  chevron: string;
  starEmpty: string;
  textPrimary: string;
  textMuted: string;
  filterBackground: string;
};

const getColorTokens = (scheme: 'light' | 'dark'): ColorTokens => {
  if (scheme === 'dark') {
    return {
      sheetBackground: '#23150f',
      sheetBorder: '#2d1c15',
      handle: '#40302a',
      headerTitle: '#f9fafb',
      headerSubtitle: PRIMARY_COLOR,
      rowBase: 'rgba(35, 21, 15, 0.4)',
      rowBackground: 'rgba(40, 26, 20, 0.6)',
      rowBorder: 'rgba(64, 48, 42, 0.7)',
      rowMuted: 'rgba(35, 21, 15, 0.6)',
      rowMutedBorder: 'rgba(64, 48, 42, 0.45)',
      rowPressed: 'rgba(60, 40, 32, 0.6)',
      badgeBackground: PRIMARY_COLOR,
      badgeText: '#ffffff',
      badgeMutedBackground: '#2f221c',
      badgeMutedText: '#a8a29e',
      gradeBackground: '#3b2a22',
      gradeText: '#f9fafb',
      chevron: '#a8a29e',
      starEmpty: '#4b3b35',
      textPrimary: '#f9fafb',
      textMuted: '#a8a29e',
      filterBackground: 'rgba(249, 79, 6, 0.12)',
    };
  }

  return {
    sheetBackground: '#ffffff',
    sheetBorder: '#f1f5f9',
    handle: '#e2e8f0',
    headerTitle: '#0f172a',
    headerSubtitle: PRIMARY_COLOR,
    rowBase: '#ffffff',
    rowBackground: '#f8fafc',
    rowBorder: 'rgba(249, 79, 6, 0.2)',
    rowMuted: '#ffffff',
    rowMutedBorder: '#f1f5f9',
    rowPressed: '#f1f5f9',
    badgeBackground: PRIMARY_COLOR,
    badgeText: '#ffffff',
    badgeMutedBackground: '#f1f5f9',
    badgeMutedText: '#64748b',
    gradeBackground: '#e2e8f0',
    gradeText: '#0f172a',
    chevron: '#94a3b8',
    starEmpty: '#e2e8f0',
    textPrimary: '#0f172a',
    textMuted: '#64748b',
    filterBackground: 'rgba(249, 79, 6, 0.1)',
  };
};

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

  const colors = getColorTokens(colorScheme === 'dark' ? 'dark' : 'light');
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
