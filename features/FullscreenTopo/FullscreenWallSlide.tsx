import { TopoSvgOverlay } from '@/components/topo/TopoSvgOverlay';
import { useLoadRouteSvgPaths } from '@/features/TopoPreview/useLoadRouteSvgPaths';
import { useGalleryGestures } from '@/hooks/topo/useGalleryGestures';
import type { Wall } from '@/services/guidebooks/types';
import type { GestureType } from 'react-native-gesture-handler';
import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

interface Props {
  wall: Wall;
  wallIndex: number;
  currentWallIndexSharedValue: SharedValue<number>;
  activeIsZoomedSharedValue: SharedValue<boolean>;
  screenWidthSV: SharedValue<number>;
  screenHeightSV: SharedValue<number>;
  onEdgeSwipe?: (direction: 'next' | 'prev') => void;
  pagerGestureRef?: React.RefObject<GestureType | undefined>;
}

export function FullscreenWallSlide({
  wall,
  wallIndex,
  currentWallIndexSharedValue,
  activeIsZoomedSharedValue,
  screenWidthSV,
  screenHeightSV,
  onEdgeSwipe,
  pagerGestureRef,
}: Props) {
  const imageMeta = Image.resolveAssetSource(wall.imageAsset);
  const initialImageRatio =
    imageMeta?.width && imageMeta?.height
      ? imageMeta.width / imageMeta.height
      : null;

  const [isImageReady, setIsImageReady] = useState(Boolean(initialImageRatio));
  const imageRatioSV = useSharedValue(initialImageRatio ?? 1);

  const { paths, viewBox } = useLoadRouteSvgPaths(wall.svgAsset);

  // Container fills the full landscape screen
  const containerSize = useDerivedValue(() => ({
    width: screenWidthSV.value,
    height: screenHeightSV.value,
  }));

  // Content: contain image within the landscape container
  const contentSize = useDerivedValue(() => {
    const ratio = imageRatioSV.value || 1;
    const cw = screenWidthSV.value;
    const ch = screenHeightSV.value;
    // If the container is wider than the image ratio, height fills the container
    if (cw / ch > ratio) {
      return { width: ch * ratio, height: ch };
    }
    return { width: cw, height: cw / ratio };
  });

  const {
    gesture: composedGesture,
    animatedStyle,
    isZoomedDerived,
    resetTransform,
  } = useGalleryGestures({
    containerSize,
    contentSize,
    maxScale: 5,
    onEdgeSwipe,
    pagerGestureRef,
  });

  // Sync zoom state to parent so the pager can gate itself
  useAnimatedReaction(
    () =>
      isZoomedDerived.value && currentWallIndexSharedValue.value === wallIndex,
    (isActiveAndZoomed) => {
      activeIsZoomedSharedValue.value = isActiveAndZoomed;
    },
  );

  // Reset zoom when navigating away from this wall
  useAnimatedReaction(
    () => currentWallIndexSharedValue.value,
    (currentIdx, prevIdx) => {
      if (prevIdx === null) return;
      if (prevIdx === wallIndex && currentIdx !== wallIndex) {
        resetTransform(false);
      }
    },
  );

  const slotAnimatedStyle = useAnimatedStyle(() => ({
    width: screenWidthSV.value,
    height: screenHeightSV.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    width: contentSize.value.width,
    height: contentSize.value.height,
  }));

  return (
    <Animated.View style={slotAnimatedStyle}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.centeredContent]}
        >
          <Animated.View style={[styles.contentWrapper, animatedStyle]}>
            <Animated.Image
              source={wall.imageAsset}
              style={[!isImageReady && styles.hidden, contentAnimatedStyle]}
              onLoad={(e) => {
                if (!initialImageRatio) {
                  const { width, height } = e.nativeEvent.source;
                  imageRatioSV.value = width / height;
                  setIsImageReady(true);
                }
              }}
              resizeMode="contain"
            />
            {viewBox && isImageReady && (
              <TopoSvgOverlay
                viewBox={viewBox}
                style={[StyleSheet.absoluteFill]}
                paths={paths}
              />
            )}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: {
    opacity: 0,
  },
});
