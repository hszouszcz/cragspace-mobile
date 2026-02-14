import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { RoutesList } from './RoutesList';
import { RouteListItemData } from './types';

const Stack = createStackNavigator();

export const navigationRef = createNavigationContainerRef();

interface BottomSheetNavigatorProps {
  data: RouteListItemData[];
  onRoutePress?: (route: RouteListItemData) => void;
  animatedIndex: SharedValue<number>;
}

export interface BottomSheetNavigatorRef {
  canGoBack: () => boolean;
  goBack: () => void;
}

export const BottomSheetNavigator = forwardRef<
  BottomSheetNavigatorRef,
  BottomSheetNavigatorProps
>(({ data, onRoutePress, animatedIndex }, ref) => {
  useImperativeHandle(ref, () => ({
    canGoBack: () => {
      return navigationRef.isReady() && navigationRef.canGoBack();
    },
    goBack: () => {
      if (navigationRef.isReady() && navigationRef.canGoBack()) {
        navigationRef.goBack();
      }
    },
  }));

  return (
    <View style={styles.container}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { flex: 1 },
        }}
      >
        <Stack.Screen name="RoutesList">
          {() => (
            <RoutesList
              routes={data}
              onRoutePress={onRoutePress}
              animatedIndex={animatedIndex}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </View>
  );
});

BottomSheetNavigator.displayName = 'BottomSheetNavigator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
