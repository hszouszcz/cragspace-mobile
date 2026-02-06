import RouteDetailModal from '@/components/route-detail-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Asset } from 'expo-asset';
import { XMLParser } from 'fast-xml-parser';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function TopoView() {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const [pressedPaths, setPressedPaths] = useState({});
  const [pathsConfig, setPathsConfig] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pressedListItem, setPressedListItem] = useState(null);
  const [isFullscreenVisible, setIsFullscreenVisible] = useState(false);
  const lastPathPressTs = useRef(0);

  useEffect(() => {
    const loadSvgPaths = async () => {
      try {
        const svgAsset = Asset.fromModule(
          require('@/assets/topo/dSlonia_test.svg'),
        );
        await svgAsset.downloadAsync();

        const response = await fetch(svgAsset.localUri);
        const svgContent = await response.text();

        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: '',
        });

        const result = parser.parse(svgContent);
        const paths = result.svg.g.path;

        const parsedPaths = (Array.isArray(paths) ? paths : [paths]).map(
          (path, index) => {
            const styleAttr = path.style || '';
            const fillMatch = styleAttr.match(/fill:(#[0-9a-fA-F]{6})/);
            const color = fillMatch ? fillMatch[1] : '#00ff00';

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
              id: path.id || `path-${Math.random()}`,
              d: path.d,
              color: color,
              strokeWidth: 9,
              ...routeData,
            };
          },
        );

        setPathsConfig(parsedPaths);
      } catch (error) {
        console.error('Error loading SVG:', error);
      }
    };

    loadSvgPaths();
  }, []);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      // Limit zoom levels
      if (scale.value < 1) {
        scale.value = withTiming(1);
        // Reset position when zoom out to minimum
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else if (scale.value > 5) {
        scale.value = withTiming(5);
      }
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      // Only allow pan when zoomed in
      if (savedScale.value > 1) {
        translateX.value = savedTranslateX.value + e.translationX;
        translateY.value = savedTranslateY.value + e.translationY;
      }
    })
    .onEnd(() => {
      if (savedScale.value > 1) {
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      }
    });

  const handleImagePress = () => {
    if (Date.now() - lastPathPressTs.current < 250) {
      return;
    }
    setIsFullscreenVisible(true);
  };

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        // Reset to original size
        scale.value = withTiming(1);
        savedScale.value = 1;
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        // Zoom in
        scale.value = withTiming(3);
        savedScale.value = 3;
      }
    });

  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .maxDuration(250)
    .runOnJS(true)
    .onEnd(() => {
      handleImagePress();
    });

  const tapGesture = Gesture.Exclusive(doubleTapGesture, singleTapGesture);

  const composedGesture = Gesture.Race(
    tapGesture,
    Gesture.Simultaneous(pinchGesture, panGesture),
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
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
      <ThemedView style={styles.imageSection}>
        <GestureHandlerRootView style={styles.gestureContainer}>
          <GestureDetector gesture={composedGesture}>
            <Animated.View style={[styles.imageContainer, animatedStyle]}>
              <Animated.Image
                source={require('@/assets/topo/dSlonia.jpeg')}
                style={styles.image}
                resizeMode="contain"
              />
              <Svg
                width={SCREEN_WIDTH}
                height={SCREEN_HEIGHT * 0.6}
                viewBox="0 0 2200 1466"
                style={styles.svgOverlay}
              >
                {pathsConfig.map((pathConfig) => (
                  <Path
                    key={pathConfig.id}
                    d={pathConfig.d}
                    stroke={
                      pressedPaths[pathConfig.id] ? '#ff0000' : pathConfig.color
                    }
                    strokeWidth={pathConfig.strokeWidth}
                    fill="none"
                    onPressIn={() => handlePathPressIn(pathConfig.id)}
                    onPressOut={() => handlePathPressOut(pathConfig.id)}
                    onPress={() => handlePathPress(pathConfig.id)}
                  />
                ))}
              </Svg>
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

      <RouteDetailModal
        visible={isModalVisible}
        route={selectedRoute}
        onClose={handleCloseModal}
      />

      <Modal
        visible={isFullscreenVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={handleCloseFullscreen}
      >
        <ThemedView style={styles.fullscreenContainer}>
          <Pressable
            onPress={handleCloseFullscreen}
            style={styles.fullscreenClose}
          >
            <ThemedText style={styles.fullscreenCloseText}>X</ThemedText>
          </Pressable>
          <ThemedView style={styles.fullscreenStage}>
            <Animated.Image
              source={require('@/assets/topo/dSlonia.jpeg')}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
            <Svg
              width={SCREEN_HEIGHT}
              height={SCREEN_WIDTH}
              viewBox="0 0 2200 1466"
              style={styles.fullscreenSvg}
            >
              {pathsConfig.map((pathConfig) => (
                <Path
                  key={`fullscreen-${pathConfig.id}`}
                  d={pathConfig.d}
                  stroke={pathConfig.color}
                  strokeWidth={pathConfig.strokeWidth}
                  fill="none"
                  onPress={() => handlePathPress(pathConfig.id)}
                />
              ))}
            </Svg>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageSection: {
    height: SCREEN_HEIGHT * 0.6,
    width: SCREEN_WIDTH,
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
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 2,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 18,
  },
  fullscreenCloseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  fullscreenStage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: SCREEN_HEIGHT,
    height: SCREEN_WIDTH,
    transform: [{ rotate: '90deg' }],
  },
  fullscreenSvg: {
    position: 'absolute',
    transform: [{ rotate: '90deg' }],
  },
});
