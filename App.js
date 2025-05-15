import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import CompteScreen from "./screens/CompteScreen";
import FavorisScreen from "./screens/FavorisScreen";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";

const store = configureStore({
  reducer: { user },
});

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { width: "45%" },
        drawerPosition: "right",
      }}
    >
      <Drawer.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ title: "Carte" }}
      />
      <Drawer.Screen
        name="CompteScreen"
        component={CompteScreen}
        options={{ title: "Mon compte" }}
      />
      <Drawer.Screen
        name="FavorisScreen"
        component={FavorisScreen}
        options={{ title: "Favoris" }}
      />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="search"
              component={HomeScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Map"
              component={DrawerNavigator}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
