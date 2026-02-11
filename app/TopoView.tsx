import { ThemedView } from '@/components/themed-view';
import RouteDetailModal from '@/components/topo/RouteDetailModal';
import TopoFullscreenViewer from '@/components/topo/TopoFullScreenViewer';
import { TopoSvgOverlay } from '@/components/topo/TopoSvgOverlay';
import TopoBottomSheet, { SNAP_POINTS } from '@/components/TopoBottomSheet';
import { RouteConfig } from '@/features/TopoPreview/topo.types';
import { useLoadRouteSvgPaths } from '@/features/TopoPreview/useLoadRouteSvgPaths';
import { useTopoViewAnimations } from '@/features/TopoPreview/useTopoViewAnimations';
import { useZoomableGestures } from '@/hooks/topo/useZoomableGestures';
import { useRef, useState } from 'react';
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

  const { gesture: composedGesture, animatedStyle } = useZoomableGestures({
    onSingleTap: handleImagePress,
    containerSize,
    contentSize,
    minScaleResetThreshold: 1,
  });

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
      setIsFullscreenVisible(false);
      setSelectedRoute(route);
      setIsModalVisible(true);
    }
  };

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
