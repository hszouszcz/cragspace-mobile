import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TopoSvgOverlay } from '@/components/topo/TopoSvgOverlay';
import { SvgPathConfig } from '@/services/topo/loadSvgPaths';
import {
  Dimensions,
  ImageSourcePropType,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import Animated from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type TopoPath = SvgPathConfig & {
  strokeWidth: number;
};

type TopoFullscreenViewerProps = {
  visible: boolean;
  svgViewBox: string;
  paths: TopoPath[];
  imageSource: ImageSourcePropType;
  onClose: () => void;
  onPathPress: (pathId: string) => void;
};

export default function TopoFullscreenViewer({
  visible,
  svgViewBox,
  paths,
  imageSource,
  onClose,
  onPathPress,
}: TopoFullscreenViewerProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <ThemedText style={styles.closeText}>X</ThemedText>
        </Pressable>
        <ThemedView style={styles.stage}>
          <Animated.Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
          <TopoSvgOverlay
            viewBox={svgViewBox}
            style={[styles.svg, { width: SCREEN_HEIGHT, height: SCREEN_WIDTH }]}
            paths={paths}
            onPathPress={onPathPress}
          />
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 2,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 18,
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  stage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_HEIGHT,
    height: SCREEN_WIDTH,
    transform: [{ rotate: '90deg' }],
  },
  svg: {
    position: 'absolute',
    transform: [{ rotate: '90deg' }],
  },
});
