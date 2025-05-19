import { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import Text from "../assets/fonts/CustomText";
import { useDispatch } from "react-redux";
import MapView from "react-native-maps";
import * as Location from "expo-location";

export default function HomeScreen({ navigation }) {
  const backUrl = process.env.BACK_URL;
  const dispatch = useDispatch();
  const [currentPosition, setCurrentPosition] = useState(null);

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setCurrentPosition(location.coords);
        });
      } else {
        alert("Permission de localisation refusée");
      }
    };
    getLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <MapView mapType="normal" style={StyleSheet.absoluteFillObject} />

      <KeyboardAvoidingView
        style={styles.logContent}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.title}>Bienvenue sur UniMap+</Text>
        <Image style={styles.image} source={require("../assets/logo.png")} />
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRegister}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>S'inscrire</Text>
        </TouchableOpacity>
        <Text style={styles.textInscription}>Continuer en tant qu'invitée</Text>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logContent: {
    position: "absolute",
    top: "15%",
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
    height: 550,
    borderRadius: 20,
  },
  title: {
    width: "100%",
    textAlign: "center",
    fontSize: 34,
    fontWeight: "650",
    color: "black",
    textShadowColor: "grey",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginTop: 20,
  },
  button: {
    alignItems: "center",
    width: "92%",
    height: 50,
    marginTop: 20,
    backgroundColor: "#B6DCFD",
    borderRadius: 10,
    paddingVertical: 10,
  },
  textButton: {
    color: "black",
    fontWeight: "600",
    fontSize: 18,
  },
  textInscription: {
    width: "100%",
    textAlign: "left",
    marginLeft: 30,
    marginTop: 20,
    fontSize: 15,
    color: "#B6DCFD",
  },
  image: {
    marginTop: 30,
    marginBottom: 20,
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
});
