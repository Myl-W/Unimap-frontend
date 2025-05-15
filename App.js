import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, StatusBar, View, ActivityIndicator } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import fonts from "./assets/fonts/kanit";

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
        headerStyle: {
          backgroundColor: "#DFF0FF",
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
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
  const [fontsLoaded] = useFonts(fonts);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <BottomSheetModalProvider>
      <GestureHandlerRootView>
        <StatusBar barStyle="dark-content" />
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
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    backgroundColor: "red",
  },
});
