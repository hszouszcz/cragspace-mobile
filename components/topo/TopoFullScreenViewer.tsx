import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TopoSvgOverlay } from '@/components/topo/TopoSvgOverlay';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SvgPathConfig } from '@/services/topo/loadSvgPaths';
import { theme } from '@/src/theme';
import {
  Dimensions,
  ImageSourcePropType,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import Animated from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const { spacing, radii, typography } = theme;
const { typeScale } = typography;

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
  const colorScheme = useColorScheme();
  const colors = theme.colors(colorScheme ?? 'light');

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <ThemedView
        style={[
          styles.container,
          { backgroundColor: colors.backgroundPrimary },
        ]}
      >
        <Pressable
          onPress={onClose}
          style={[
            styles.closeButton,
            { backgroundColor: colors.surfaceOverlay },
          ]}
        >
          <ThemedText style={[styles.closeText, { color: colors.textInverse }]}>
            X
          </ThemedText>
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
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: spacing.xl,
    zIndex: 2,
    padding: spacing.md,
    borderRadius: radii['2xl'],
  },
  closeText: {
    ...typeScale.titleLg,
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
