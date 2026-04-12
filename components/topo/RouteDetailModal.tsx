import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TopoSvgOverlay } from '@/components/topo/TopoSvgOverlay';
import { SvgPathConfig } from '@/features/TopoPreview/topo.types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { theme } from '@/src/theme';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { IconSymbol } from '../ui/icon-symbol';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const { spacing, typography } = theme;
const { typeScale } = typography;

type RouteConfig = SvgPathConfig & {
  name: string;
  length: number;
  bolts: number;
  grade: string;
  type: string;
  description?: string;
};

type RouteDetailModalProps = {
  visible: boolean;
  route: RouteConfig | null;
  svgViewBox: string;
  imageSource: ImageSourcePropType;
  onClose: () => void;
};

export default function RouteDetailModal({
  visible,
  route,
  svgViewBox,
  imageSource,
  onClose,
}: RouteDetailModalProps) {
  const colorScheme = useColorScheme();
  const colors = theme.colors(colorScheme ?? 'light');

  if (!route) return null;

  // Calculate actual image dimensions with resizeMode="contain"
  const imageSourceResolved = Image.resolveAssetSource(imageSource);
  const imageAspectRatio =
    imageSourceResolved?.width && imageSourceResolved?.height
      ? imageSourceResolved.width / imageSourceResolved.height
      : SCREEN_WIDTH / (SCREEN_HEIGHT * 0.5);

  const containerWidth = SCREEN_WIDTH;
  const containerHeight = SCREEN_HEIGHT * 0.5;
  const containerAspectRatio = containerWidth / containerHeight;

  let actualImageWidth: number;
  let actualImageHeight: number;

  if (imageAspectRatio > containerAspectRatio) {
    // Image is wider - fit to width
    actualImageWidth = containerWidth;
    actualImageHeight = containerWidth / imageAspectRatio;
  } else {
    // Image is taller - fit to height
    actualImageHeight = containerHeight;
    actualImageWidth = containerHeight * imageAspectRatio;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        <ThemedView
          style={[styles.header, { borderBottomColor: colors.separatorOpaque }]}
        >
          <ThemedText type="title">{route.name}</ThemedText>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <IconSymbol
              name="xmark.circle.fill"
              size={32}
              color={colors.brandTertiary}
            />
          </Pressable>
        </ThemedView>

        <ThemedView
          style={[
            styles.imageContainer,
            { backgroundColor: colors.backgroundPrimary },
          ]}
        >
          <Animated.Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
          <TopoSvgOverlay
            viewBox={svgViewBox}
            style={[
              styles.svgOverlay,
              { width: actualImageWidth, height: actualImageHeight },
            ]}
            paths={[route]}
            defaultStrokeWidth={12}
          />
        </ThemedView>

        <ScrollView style={styles.detailsContainer}>
          <ThemedView style={styles.detailSection}>
            <ThemedText type="subtitle">Szczegoly drogi</ThemedText>

            <ThemedView
              style={[
                styles.detailRow,
                { borderBottomColor: colors.separator },
              ]}
            >
              <ThemedText style={styles.label}>Nazwa:</ThemedText>
              <ThemedText style={styles.value}>{route.name}</ThemedText>
            </ThemedView>

            <ThemedView
              style={[
                styles.detailRow,
                { borderBottomColor: colors.separator },
              ]}
            >
              <ThemedText style={styles.label}>Dlugosc:</ThemedText>
              <ThemedText style={styles.value}>{route.length} m</ThemedText>
            </ThemedView>

            <ThemedView
              style={[
                styles.detailRow,
                { borderBottomColor: colors.separator },
              ]}
            >
              <ThemedText style={styles.label}>Ilosc przelotow:</ThemedText>
              <ThemedText style={styles.value}>{route.bolts}</ThemedText>
            </ThemedView>

            <ThemedView
              style={[
                styles.detailRow,
                { borderBottomColor: colors.separator },
              ]}
            >
              <ThemedText style={styles.label}>Trudnosc:</ThemedText>
              <ThemedText style={styles.value}>{route.grade}</ThemedText>
            </ThemedView>

            <ThemedView
              style={[
                styles.detailRow,
                { borderBottomColor: colors.separator },
              ]}
            >
              <ThemedText style={styles.label}>Typ:</ThemedText>
              <ThemedText style={styles.value}>{route.type}</ThemedText>
            </ThemedView>

            {route.description && (
              <ThemedView style={styles.descriptionSection}>
                <ThemedText style={styles.label}>Opis:</ThemedText>
                <ThemedText style={styles.description}>
                  {route.description}
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: spacing.sm,
  },
  imageContainer: {
    height: SCREEN_HEIGHT * 0.5,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.5,
  },
  svgOverlay: {
    position: 'absolute',
  },
  detailsContainer: {
    flex: 1,
    padding: spacing.xl,
  },
  detailSection: {
    gap: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  label: {
    ...typeScale.labelLg,
  },
  value: {
    ...typeScale.labelLg,
  },
  descriptionSection: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  description: {
    ...typeScale.bodySm,
  },
});
