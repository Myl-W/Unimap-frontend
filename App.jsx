import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, StatusBar, AccessibilityInfo } from "react-native";
import { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// -------------------  IMPORT DES PAGES -----------------------
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import CompteScreen from "./screens/CompteScreen";
import FavorisScreen from "./screens/FavorisScreen";
import ParametreScreen from "./screens/ParametreScreen";
import AddSignalement from "./screens/AddSignalement";
import CameraScreen from "./screens/CameraScreen";

// ----------------------  REDUCERS  + LOCALSTORAGE  ---------------------
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import user from "./reducers/user";
import trips from "./reducers/trips";
import accessibility from "./reducers/accessibility";
import signalement from "./reducers/signalement";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
const reducers = combineReducers({ user, accessibility, signalement, trips });
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeWorkScreen from "./screens/HomeWorkScreen";


const persistConfig = {
  key: "unimap+",
  storage: AsyncStorage,
  whitelist: ["user"],
};

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ screenReaderEnabled }) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { width: "45%" },
        drawerPosition: "left",
        headerStyle: {
          backgroundColor: "#DFF0FF",
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Drawer.Screen name="MapScreen" options={{ title: "Carte" }}>
        {(props) => (
          <MapScreen {...props} screenReaderEnabled={screenReaderEnabled} />
        )}
      </Drawer.Screen>
      <Drawer.Screen name="CompteScreen" options={{ title: "Mon compte" }}>
        {(props) => (
          <CompteScreen {...props} screenReaderEnabled={screenReaderEnabled} />
        )}
      </Drawer.Screen>
      <Drawer.Screen name="FavorisScreen" options={{ title: "Favoris" }}>
        {(props) => (
          <FavorisScreen {...props} screenReaderEnabled={screenReaderEnabled} />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default function App() {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  useEffect(() => {
    const checkScreenReader = async () => {
      const enabled = await AccessibilityInfo.isScreenReaderEnabled();
      setScreenReaderEnabled(enabled);
    };

    checkScreenReader();

    const subscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      setScreenReaderEnabled
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <BottomSheetModalProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" />

          <PersistGate persistor={persistor}>
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerStyle: {
                    backgroundColor: "#DFF0FF",
                  },
                }}
              >
                <Stack.Screen
                  name="search"
                  component={HomeScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="Map" options={{ headerShown: false }}>
                  {(props) => (
                    <DrawerNavigator
                      {...props}
                      screenReaderEnabled={screenReaderEnabled}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen
                  name="Parametre"
                  component={ParametreScreen}
                  options={{
                    title: "Paramètres",
                    headerBackTitle: "Mon compte",
                  }}
                />
                <Stack.Screen
                  name="Signalement"
                  component={AddSignalement}
                  options={{
                    title: "Ajouter un signalement",
                    headerBackTitle: "",
                  }}
                />
                <Stack.Screen name="Camera" component={CameraScreen} />
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{
                    title: "Connexion",
                    headerBackTitle: "",
                  }}
                />
                <Stack.Screen
                  name="Register"
                  component={RegisterScreen}
                  options={{
                    title: "Créer un compte",
                    headerBackTitle: "",
                  }}
                />
                <Stack.Screen
                  name="HomeWorkScreen"
                  component={HomeWorkScreen}
                  options={{
                    title: "Domicile & Travail",
                    headerBackTitle: "Mon compte",
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </PersistGate>
        </GestureHandlerRootView>
      </BottomSheetModalProvider>
    </Provider>
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
