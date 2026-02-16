import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteDetails } from './RouteDetails';
import { RoutesList } from './RoutesList';
import { type RouteListItemData } from './types';

type SheetStackParamList = {
  List: undefined;
  Details: { routeId: string };
};

const Stack = createNativeStackNavigator<SheetStackParamList>();

const BottomSheetNavigator = ({
  data,
  onRoutePress,
  ref,
  currentSnapPoint,
}: {
  data: RouteListItemData[];
  onRoutePress?: (route: RouteListItemData) => void;
  currentSnapPoint: number;
  ref?: React.Ref<any>;
}) => {
  return (
    <NavigationIndependentTree>
      <NavigationContainer ref={ref}>
        <Stack.Navigator
          screenOptions={{ headerShown: false, contentStyle: { flex: 1 } }}
        >
          <Stack.Screen name="List">
            {(props) => (
              <RoutesList
                {...props}
                routes={data}
                onRoutePress={onRoutePress}
                currentSnapPoint={currentSnapPoint}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Details">
            {(props) => <RouteDetails {...props} details={data[0]} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};

export default BottomSheetNavigator;
