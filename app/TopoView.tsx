import { ThemedView } from '@/components/themed-view';
import RouteDetailModal from '@/components/topo/RouteDetailModal';
import TopoFullscreenViewer from '@/components/topo/TopoFullScreenViewer';
import { TopoSvgOverlay } from '@/components/topo/TopoSvgOverlay';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet } from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import TopoBottomSheet from '@/components/TopoBottomSheet';
import { useZoomableGestures } from '@/hooks/topo/useZoomableGestures';
import { loadTopoSvgPaths, SvgPathConfig } from '@/services/topo/loadSvgPaths';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TOPO_IMAGE_SOURCE = require('@/assets/topo/dSlonia.jpeg');
const TOPO_IMAGE_META = Image.resolveAssetSource(TOPO_IMAGE_SOURCE);
const INITIAL_IMAGE_RATIO =
  TOPO_IMAGE_META?.width && TOPO_IMAGE_META?.height
    ? TOPO_IMAGE_META.width / TOPO_IMAGE_META.height
    : null;
const SHOULD_MEASURE_ON_LOAD = INITIAL_IMAGE_RATIO === null;
const SNAP_POINTS = ['20%', '52%', '88%'] as const;
const SNAP_POINT_VALUES = [0.2, 0.52, 0.88] as const;

type RouteConfig = SvgPathConfig & {
  strokeWidth: number;
  name: string;
  length: number;
  bolts: number;
  grade: string;
  type: string;
  description: string;
};

export default function TopoView() {
  const [pressedPaths, setPressedPaths] = useState<Record<string, boolean>>({});
  const [pathsConfig, setPathsConfig] = useState<RouteConfig[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteConfig | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pressedListItem, setPressedListItem] = useState<string | null>(null);
  const [isFullscreenVisible, setIsFullscreenVisible] = useState(false);
  const lastPathPressTs = useRef(0);
  const [imageRatio, setImageRatio] = useState<number | null>(
    INITIAL_IMAGE_RATIO,
  );
  const [isImageReady, setIsImageReady] = useState(
    Boolean(INITIAL_IMAGE_RATIO),
  );
  const [svgViewBox, setSvgViewBox] = useState<string | null>(null);
  const animatedIndexSharedValue = useSharedValue(1);
  const imageRatioSharedValue = useSharedValue(INITIAL_IMAGE_RATIO ?? 1);

  useEffect(() => {
    const loadSvgPaths = async () => {
      try {
        const { paths: svgPaths, viewBox } = await loadTopoSvgPaths(
          require('@/assets/topo/dSlonia_test.svg'),
        );

        setSvgViewBox(viewBox ?? null);

        const parsedPaths = svgPaths.map((path, index) => {
          // Generate climbing route data
          const routeData = {
            name: `Droga ${index + 1}`,
            length: Math.floor(15 + Math.random() * 35), // 15-50m
            bolts: Math.floor(5 + Math.random() * 15), // 5-20 przelotów
            grade: ['5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '7a'][
              Math.floor(Math.random() * 9)
            ],
            type: ['Sport', 'Trad', 'Multi-pitch'][
              Math.floor(Math.random() * 3)
            ],
            description: `Piękna droga wspinaczkowa na ścianie Słonia. ${['Wymaga dobrej techniki.', 'Idealna dla początkujących.', 'Trudne ruchy w górnej części.'][Math.floor(Math.random() * 3)]}`,
          };

          return {
            ...path,
            strokeWidth: 9,
            ...routeData,
          };
        });

        setPathsConfig(parsedPaths);
      } catch (error) {
        console.error('Error loading SVG:', error);
      }
    };

    loadSvgPaths();
  }, []);

  const containerSize = useDerivedValue(() => {
    const ratio = imageRatioSharedValue.value || 1;
    const baseWidth = svgViewBox
      ? parseFloat(svgViewBox.split(' ')[2]) / ratio
      : SCREEN_WIDTH;
    const baseHeight = svgViewBox
      ? parseFloat(svgViewBox.split(' ')[3])
      : SCREEN_HEIGHT;
    const maxWidth = (baseWidth * SCREEN_HEIGHT) / baseHeight;
    const width = interpolate(
      animatedIndexSharedValue.value,
      [0, 1, 2],
      [SCREEN_WIDTH, SCREEN_WIDTH, SCREEN_WIDTH],
    );
    const height = interpolate(
      animatedIndexSharedValue.value,
      [0, 1, 2],
      [SCREEN_HEIGHT, SCREEN_HEIGHT * 0.45, SCREEN_WIDTH * 0.45],
    );
    return { width, height };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: containerSize.value.width,
      height: containerSize.value.height,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const ratio = imageRatioSharedValue.value || 1;
    const containerWidth = containerSize.value.width;
    const containerHeight = containerSize.value.height;
    const coverWidth = Math.max(containerWidth, containerHeight * ratio);
    const coverHeight = coverWidth / ratio;
    const containWidth = containerWidth;
    const containHeight = containerWidth / ratio;
    const width = interpolate(
      animatedIndexSharedValue.value,
      [0, 1, 2],
      [containWidth, coverWidth, coverWidth],
    );
    const height = interpolate(
      animatedIndexSharedValue.value,
      [0, 1, 2],
      [containHeight, coverHeight, coverHeight],
    );
    return { width, height };
  });

  const imageContainerOffsetStyle = useAnimatedStyle(() => {
    const sheetHeight = SCREEN_HEIGHT * SNAP_POINT_VALUES[0];
    const centeredOffset = -sheetHeight / 2;
    const translateY = interpolate(
      animatedIndexSharedValue.value,
      [0, 1, 2],
      [centeredOffset, 0, 0],
    );
    return {
      transform: [{ translateY }],
    };
  });

  const handleImagePress = () => {
    if (Date.now() - lastPathPressTs.current < 250) {
      return;
    }
    setIsFullscreenVisible(true);
  };

  const { gesture: composedGesture, animatedStyle } = useZoomableGestures({
    onSingleTap: handleImagePress,
    containerWidth: SCREEN_WIDTH,
    containerHeight: imageRatio ? SCREEN_WIDTH / imageRatio : undefined,
    contentWidth: SCREEN_WIDTH,
    contentHeight: imageRatio ? SCREEN_WIDTH / imageRatio : undefined,
    minScaleResetThreshold: 1,
  });

  const handlePathPressIn = (pathId) => {
    setPressedPaths((prev) => ({ ...prev, [pathId]: true }));
  };

  const handlePathPressOut = (pathId) => {
    setPressedPaths((prev) => ({ ...prev, [pathId]: false }));
  };

  const handlePathPress = (pathId) => {
    const route = pathsConfig.find((p) => p.id === pathId);
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

  const handleListItemPressIn = (routeId) => {
    setPressedListItem(routeId);
  };

  const handleListItemPressOut = () => {
    setPressedListItem(null);
  };

  const handleListItemPress = (routeId) => {
    const route = pathsConfig.find((p) => p.id === routeId);
    if (route) {
      setSelectedRoute(route);
      setIsModalVisible(true);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Image section with gestures - 60% height */}
      <ThemedView
        style={[
          styles.imageSection,
          //   { height: imageRatio ? SCREEN_WIDTH / imageRatio : '100%' },
        ]}
      >
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
                    styles.image,
                    !isImageReady ? { opacity: 0 } : null,
                    contentAnimatedStyle,
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
                {svgViewBox && isImageReady && imageRatio && (
                  <TopoSvgOverlay
                    viewBox={svgViewBox}
                    style={[styles.svgOverlay, contentAnimatedStyle]}
                    paths={pathsConfig}
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

      {svgViewBox && (
        <RouteDetailModal
          visible={isModalVisible}
          route={selectedRoute}
          svgViewBox={svgViewBox}
          imageSource={TOPO_IMAGE_SOURCE}
          onClose={handleCloseModal}
        />
      )}
      {svgViewBox && (
        <TopoFullscreenViewer
          visible={isFullscreenVisible}
          svgViewBox={svgViewBox}
          paths={pathsConfig}
          imageSource={TOPO_IMAGE_SOURCE}
          onClose={handleCloseFullscreen}
          onPathPress={handlePathPress}
        />
      )}
      <TopoBottomSheet
        data={pathsConfig}
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
