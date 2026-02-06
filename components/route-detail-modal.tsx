import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { IconSymbol } from './ui/icon-symbol';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function RouteDetailModal({ visible, route, onClose }) {
  if (!route) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        {/* Header with close button */}
        <ThemedView style={styles.header}>
          <ThemedText type="title">{route.name}</ThemedText>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark.circle.fill" size={32} color="#007AFF" />
          </Pressable>
        </ThemedView>

        {/* Image with path - 50% height */}
        <ThemedView style={styles.imageContainer}>
          <Animated.Image
            source={require('@/assets/topo/dSlonia.jpeg')}
            style={styles.image}
            resizeMode="contain"
          />
          <Svg
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT * 0.5}
            viewBox="0 0 2200 1466"
            style={styles.svgOverlay}
          >
            <Path
              d={route.d}
              stroke={route.color}
              strokeWidth="12"
              fill="none"
            />
          </Svg>
        </ThemedView>

        {/* Route details - 50% height */}
        <ScrollView style={styles.detailsContainer}>
          <ThemedView style={styles.detailSection}>
            <ThemedText type="subtitle">Szczegóły drogi</ThemedText>

            <ThemedView style={styles.detailRow}>
              <ThemedText style={styles.label}>Nazwa:</ThemedText>
              <ThemedText style={styles.value}>{route.name}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.detailRow}>
              <ThemedText style={styles.label}>Długość:</ThemedText>
              <ThemedText style={styles.value}>{route.length} m</ThemedText>
            </ThemedView>

            <ThemedView style={styles.detailRow}>
              <ThemedText style={styles.label}>Ilość przelotów:</ThemedText>
              <ThemedText style={styles.value}>{route.bolts}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.detailRow}>
              <ThemedText style={styles.label}>Trudność:</ThemedText>
              <ThemedText style={styles.value}>{route.grade}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.detailRow}>
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
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  closeButton: {
    padding: 8,
  },
  imageContainer: {
    height: SCREEN_HEIGHT * 0.5,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.5,
  },
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  detailSection: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
  descriptionSection: {
    marginTop: 16,
    gap: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});
