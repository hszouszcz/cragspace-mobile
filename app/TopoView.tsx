import { ThemedView } from '@/components/themed-view';
import TopoBottomSheet from '@/components/TopoBottomSheet';
import RouteDetailModal from '@/components/topo/RouteDetailModal';
import TopoFullscreenViewer from '@/components/topo/TopoFullScreenViewer';
import { TopoSvgOverlay } from '@/components/topo/TopoSvgOverlay';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { RouteListItemData } from '@/features/TopoBottomSheet/types';
import { useZoomableGestures } from '@/hooks/topo/useZoomableGestures';
import { loadTopoSvgPaths, SvgPathConfig } from '@/services/topo/loadSvgPaths';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TOPO_IMAGE_SOURCE = require('@/assets/topo/dSlonia.jpeg');

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
  const [isFullscreenVisible, setIsFullscreenVisible] = useState(false);
  const lastPathPressTs = useRef(0);
  const [imageRatio, setImageRatio] = useState<number | null>(null);
  const [isImageReady, setIsImageReady] = useState(false);
  const [svgViewBox, setSvgViewBox] = useState<string | null>(null);

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
  });

  const handlePathPressIn = (pathId: string) => {
    setPressedPaths((prev) => ({ ...prev, [pathId]: true }));
  };

  const handlePathPressOut = (pathId: string) => {
    setPressedPaths((prev) => ({ ...prev, [pathId]: false }));
  };

  const handlePathPress = (pathId: string) => {
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

  const handleRoutePress = (route: RouteListItemData) => {
    setSelectedRoute(route as RouteConfig);
    setIsModalVisible(true);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Image section with gestures - 60% height */}
      <ThemedView
        style={[
          styles.imageSection,
          { height: imageRatio ? SCREEN_WIDTH / imageRatio : '100%' },
        ]}
      >
        <GestureHandlerRootView style={styles.gestureContainer}>
          <GestureDetector gesture={composedGesture}>
            <Animated.View
              style={[
                styles.imageContainer,
                animatedStyle,
                { height: imageRatio ? SCREEN_WIDTH / imageRatio : '100%' },
              ]}
            >
              <Animated.Image
                source={TOPO_IMAGE_SOURCE}
                style={[
                  styles.image,
                  { height: imageRatio ? SCREEN_WIDTH / imageRatio : '100%' },
                  imageRatio ? { aspectRatio: imageRatio } : {},
                  !isImageReady ? { opacity: 0 } : null,
                ]}
                onLoadStart={() => setIsImageReady(false)}
                onLoad={(e) => {
                  const { width, height } = e.nativeEvent.source;
                  setImageRatio(width / height);
                  setIsImageReady(true);
                }}
                resizeMode="contain"
              />
              {svgViewBox && isImageReady && imageRatio && (
                <TopoSvgOverlay
                  width={SCREEN_WIDTH}
                  height={imageRatio ? SCREEN_WIDTH / imageRatio : '100%'}
                  viewBox={svgViewBox}
                  style={styles.svgOverlay}
                  paths={pathsConfig}
                  pressedPaths={pressedPaths}
                  onPathPressIn={handlePathPressIn}
                  onPathPressOut={handlePathPressOut}
                  onPathPress={handlePathPress}
                />
              )}
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>
      </ThemedView>

      {/* Bottom Sheet with routes list */}
      <TopoBottomSheet data={pathsConfig} onRoutePress={handleRoutePress} />

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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageSection: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.6,
    overflow: 'hidden',
  },
  gestureContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.6,
  },
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
