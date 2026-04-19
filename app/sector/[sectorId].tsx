import { ThemedView } from '@/components/themed-view';
import TopoBottomSheet, { SNAP_POINTS } from '@/components/TopoBottomSheet';
import { FullscreenButton } from '@/features/FullscreenTopo/FullscreenButton';
import { SvgLayerButton } from '@/features/TopoPreview/SvgLayerButton/SvgLayerButton';
import { FullscreenTopoViewer } from '@/features/FullscreenTopo/FullscreenTopoViewer';
import { sectorTopoStyles } from '@/features/SectorTopo/SectorTopo.styles';
import { useSectorPager } from '@/features/SectorTopo/useSectorPager';
import { WallViewer } from '@/features/SectorTopo/WallViewer';
import type { RouteListItemData } from '@/features/TopoBottomSheet/types';
import type { RouteConfig } from '@/features/TopoPreview/topo.types';
import { GUIDEBOOK_DETAILS } from '@/services/guidebooks/guidebook-detail-data';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

export default function SectorTopoScreen() {
  const { sectorId, guidebookId } = useLocalSearchParams<{
    sectorId: string;
    guidebookId: string;
  }>();
  const router = useRouter();

  const guidebook = GUIDEBOOK_DETAILS[guidebookId ?? ''];
  const sector = guidebook?.regions
    .flatMap((r) => r.sectors)
    .find((s) => s.id === sectorId);

  const walls = sector?.walls ?? [];

  const [routesSvgLayerVisiblity, setRoutesSvgLayerVisibility] = useState(true);

  // Shared values — must be before any early return
  const animatedIndexSharedValue = useSharedValue(1);
  // Written by the active WallViewer's useAnimatedReaction on the UI thread.
  // The pager reads this in its onTouchesMove worklet — no runOnJS needed.
  const activeIsZoomedSharedValue = useSharedValue(false);

  // Pager — must be before any early return
  const {
    currentWallIndex,
    currentWallIndexSharedValue,
    translateXSharedValue,
    pagerGesture,
    pagerGestureRef,
    goToWall,
  } = useSectorPager({ wallCount: walls.length, activeIsZoomedSharedValue });

  // Wall routes cache — indexed by wallIndex
  const [wallPathsCache, setWallPathsCache] = useState<
    Record<number, RouteConfig[]>
  >({});

  // Fullscreen topo viewer
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Selected route (driven by SVG tap or sheet tap)
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  // Reset selection when wall changes
  useEffect(() => {
    setSelectedRouteId(null);
  }, [currentWallIndex]);

  // Pager track animation
  const pagerTrackAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXSharedValue.value }],
  }));

  // Guard — navigate back if no sector or no walls (after all hooks)
  if (!sector || walls.length === 0) {
    router.back();
    return null;
  }

  const handleRoutesReady = (wallIdx: number) => (paths: RouteConfig[]) => {
    setWallPathsCache((prev) => {
      if (prev[wallIdx]) return prev;
      return { ...prev, [wallIdx]: paths };
    });
  };

  const handleRouteSelected = (routeId: string) => {
    setSelectedRouteId(routeId);
  };

  const handleEdgeSwipe = (wallIdx: number) => (direction: 'next' | 'prev') => {
    if (wallIdx !== currentWallIndex) return;
    goToWall(
      direction === 'next' ? currentWallIndex + 1 : currentWallIndex - 1,
    );
  };

  const handleRoutePress = (route: RouteListItemData) => {
    setSelectedRouteId(route.id);
  };

  const handleGoBack = () => {
    setSelectedRouteId(null);
  };

  const handleSnapPointChange = (_fromIndex: number, _toIndex: number) => {
    // Snap resets are handled inside each WallViewer via its own gesture hook
  };

  // Routes for bottom sheet from current wall's loaded paths
  const activeWallPaths = wallPathsCache[currentWallIndex] ?? [];
  const routesForSheet: RouteListItemData[] = activeWallPaths.map((p) => ({
    id: p.id,
    name: p.name,
    grade: p.grade,
    length: p.length,
    bolts: p.bolts,
    type: p.type,
    description: p.description,
  }));

  const currentWall = walls[currentWallIndex];

  return (
    <>
      <Stack.Screen options={{ title: sector.name }} />
      <ThemedView style={sectorTopoStyles.screen}>
        <GestureDetector gesture={pagerGesture}>
          <Animated.View style={sectorTopoStyles.pagerWrapper}>
            <Animated.View
              style={[sectorTopoStyles.pagerTrack, pagerTrackAnimatedStyle]}
            >
              {walls.map((wall, idx) => (
                <Animated.View key={wall.id} style={sectorTopoStyles.wallSlot}>
                  <WallViewer
                    wall={wall}
                    wallIndex={idx}
                    currentWallIndexSharedValue={currentWallIndexSharedValue}
                    activeIsZoomedSharedValue={activeIsZoomedSharedValue}
                    animatedIndexSharedValue={animatedIndexSharedValue}
                    selectedRouteId={
                      idx === currentWallIndex ? selectedRouteId : null
                    }
                    onRoutesReady={handleRoutesReady(idx)}
                    onRouteSelected={handleRouteSelected}
                    onEdgeSwipe={handleEdgeSwipe(idx)}
                    pagerGestureRef={pagerGestureRef}
                    isRouteSvgLayerVisible={routesSvgLayerVisiblity}
                  />
                </Animated.View>
              ))}
            </Animated.View>
          </Animated.View>
        </GestureDetector>
        <View style={sectorTopoStyles.overlayControls}>
          <FullscreenButton onPress={() => setIsFullscreen(true)} />
          <SvgLayerButton
            isVisible={routesSvgLayerVisiblity}
            onPress={() =>
              setRoutesSvgLayerVisibility(!routesSvgLayerVisiblity)
            }
          />
        </View>

        <TopoBottomSheet
          data={routesForSheet}
          sectorName={sector.name}
          sectorTitle={currentWall?.name ?? ''}
          animatedIndex={animatedIndexSharedValue}
          snapPoints={SNAP_POINTS}
          onRoutePress={handleRoutePress}
          onSnapPointChange={handleSnapPointChange}
          onGoBack={handleGoBack}
          wallIndex={currentWallIndex}
          wallCount={walls.length}
          wallName={currentWall?.name}
        />
      </ThemedView>

      <FullscreenTopoViewer
        visible={isFullscreen}
        walls={walls}
        initialWallIndex={currentWallIndex}
        onClose={(activeWallIndex) => {
          setIsFullscreen(false);
          goToWall(activeWallIndex);
        }}
      />
    </>
  );
}
