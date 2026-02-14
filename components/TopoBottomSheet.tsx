import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import React, { forwardRef, useCallback, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import {
  BottomSheetNavigator,
  BottomSheetNavigatorRef,
  navigationRef,
} from '../features/TopoBottomSheet/BottomSheetNavigator';
import { RouteListItemData } from '../features/TopoBottomSheet/types';

interface TopoBottomSheetProps {
  data: RouteListItemData[];
  onRoutePress?: (route: RouteListItemData) => void;
  onSheetChange?: (index: number) => void;
}

export interface TopoBottomSheetRef {
  snapToIndex: (index: number) => void;
  close: () => void;
}

const TopoBottomSheet = forwardRef<TopoBottomSheetRef, TopoBottomSheetProps>(
  ({ data, onRoutePress, onSheetChange }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const sheetNavigationRef = useRef<BottomSheetNavigatorRef>(null);

    // Animated index to track current snap point
    const animatedIndex = useSharedValue(0);

    // Define snap points - these are percentages of screen height
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

    // Handle sheet changes
    const handleSheetChanges = useCallback(
      (index: number) => {
        animatedIndex.value = index;
        if (onSheetChange) {
          onSheetChange(index);
        }
      },
      [onSheetChange, animatedIndex],
    );

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
      snapToIndex: (index: number) => {
        bottomSheetRef.current?.snapToIndex(index);
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
    }));

    // Render backdrop
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      [],
    );

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={false}
        backdropComponent={renderBackdrop}
        animatedIndex={animatedIndex}
        style={styles.bottomSheet}
      >
        <BottomSheetView style={styles.navigationContainer}>
          <NavigationIndependentTree>
            <NavigationContainer ref={navigationRef}>
              <BottomSheetNavigator
                data={data}
                onRoutePress={onRoutePress}
                ref={sheetNavigationRef}
                animatedIndex={animatedIndex}
              />
            </NavigationContainer>
          </NavigationIndependentTree>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

TopoBottomSheet.displayName = 'TopoBottomSheet';

export default TopoBottomSheet;

const styles = StyleSheet.create({
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  navigationContainer: {
    flex: 1,
  },
});
