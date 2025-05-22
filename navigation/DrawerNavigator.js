import { TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { FontAwesome } from "@expo/vector-icons";
import MapScreen from "../screens/MapScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        drawerStyle: { width: "33%" },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginRight: 15 }}
          >
            <FontAwesome name="bars" size={24} color="black" />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen
        name="Map"
        component={MapScreen}
        options={{ title: "Ma carte" }}
      />
    </Drawer.Navigator>
  );
}
