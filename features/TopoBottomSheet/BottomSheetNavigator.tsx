import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteDetails } from './RouteDetails';
import { RoutesList } from './RoutesList';

type SheetStackParamList = {
  List: undefined;
  Details: { routeId: string };
};

type RouteListItemData = {
  id: string;
  name: string;
  grade?: string;
  rating?: number;
  isHighlighted?: boolean;
  isMuted?: boolean;
};

const Stack = createNativeStackNavigator<SheetStackParamList>();

const BottomSheetNavigator = ({
  data,
  onRoutePress,
  ref,
}: {
  data: RouteListItemData[];
  onRoutePress?: (route: RouteListItemData) => void;
  ref?: React.Ref<any>;
}) => {
  return (
    <NavigationIndependentTree>
      <NavigationContainer ref={ref}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="List">
            {(props) => (
              <RoutesList
                {...props}
                routes={data}
                onRoutePress={onRoutePress}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Details">
            {(props) => <RouteDetails {...props} details={data} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};

export default BottomSheetNavigator;
