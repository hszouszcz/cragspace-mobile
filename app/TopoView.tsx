import { ThemedView } from '@/components/themed-view';
import { TopoSvgOverlay } from '@/components/topo/TopoSvgOverlay';
import TopoBottomSheet, { SNAP_POINTS } from '@/components/TopoBottomSheet';
import { useLoadRouteSvgPaths } from '@/features/TopoPreview/useLoadRouteSvgPaths';
import { useTopoViewAnimations } from '@/features/TopoPreview/useTopoViewAnimations';
import { useFocusOnRoute } from '@/hooks/topo/useFocusOnRoute';
import { useViewBoxValues } from '@/hooks/topo/useViewBoxValues';
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

  const [focusedRouteId, setFocusedRouteId] = useState<string | null>(null);

  const lastPathPressTs = useRef(0);
  const previousSnapIndex = useRef(1);
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

  const {
    gesture: composedGesture,
    animatedStyle,
    setTransform,
    resetTransform,
  } = useZoomableGestures({
    containerSize,
    contentSize,
    minScaleResetThreshold: 1,
    maxScale: animatedIndexSharedValue.value === 1 ? 2 : 5,
  });

  const onGoBack = () => {
    resetTransform(true);
    setFocusedRouteId(null);
  };

  const handleSnapPointChange = (fromIndex: number, toIndex: number) => {
    if (previousSnapIndex.current !== toIndex) {
      previousSnapIndex.current = toIndex;
      resetTransform(true);
    }
  };

  const viewBoxValues = useViewBoxValues(viewBox);
  const focusOnRoute = useFocusOnRoute({
    viewBoxValues,
    containerSize,
    contentSize,
    animatedIndexSharedValue,
    setTransform,
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
      setFocusedRouteId(route.id);
    }
  };

  const handleRoutePress = ({ id }: { id: string }) => {
    const route = paths.find((item) => item.id === id);
    if (!route) {
      return;
    }

    setFocusedRouteId(route.id);
    focusOnRoute(route);
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
      <TopoBottomSheet
        data={paths}
        animatedIndex={animatedIndexSharedValue}
        snapPoints={SNAP_POINTS}
        onRoutePress={handleRoutePress}
        onSnapPointChange={handleSnapPointChange}
        onGoBack={onGoBack}
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
