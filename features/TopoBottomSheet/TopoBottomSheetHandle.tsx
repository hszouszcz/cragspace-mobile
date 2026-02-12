import { PRIMARY_COLOR, type TopoColorTokens } from '@/constants/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';

interface TopoBottomSheetHandleProps {
  colors: TopoColorTokens;
  canGoBack: boolean;
  sheetNavigationRef: any; // Replace with correct type if available
  sectorName: string;
  sectorTitle: string;
  onFilterPress: () => void;
}

export const TopoBottomSheetHandle = ({
  colors,
  canGoBack,
  sheetNavigationRef,
  sectorName,
  sectorTitle,
  onFilterPress,
}: TopoBottomSheetHandleProps) => {
  return (
    <View
      style={[
        styles.handleContainer,
        { backgroundColor: colors.sheetBackground },
      ]}
    >
      <View
        style={[styles.handleIndicator, { backgroundColor: colors.handle }]}
      />
      <View style={styles.headerRow}>
        {canGoBack && (
          <Button title=" < Back" onPress={() => sheetNavigationRef.goBack()} />
        )}
        <View style={styles.headerTitles}>
          <Text
            style={[styles.headerSubtitle, { color: colors.headerSubtitle }]}
          >
            {sectorName.toUpperCase()}
          </Text>
          <Text style={[styles.headerTitle, { color: colors.headerTitle }]}>
            {sectorTitle}
          </Text>
        </View>
        <Pressable
          onPress={onFilterPress}
          style={({ pressed }) => [
            styles.filterButton,
            { backgroundColor: colors.filterBackground },
            pressed && styles.filterButtonPressed,
          ]}
        >
          <MaterialIcons
            name="filter-list"
            size={16}
            color={PRIMARY_COLOR}
            style={styles.filterIcon}
          />
          <Text style={[styles.filterLabel, { color: PRIMARY_COLOR }]}>
            Filter
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  handleContainer: {
    paddingTop: 6,
    paddingBottom: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitles: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterButtonPressed: {
    opacity: 0.85,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
