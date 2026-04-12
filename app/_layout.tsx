import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import { GUIDEBOOK_SCREEN_TITLE } from '@/app/search/data';
import AppHeader from '@/components/header/AppHeader';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="search/index"
            options={{
              title: GUIDEBOOK_SCREEN_TITLE,
              header: AppHeader,
            }}
          />
          <Stack.Screen
            name="guidebook/[id]"
            options={{
              title: '',
              header: AppHeader,
            }}
          />
          <Stack.Screen
            name="guidebook/info/[id]"
            options={{
              presentation: 'modal',
              header: AppHeader,
            }}
          />
          <Stack.Screen
            name="TopoView"
            options={{
              title: 'Topo View',
              header: AppHeader,
            }}
          />
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              title: 'Modal',
              header: AppHeader,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
