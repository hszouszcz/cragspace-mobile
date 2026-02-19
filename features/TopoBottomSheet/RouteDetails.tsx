import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useBottomSheetAvailableHeight } from '@/hooks/topo/useBottomSheetAvailableHeight';

import { useState } from 'react';
import {
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { type RouteListItemData } from './types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RouteDetailsProps {
  details: RouteListItemData;
  currentSnapPoint: number;
}

const CloneCompoent = () => {
  return (
    <View style={{ height: 200, backgroundColor: 'red' }}>
      <Text>CLOOOONE</Text>
    </View>
  );
};
export const RouteDetails = ({
  details,
  currentSnapPoint,
}: RouteDetailsProps) => {
  const [dummyArray, setDummyArrau] = useState<number[]>([]);
  const { availableHeight } = useBottomSheetAvailableHeight(currentSnapPoint);

  console.log('availableHeight', availableHeight);

  const addCloneComponenttoDummyArray = () => {
    setDummyArrau([...dummyArray, Math.random()]);
    console.log(dummyArray);
  };
  return (
    <View style={{ height: availableHeight }}>
      <ScrollView
        style={{ height: availableHeight }}
        contentContainerStyle={{ padding: 20 }}
      >
        <ThemedView style={styles.detailSection}>
          <ThemedText type="subtitle">Szczegoly drogi</ThemedText>

          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.label}>Nazwa:</ThemedText>
            <ThemedText style={styles.value}>{details.name}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.label}>Dlugosc:</ThemedText>
            <ThemedText style={styles.value}>{details.length} m</ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.label}>Ilosc przelotow:</ThemedText>
            <ThemedText style={styles.value}>{details.bolts}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.label}>Trudnosc:</ThemedText>
            <ThemedText style={styles.value}>{details.grade}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.label}>Typ:</ThemedText>
            <ThemedText style={styles.value}>{details.type}</ThemedText>
          </ThemedView>

          {details.description && (
            <>
              <Button
                onPress={addCloneComponenttoDummyArray}
                title="Dodaj kloona"
              />
              <ThemedView style={styles.descriptionSection}>
                <ThemedText style={styles.label}>Opis:</ThemedText>
                <ThemedText style={styles.description}>
                  {details.description}
                </ThemedText>
              </ThemedView>
            </>
          )}
          {dummyArray.map((_, index) => (
            <CloneCompoent key={index} />
          ))}
        </ThemedView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
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
