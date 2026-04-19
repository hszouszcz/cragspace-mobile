import { IconSymbol } from '@/components/ui/icon-symbol';
import { WallDotIndicator } from '@/features/SectorTopo/WallDotIndicator';
import type { Wall } from '@/services/guidebooks/types';
import { palette } from '@/src/theme';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useRef } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { FullscreenWallSlide } from './FullscreenWallSlide';
import { fullscreenViewerStyles } from './FullscreenTopoViewer.styles';
import { useFullscreenPager } from './useFullscreenPager';

interface Props {
  visible: boolean;
  walls: Wall[];
  initialWallIndex: number;
  /** Called with the wall index active when the user closes fullscreen */
  onClose: (activeWallIndex: number) => void;
}

export function FullscreenTopoViewer({
  visible,
  walls,
  initialWallIndex,
  onClose,
}: Props) {
  const { width, height } = useWindowDimensions();

  // In landscape the longer dimension is the width
  const landscapeWidth = Math.max(width, height);
  const landscapeHeight = Math.min(width, height);

  const screenWidthSV = useSharedValue(landscapeWidth);
  const screenHeightSV = useSharedValue(landscapeHeight);

  useEffect(() => {
    screenWidthSV.value = landscapeWidth;
    screenHeightSV.value = landscapeHeight;
  }, [landscapeWidth, landscapeHeight, screenWidthSV, screenHeightSV]);

  const activeIsZoomedSharedValue = useSharedValue(false);

  const {
    currentWallIndex,
    currentWallIndexSharedValue,
    translateXSharedValue,
    pagerGesture,
    pagerGestureRef,
    goToWall: _goToWall,
    snapToWallInstant,
  } = useFullscreenPager({
    wallCount: walls.length,
    initialWallIndex,
    screenWidthSV,
    activeIsZoomedSharedValue,
  });

  // Keep a stable ref so the effect below never has snapToWallInstant as a dep
  // (it's a new function reference every render, which would re-fire the effect
  // after every swipe and snap the pager back to initialWallIndex).
  const snapToWallInstantRef = useRef(snapToWallInstant);
  snapToWallInstantRef.current = snapToWallInstant;

  // Snap to the currently selected wall each time the modal opens (no animation —
  // the modal fades in so the user never sees the pager move).
  useEffect(() => {
    if (visible) {
      snapToWallInstantRef.current(initialWallIndex);
    }
  }, [visible, initialWallIndex]);

  // Lock orientation to landscape on open.
  // The cleanup only registers when visible=true so it only fires on unmount
  // (or next open), never on the false→true transition that would cause a
  // portrait→landscape double-rotation glitch.
  useEffect(() => {
    if (!visible) return;

    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE,
    ).catch(() => {});

    // Safety net: restore portrait if the component unmounts while visible
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      ).catch(() => {});
    };
  }, [visible]);

  // Close: restore portrait orientation first, then call onClose once the OS
  // has reported portrait dimensions so WallViewer re-renders correctly.
  const handleClose = () => {
    // Capture the active index at press time before any async work
    const activeIndex = currentWallIndex;

    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    ).catch(() => {});

    const { width: w, height: h } = Dimensions.get('window');
    if (h > w) {
      // Already portrait (simulator / no orientation lock) — close immediately
      onClose(activeIndex);
      return;
    }

    // Wait for the OS to report portrait dimensions before unmounting so that
    // WallViewer's useTopoViewAnimations captures the correct portrait height.
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      if (window.height > window.width) {
        subscription.remove();
        onClose(activeIndex);
      }
    });
  };

  const pagerTrackAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXSharedValue.value }],
  }));

  const handleEdgeSwipe = (wallIdx: number) => (direction: 'next' | 'prev') => {
    if (wallIdx !== currentWallIndex) return;
    _goToWall(
      direction === 'next' ? currentWallIndex + 1 : currentWallIndex - 1,
    );
  };

  const currentWall = walls[currentWallIndex];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
      supportedOrientations={['landscape', 'landscape-left', 'landscape-right']}
      onRequestClose={handleClose}
    >
      <View style={fullscreenViewerStyles.container}>
        {/* Wall name */}
        {currentWall && (
          <View style={fullscreenViewerStyles.wallNameContainer}>
            <Text style={fullscreenViewerStyles.wallNameText} numberOfLines={1}>
              {currentWall.name}
            </Text>
          </View>
        )}

        {/* Close button */}
        <Pressable
          onPress={handleClose}
          style={fullscreenViewerStyles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="Close fullscreen view"
        >
          <IconSymbol name="xmark" size={20} color={palette.white} />
        </Pressable>

        {/* Pager */}
        <GestureDetector gesture={pagerGesture}>
          <Animated.View style={fullscreenViewerStyles.pagerWrapper}>
            <Animated.View
              style={[
                fullscreenViewerStyles.pagerTrack,
                pagerTrackAnimatedStyle,
              ]}
            >
              {walls.map((wall, idx) => (
                <FullscreenWallSlide
                  key={wall.id}
                  wall={wall}
                  wallIndex={idx}
                  currentWallIndexSharedValue={currentWallIndexSharedValue}
                  activeIsZoomedSharedValue={activeIsZoomedSharedValue}
                  screenWidthSV={screenWidthSV}
                  screenHeightSV={screenHeightSV}
                  onEdgeSwipe={handleEdgeSwipe(idx)}
                  pagerGestureRef={pagerGestureRef}
                />
              ))}
            </Animated.View>
          </Animated.View>
        </GestureDetector>

        {/* Dot indicator — only show when there are multiple walls */}
        {walls.length > 1 && (
          <View style={fullscreenViewerStyles.dotIndicatorContainer}>
            <WallDotIndicator
              count={walls.length}
              activeIndex={currentWallIndex}
            />
          </View>
        )}
      </View>
    </Modal>
  );
}
