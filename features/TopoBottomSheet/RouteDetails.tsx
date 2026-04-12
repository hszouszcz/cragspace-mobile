import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useBottomSheetAvailableHeight } from '@/hooks/topo/useBottomSheetAvailableHeight';
import { theme } from '@/src/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { ScrollView, StyleSheet, View } from 'react-native';
import { type RouteListItemData } from './types';

const { spacing, typography } = theme;
const { typeScale } = typography;

interface RouteDetailsProps {
  details: RouteListItemData;
  currentSnapPoint: number;
}

export const RouteDetails = ({
  details,
  currentSnapPoint,
}: RouteDetailsProps) => {
  const colorScheme = useColorScheme();
  const colors = theme.colors(colorScheme ?? 'light');
  const { availableHeight } = useBottomSheetAvailableHeight(currentSnapPoint);

  return (
    <View style={{ height: availableHeight }}>
      <ScrollView
        style={{ height: availableHeight }}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedView style={styles.detailSection}>
          <ThemedText type="subtitle">Szczegoly drogi</ThemedText>

          <ThemedView
            style={[styles.detailRow, { borderBottomColor: colors.separator }]}
          >
            <ThemedText style={styles.label}>Nazwa:</ThemedText>
            <ThemedText style={styles.value}>{details.name}</ThemedText>
          </ThemedView>

          <ThemedView
            style={[styles.detailRow, { borderBottomColor: colors.separator }]}
          >
            <ThemedText style={styles.label}>Dlugosc:</ThemedText>
            <ThemedText style={styles.value}>{details.length} m</ThemedText>
          </ThemedView>

          <ThemedView
            style={[styles.detailRow, { borderBottomColor: colors.separator }]}
          >
            <ThemedText style={styles.label}>Ilosc przelotow:</ThemedText>
            <ThemedText style={styles.value}>{details.bolts}</ThemedText>
          </ThemedView>

          <ThemedView
            style={[styles.detailRow, { borderBottomColor: colors.separator }]}
          >
            <ThemedText style={styles.label}>Trudnosc:</ThemedText>
            <ThemedText style={styles.value}>{details.grade}</ThemedText>
          </ThemedView>

          <ThemedView
            style={[styles.detailRow, { borderBottomColor: colors.separator }]}
          >
            <ThemedText style={styles.label}>Typ:</ThemedText>
            <ThemedText style={styles.value}>{details.type}</ThemedText>
          </ThemedView>

          {details.description && (
            <ThemedView style={styles.descriptionSection}>
              <ThemedText style={styles.label}>Opis:</ThemedText>
              <ThemedText style={styles.description}>
                {details.description}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.xl,
  },
  detailSection: {
    gap: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
