import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme.web';
import { Pressable, StyleSheet } from 'react-native';
import { RouteListItemData } from './types';

interface RouteListItemProps {
  item: RouteListItemData;
  onPress: (item: RouteListItemData) => void;
  pressedListItem: string | null;
  onPressIn: (id: string) => void;
  onPressOut: () => void;
}

export const RouteListItem = ({
  item,
  onPress,
  pressedListItem,
  onPressIn,
  onPressOut,
}: RouteListItemProps) => {
  const colorScheme = useColorScheme();
  
  return (
    <Pressable
      onPressIn={() => onPressIn(item.id)}
      onPressOut={onPressOut}
      onPress={() => onPress(item)}
      style={[
        styles.listItem,
        pressedListItem === item.id && styles.listItemPressed,
      ]}
    >
      <ThemedView
        style={[styles.colorIndicator, { backgroundColor: item.color }]}
      />
      <ThemedView style={styles.listItemContent}>
        <ThemedText style={styles.routeName}>{item.name}</ThemedText>
        <ThemedText style={styles.routeGrade}>{item.grade}</ThemedText>
      </ThemedView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemPressed: {
    backgroundColor: '#f0f0f0',
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  listItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  routeGrade: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
});
