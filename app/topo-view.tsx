import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import RouteDetailModal from '@/components/topo/route-detail-modal';
import TopoFullscreenViewer from '@/components/topo/topo-fullscreen-viewer';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet } from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { useZoomableGestures } from '@/hooks/topo/use-zoomable-gestures';
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
  const [pressedListItem, setPressedListItem] = useState<string | null>(null);
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
                <Svg
                  width={SCREEN_WIDTH}
                  height={imageRatio ? SCREEN_WIDTH / imageRatio : '100%'}
                  viewBox={svgViewBox}
                  style={styles.svgOverlay}
                >
                  {pathsConfig.map((pathConfig) => (
                    <Path
                      key={pathConfig.id}
                      d={pathConfig.d}
                      stroke={
                        pressedPaths[pathConfig.id]
                          ? '#ff0000'
                          : pathConfig.color
                      }
                      strokeWidth={pathConfig.strokeWidth}
                      fill="none"
                      onPressIn={() => handlePathPressIn(pathConfig.id)}
                      onPressOut={() => handlePathPressOut(pathConfig.id)}
                      onPress={() => handlePathPress(pathConfig.id)}
                    />
                  ))}
                </Svg>
              )}
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>
      </ThemedView>

      {/* Routes list section - 40% height */}
      <ThemedView style={styles.listSection}>
        <ThemedView style={styles.listHeader}>
          <ThemedText type="subtitle">Drogi wspinaczkowe</ThemedText>
        </ThemedView>
        <ScrollView style={styles.scrollView}>
          {pathsConfig.map((route) => (
            <Pressable
              key={route.id}
              onPressIn={() => handleListItemPressIn(route.id)}
              onPressOut={handleListItemPressOut}
              onPress={() => handleListItemPress(route.id)}
              style={[
                styles.listItem,
                pressedListItem === route.id && styles.listItemPressed,
              ]}
            >
              <ThemedView
                style={[
                  styles.colorIndicator,
                  { backgroundColor: route.color },
                ]}
              />
              <ThemedView style={styles.listItemContent}>
                <ThemedText style={styles.routeName}>{route.name}</ThemedText>
                <ThemedText style={styles.routeGrade}>{route.grade}</ThemedText>
              </ThemedView>
            </Pressable>
          ))}
        </ScrollView>
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
  listSection: {
    height: SCREEN_HEIGHT * 0.4,
    borderTopWidth: 2,
    borderTopColor: '#ccc',
  },
  listHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scrollView: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemPressed: {
    backgroundColor: '#f0f0f0',
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  listItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  routeGrade: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
});
