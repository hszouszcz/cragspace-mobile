import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useEffect, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';

import BottomSheetNavigator from '@/features/TopoBottomSheet/BottomSheetNavigator';
import { RouteListItem } from '@/features/TopoBottomSheet/RouteListItem';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useNavigationContainerRef } from 'expo-router';
import { SharedValue } from 'react-native-reanimated';

const PRIMARY_COLOR = '#f94f06';
const ESTIMATED_ITEM_SIZE = 76;

export const SNAP_POINTS = ['20%', '52%', '100%'];
export const SNAP_POINTS_IN_NUMBERS = SNAP_POINTS.map(
  (point) => Number(point.replace('%', '')) / 100,
);

type RouteListItemData = {
  id: string;
  name: string;
  grade?: string;
  rating?: number;
  isHighlighted?: boolean;
  isMuted?: boolean;
};

type TopoBottomSheetProps = {
  data?: RouteListItemData[];
  sectorName?: string;
  sectorTitle?: string;
  onRoutePress?: (route: RouteListItemData) => void;
  onFilterPress?: () => void;
  animatedIndex: SharedValue<number>;
  snapPoints?: string[];
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

const TopoBottomSheet = ({
  data = [],
  sectorName = 'Longs Peak',
  sectorTitle = 'The Diamond',
  onRoutePress,
  onFilterPress,
  animatedIndex,
  snapPoints,
}: TopoBottomSheetProps) => {
  const sheetNavigationRef = useNavigationContainerRef();
  const colorScheme = useColorScheme();
  const colors = getColorTokens(colorScheme === 'dark' ? 'dark' : 'light');

  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const unsubscribe = sheetNavigationRef.addListener('state', () => {
      const ready = sheetNavigationRef.isReady();
      const canBack = ready && sheetNavigationRef.canGoBack();
      setCanGoBack(canBack);
    });

    return unsubscribe;
  }, [sheetNavigationRef]);

  const renderHandle = () => (
    <View
      style={[
        styles.handleContainer,
        { backgroundColor: colors.sheetBackground },
      ]}
    >
      <View
        style={[styles.handleIndicator, { backgroundColor: colors.handle }]}
      />
      <View style={styles.headerRow}>
        {canGoBack && (
          <Button title=" < Back" onPress={() => sheetNavigationRef.goBack()} />
        )}
        <View style={styles.headerTitles}>
          <Text
            style={[styles.headerSubtitle, { color: colors.headerSubtitle }]}
          >
            {sectorName.toUpperCase()}
          </Text>
          <Text style={[styles.headerTitle, { color: colors.headerTitle }]}>
            {sectorTitle}
          </Text>
        </View>
        <Pressable
          onPress={onFilterPress}
          style={({ pressed }) => [
            styles.filterButton,
            { backgroundColor: colors.filterBackground },
            pressed && styles.filterButtonPressed,
          ]}
        >
          <MaterialIcons
            name="filter-list"
            size={16}
            color={PRIMARY_COLOR}
            style={styles.filterIcon}
          />
          <Text style={[styles.filterLabel, { color: PRIMARY_COLOR }]}>
            Filter
          </Text>
        </Pressable>
      </View>
    </View>
  );

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
      onPress={onRoutePress}
    />
  );

  return (
    <BottomSheet
      snapPoints={SNAP_POINTS}
      index={1}
      enablePanDownToClose={false}
      animatedIndex={animatedIndex}
      enableContentPanningGesture={false}
      enableHandlePanningGesture
      handleComponent={renderHandle}
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
      {/* <BottomSheetFlashList
        data={data}
        keyExtractor={(item: RouteListItemData) => item.id}
        estimatedItemSize={ESTIMATED_ITEM_SIZE}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      /> */}
      {/* <RoutesList routes={data} onRoutePress={onRoutePress} /> */}
      <BottomSheetNavigator
        data={data}
        onRoutePress={onRoutePress}
        ref={sheetNavigationRef}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitles: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterButtonPressed: {
    opacity: 0.85,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
