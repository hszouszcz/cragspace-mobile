import { TopoSvgOverlay } from '@/components/topo/TopoSvgOverlay';
import type { RouteConfig } from '@/features/TopoPreview/topo.types';
import { useLoadRouteSvgPaths } from '@/features/TopoPreview/useLoadRouteSvgPaths';
import { useTopoViewAnimations } from '@/features/TopoPreview/useTopoViewAnimations';
import { useFocusOnRoute } from '@/hooks/topo/useFocusOnRoute';
import { useGalleryGestures } from '@/hooks/topo/useGalleryGestures';
import { useViewBoxValues } from '@/hooks/topo/useViewBoxValues';
import type { Wall } from '@/services/guidebooks/types';
import { palette } from '@/src/theme';
import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { GestureType } from 'react-native-gesture-handler';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

interface Props {
  wall: Wall;
  wallIndex: number;
  currentWallIndexSharedValue: SharedValue<number>;
  /**
   * SharedValue controlled by useSectorPager. The active wall writes true/false
   * to this value on the UI thread so the pager can gate itself without runOnJS.
   */
  activeIsZoomedSharedValue: SharedValue<boolean>;
  animatedIndexSharedValue: SharedValue<number>;
  /** Route id to focus from outside (e.g. from sheet tap). Null = no external selection. */
  selectedRouteId: string | null;

  isRouteSvgLayerVisible: boolean;
  /** Called once when this wall's SVG paths finish loading */
  onRoutesReady: (paths: RouteConfig[]) => void;
  /** Called when user taps an SVG route path */
  onRouteSelected: (routeId: string) => void;
  /**
   * Called when the image is panned to a horizontal edge while zoomed in and
   * the user continues swiping. Use to trigger pager navigation.
   */
  onEdgeSwipe?: (direction: 'next' | 'prev') => void;
  /** Ref to the parent pager gesture so the inner pan can run simultaneously */
  pagerGestureRef?: React.RefObject<GestureType | undefined>;
}

export function WallViewer({
  wall,
  wallIndex,
  currentWallIndexSharedValue,
  activeIsZoomedSharedValue,
  animatedIndexSharedValue,
  selectedRouteId,
  onRoutesReady,
  onRouteSelected,
  onEdgeSwipe,
  pagerGestureRef,
  isRouteSvgLayerVisible = true,
}: Props) {
  // ── Image ratio ──────────────────────────────────────────────────────────────
  const imageMeta = Image.resolveAssetSource(wall.imageAsset);
  const initialImageRatio =
    imageMeta?.width && imageMeta?.height
      ? imageMeta.width / imageMeta.height
      : null;
  const shouldMeasureOnLoad = initialImageRatio === null;

  const [imageRatio, setImageRatio] = useState<number | null>(
    initialImageRatio,
  );
  const [isImageReady, setIsImageReady] = useState(Boolean(initialImageRatio));
  const imageRatioSharedValue = useSharedValue(initialImageRatio ?? 1);

  // ── SVG paths ────────────────────────────────────────────────────────────────
  const { paths, viewBox } = useLoadRouteSvgPaths(wall.svgAsset);

  useEffect(() => {
    if (paths.length > 0) {
      onRoutesReady(paths);
    }
  }, [paths, onRoutesReady]);

  // ── Animations ───────────────────────────────────────────────────────────────
  const {
    containerSize,
    contentSize,
    containerAnimatedStyle,
    contentImageAnimatedStyle,
    contentViewAnimatedStyle,
    imageContainerOffsetStyle,
  } = useTopoViewAnimations({
    imageRatio: imageRatioSharedValue,
    animatedIndexSharedValue,
    viewBox,
  });

  // ── Gestures ─────────────────────────────────────────────────────────────────
  const {
    gesture: composedGesture,
    animatedStyle,
    isZoomedDerived,
    setTransform,
    resetTransform,
  } = useGalleryGestures({
    containerSize,
    contentSize,
    maxScale: 5,
    onEdgeSwipe,
    pagerGestureRef,
  });

  // Sync zoom state to parent on the UI thread — no runOnJS needed.
  // useSectorPager reads activeIsZoomedSharedValue in its useAnimatedReaction.
  useAnimatedReaction(
    () =>
      isZoomedDerived.value && currentWallIndexSharedValue.value === wallIndex,
    (isActiveAndZoomed) => {
      activeIsZoomedSharedValue.value = isActiveAndZoomed;
    },
  );

  // Reset zoom immediately when navigating away from this wall so the next
  // visit (or swipe-back) always starts at scale=1. Fires once per navigation
  // completion on the UI thread — no runOnJS needed.
  useAnimatedReaction(
    () => currentWallIndexSharedValue.value,
    (currentIdx, prevIdx) => {
      if (prevIdx === null) return;
      if (prevIdx === wallIndex && currentIdx !== wallIndex) {
        resetTransform(false);
      }
    },
  );

  // ── Route focus ──────────────────────────────────────────────────────────────
  const viewBoxValues = useViewBoxValues(viewBox);
  const focusOnRoute = useFocusOnRoute({
    viewBoxValues,
    containerSize,
    contentSize,
    animatedIndexSharedValue,
    setTransform,
  });

  // ── Selected route ───────────────────────────────────────────────────────────
  const [localSelectedRouteId, setLocalSelectedRouteId] = useState<
    string | null
  >(null);
  const lastExternalFocusId = useRef<string | null>(null);

  // React to external route selection (sheet tap → parent → prop)
  useEffect(() => {
    if (!selectedRouteId || selectedRouteId === lastExternalFocusId.current) {
      return;
    }
    const route = paths.find((p) => p.id === selectedRouteId);
    if (route) {
      lastExternalFocusId.current = selectedRouteId;
      setLocalSelectedRouteId(selectedRouteId);
      focusOnRoute(route);
    }
  }, [selectedRouteId, paths, focusOnRoute]);

  // ── SVG path handlers ────────────────────────────────────────────────────────
  const [pressedPaths, setPressedPaths] = useState<Record<string, boolean>>({});

  const handlePathPressIn = (pathId: string) => {
    setPressedPaths((prev) => ({ ...prev, [pathId]: true }));
  };

  const handlePathPressOut = (pathId: string) => {
    setPressedPaths((prev) => ({ ...prev, [pathId]: false }));
  };

  const handlePathPress = (pathId: string) => {
    const route = paths.find((p) => p.id === pathId);
    if (!route) return;
    lastExternalFocusId.current = route.id;
    setLocalSelectedRouteId(route.id);
    focusOnRoute(route);
    onRouteSelected(route.id);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <View style={styles.gestureArea}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View
          style={[
            styles.imageContainer,
            containerAnimatedStyle,
            imageContainerOffsetStyle,
          ]}
        >
          <Animated.View style={[styles.gestureContent, animatedStyle]}>
            <Animated.Image
              source={wall.imageAsset}
              style={[
                !isImageReady ? styles.hidden : null,
                contentImageAnimatedStyle,
              ]}
              onLoadStart={() => {
                if (shouldMeasureOnLoad) {
                  setIsImageReady(false);
                }
              }}
              onLoad={(e) => {
                if (!shouldMeasureOnLoad) return;
                const { width, height } = e.nativeEvent.source;
                setImageRatio(width / height);
                imageRatioSharedValue.value = width / height;
                setIsImageReady(true);
              }}
              resizeMode="cover"
            />
            {viewBox &&
              isImageReady &&
              imageRatio &&
              isRouteSvgLayerVisible && (
                <TopoSvgOverlay
                  viewBox={viewBox}
                  style={[styles.svgOverlay, contentViewAnimatedStyle]}
                  paths={paths}
                  pressedPaths={pressedPaths}
                  selectedPathId={localSelectedRouteId}
                  dimOpacity={0.45}
                  ghostStroke={palette.warmBrown950}
                  ghostOpacity={0.22}
                  ghostStrokeWidthMultiplier={2}
                  onPathPressIn={handlePathPressIn}
                  onPathPressOut={handlePathPressOut}
                  onPathPress={handlePathPress}
                />
              )}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  gestureArea: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gestureContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgOverlay: {
    position: 'absolute',
  },
  hidden: {
    opacity: 0,
  },
});
