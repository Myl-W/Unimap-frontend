// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { StyleSheet, TouchableOpacity } from "react-native";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// import HomeScreen from "./screens/HomeScreen";
// import MapScreen from "./screens/MapScreen";

// import { Provider } from "react-redux";
// import { configureStore } from "@reduxjs/toolkit";
// import user from "./reducers/user";

// const store = configureStore({
//   reducer: { user },
// });

// const Stack = createNativeStackNavigator();
// const Drawer = createDrawerNavigator();

// const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         drawerStyle: { width: "33%" },
//         headerLeft: ({ navigation }) => (
//           <TouchableOpacity
//             onPress={() => navigation.openDrawer()}
//             style={{ marginLeft: 10 }}
//           >
//             <FontAwesome name="bars" size={24} color="black" />
//           </TouchableOpacity>
//         ),
//       }}
//     >
//       <Drawer.Screen name="Map" component={MapScreen} />
//     </Drawer.Navigator>
//   );
// };

// export default function App() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Provider store={store}>
//         <NavigationContainer>
//           <Stack.Navigator>
//             <Stack.Screen
//               name="search"
//               component={HomeScreen}
//               options={{
//                 headerShown: false,
//                 headerLeft: () => (
//                   <TouchableOpacity onPress={() => alert("Icône cliquée")}>
//                     <FontAwesome name="search" size={24} color="black" />
//                   </TouchableOpacity>
//                 ),
//               }}
//             />
//             <Stack.Screen
//               name="Map"
//               component={MapScreen}
//               options={{
//                 headerRight: ({ navigation }) => (
//                   <TouchableOpacity
//                     onPress={() =>
//                       navigation.navigate("Map", { openSearch: true })
//                     }
//                   >
//                     <FontAwesome name="search" size={24} color="black" />
//                   </TouchableOpacity>
//                 ),
//               }}
//             />
//             <Stack.Screen name="Drawer" component={DrawerNavigator} />
//           </Stack.Navigator>
//         </NavigationContainer>
//       </Provider>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";

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
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
