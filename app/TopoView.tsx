import { ThemedView } from '@/components/themed-view';
import RouteDetailModal from '@/components/topo/RouteDetailModal';
import TopoFullscreenViewer from '@/components/topo/TopoFullScreenViewer';
import { TopoSvgOverlay } from '@/components/topo/TopoSvgOverlay';
import TopoBottomSheet, { SNAP_POINTS } from '@/components/TopoBottomSheet';
import { RouteConfig } from '@/features/TopoPreview/topo.types';
import { useLoadRouteSvgPaths } from '@/features/TopoPreview/useLoadRouteSvgPaths';
import { useTopoViewAnimations } from '@/features/TopoPreview/useTopoViewAnimations';
import { useZoomableGestures } from '@/hooks/topo/useZoomableGestures';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, { useSharedValue } from 'react-native-reanimated';

const TOPO_IMAGE_SOURCE = require('@/assets/topo/dSlonia.jpeg');
const TOPO_IMAGE_META = Image.resolveAssetSource(TOPO_IMAGE_SOURCE);
const INITIAL_IMAGE_RATIO =
  TOPO_IMAGE_META?.width && TOPO_IMAGE_META?.height
    ? TOPO_IMAGE_META.width / TOPO_IMAGE_META.height
    : null;
const SHOULD_MEASURE_ON_LOAD = INITIAL_IMAGE_RATIO === null;

const TOPO_SVG_SOURCE = require('@/assets/topo/dSlonia_test.svg');

export default function TopoView() {
  const [pressedPaths, setPressedPaths] = useState<Record<string, boolean>>({});
  const [selectedRoute, setSelectedRoute] = useState<RouteConfig | null>(null);
  const [focusedRouteId, setFocusedRouteId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isFullscreenVisible, setIsFullscreenVisible] = useState(false);
  const lastPathPressTs = useRef(0);
  const [imageRatio, setImageRatio] = useState<number | null>(
    INITIAL_IMAGE_RATIO,
  );
  const [isImageReady, setIsImageReady] = useState(
    Boolean(INITIAL_IMAGE_RATIO),
  );
  const animatedIndexSharedValue = useSharedValue(1);
  const imageRatioSharedValue = useSharedValue(INITIAL_IMAGE_RATIO ?? 1);

  const { paths, viewBox } = useLoadRouteSvgPaths(TOPO_SVG_SOURCE);

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

  const handleImagePress = () => {
    if (Date.now() - lastPathPressTs.current < 250) {
      return;
    }
    setIsFullscreenVisible(true);
  };

  const {
    gesture: composedGesture,
    animatedStyle,
    setTransform,
  } = useZoomableGestures({
    onSingleTap: handleImagePress,
    containerSize,
    contentSize,
    minScaleResetThreshold: 1,
    maxScale: 5,
  });

  const viewBoxValues = useMemo(() => {
    if (!viewBox) {
      return null;
    }
    const values = viewBox.split(' ').map((value) => Number.parseFloat(value));
    if (
      values.length !== 4 ||
      values.some((value) => !Number.isFinite(value))
    ) {
      return null;
    }
    const [minX, minY, width, height] = values;
    return { minX, minY, width, height };
  }, [viewBox]);

  const focusOnRoute = useCallback(
    (route: RouteConfig) => {
      if (!route.bounds || !viewBoxValues) {
        return;
      }
      if (animatedIndexSharedValue.value !== 1) {
        return;
      }
      const container = containerSize.value;
      const content = contentSize.value;
      if (!container || !content) {
        return;
      }
      const { minX, minY, width, height } = viewBoxValues;
      const baseScale = Math.max(
        content.width / width,
        content.height / height,
      );
      const offsetX = (content.width - width * baseScale) / 2;
      const offsetY = (content.height - height * baseScale) / 2;

      const boundsWidth = (route.bounds.maxX - route.bounds.minX) * baseScale;
      const boundsHeight = (route.bounds.maxY - route.bounds.minY) * baseScale;
      const margin = 0.14;
      const availableWidth = container.width * (1 - margin * 2);
      const availableHeight = container.height * (1 - margin * 2);
      const scaleForWidth = availableWidth / boundsWidth;
      const scaleForHeight = availableHeight / boundsHeight;
      const targetScale = Math.min(scaleForWidth, scaleForHeight, 3);
      const clampedScale = Math.max(1, targetScale);

      const centerX = (route.bounds.minX + route.bounds.maxX) / 2;
      const centerY = (route.bounds.minY + route.bounds.maxY) / 2;
      const contentCenterX = (centerX - minX) * baseScale + offsetX;
      const contentCenterY = (centerY - minY) * baseScale + offsetY;
      const translateX = -(contentCenterX - content.width / 2) * clampedScale;
      const translateY = -(contentCenterY - content.height / 2) * clampedScale;

      setTransform({
        scale: clampedScale,
        translateX,
        translateY,
        animate: true,
      });
    },
    [
      animatedIndexSharedValue,
      containerSize,
      contentSize,
      setTransform,
      viewBoxValues,
    ],
  );

  const handlePathPressIn = (pathId: string) => {
    setPressedPaths((prev) => ({ ...prev, [pathId]: true }));
  };

  const handlePathPressOut = (pathId: string) => {
    setPressedPaths((prev) => ({ ...prev, [pathId]: false }));
  };

  const handlePathPress = (pathId: string) => {
    const route = paths.find((p) => p.id === pathId);
    if (route) {
      lastPathPressTs.current = Date.now();
      setFocusedRouteId(route.id);
      setIsFullscreenVisible(false);
      setSelectedRoute(route);
      setIsModalVisible(true);
    }
  };

  const handleRoutePress = useCallback(
    ({ id }: { id: string }) => {
      const route = paths.find((item) => item.id === id);
      if (!route) {
        return;
      }
      setFocusedRouteId(route.id);
      focusOnRoute(route);
    },
    [focusOnRoute, paths],
  );

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedRoute(null);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreenVisible(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.imageSection]}>
        <GestureHandlerRootView style={styles.gestureContainer}>
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
                  source={TOPO_IMAGE_SOURCE}
                  style={[
                    !isImageReady ? { opacity: 0 } : null,
                    contentImageAnimatedStyle,
                  ]}
                  onLoadStart={() => {
                    if (SHOULD_MEASURE_ON_LOAD) {
                      setIsImageReady(false);
                    }
                  }}
                  onLoad={(e) => {
                    if (!SHOULD_MEASURE_ON_LOAD) {
                      return;
                    }
                    const { width, height } = e.nativeEvent.source;
                    setImageRatio(width / height);
                    imageRatioSharedValue.value = width / height;
                    setIsImageReady(true);
                  }}
                  resizeMode="cover"
                />
                {viewBox && isImageReady && imageRatio && (
                  <TopoSvgOverlay
                    viewBox={viewBox}
                    style={[styles.svgOverlay, contentViewAnimatedStyle]}
                    paths={paths}
                    pressedPaths={pressedPaths}
                    selectedPathId={focusedRouteId}
                    dimOpacity={0.45}
                    ghostStroke="#0f172a"
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
        </GestureHandlerRootView>
      </ThemedView>

      {viewBox && (
        <RouteDetailModal
          visible={isModalVisible}
          route={selectedRoute}
          svgViewBox={viewBox}
          imageSource={TOPO_IMAGE_SOURCE}
          onClose={handleCloseModal}
        />
      )}
      {viewBox && (
        <TopoFullscreenViewer
          visible={isFullscreenVisible}
          svgViewBox={viewBox}
          paths={paths}
          imageSource={TOPO_IMAGE_SOURCE}
          onClose={handleCloseFullscreen}
          onPathPress={handlePathPress}
        />
      )}
      <TopoBottomSheet
        data={paths}
        animatedIndex={animatedIndexSharedValue}
        snapPoints={SNAP_POINTS}
        onRoutePress={handleRoutePress}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageSection: {
    width: 'auto',
    // height: SCREEN_HEIGHT * 0.6,
    overflow: 'hidden',
    flex: 1,
    backgroundColor: 'transparent',
  },
  gestureContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imageContainer: {
    width: 'auto',
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gestureContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  //   image: {
  //     width: SCREEN_WIDTH,
  //     height: SCREEN_HEIGHT * 0.6,
  //   },
  svgOverlay: {
    position: 'absolute',
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
});
