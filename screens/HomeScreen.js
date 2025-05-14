import { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { updateEmail } from "../reducers/user";
import MapView from "react-native-maps";
import * as Location from "expo-location";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const [currentPosition, setCurrentPosition] = useState(null);
  const [email, setEmail] = useState("");

  const handleRegister = () => {
    if (email.trim() === "") {
      Alert.alert("Erreur", "Veuillez entrer un email valide.");
      return;
    }
    dispatch(updateEmail(email));
    navigation.navigate("Map");
  };

  const handleConnection = () => {
    navigation.navigate("Map");
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
        <View style={styles.titleConnexionContainer}>
          <Text style={styles.titleConnexion}>Déjà un compte ? </Text>
          <TouchableOpacity onPress={handleConnection}>
            <Text style={styles.linkText}>Connexion</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Bienvenue sur UniMap+</Text>
        <Text style={styles.textInscription}>Inscription</Text>
        <Text style={styles.textEmail}>Email</Text>
        <TextInput
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={handleRegister}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Suivant</Text>
        </TouchableOpacity>
        <Text style={styles.textInscription}>Continuer en tant qu'invitée</Text>
        <View style={styles.line} />
        <Text style={styles.textOu}>Ou</Text>
        <View style={styles.imageContent}>
          <Image
            style={styles.image}
            source={require("../assets/google.png")}
          />
          <Image
            style={styles.image}
            source={require("../assets/facebook.png")}
          />
          <Image style={styles.image} source={require("../assets/apple.png")} />
        </View>
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
    top: "20%",
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
    height: 450,
    borderRadius: 20,
  },
  title: {
    width: "100%",
    textAlign: "left",
    fontSize: 30,
    fontWeight: "550",
    color: "black",
    textShadowColor: "grey",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginLeft: 30,
    marginTop: 10,
  },
  titleConnexionContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
    marginRight: 10,
    marginTop: 10,
  },

  titleConnexion: {
    fontSize: 16,
    color: "black",
  },

  linkText: {
    fontSize: 16,
    color: "#007BFF",
    textDecorationLine: "none",
  },
  textEmail: {
    width: "100%",
    textAlign: "left",
    marginLeft: 30,
    marginTop: 15,
    fontSize: 20,
  },
  textInscription: {
    width: "100%",
    textAlign: "left",
    marginLeft: 30,
    marginTop: 15,
    fontSize: 15,
    color: "#B6DCFD",
  },
  input: {
    width: "92%",
    marginTop: 10,
    backgroundColor: "white",
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
    height: 40,
    fontSize: 18,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  button: {
    alignItems: "center",
    width: "92%",
    height: 40,
    marginTop: 20,
    backgroundColor: "#B6DCFD",
    borderRadius: 10,
    paddingVertical: 10,
  },
  textButton: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
  line: {
    width: "92%",
    height: 1,
    backgroundColor: "black",
    marginVertical: 20,
  },
  textOu: {
    width: "100%",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 15,
    fontWeight: 600,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 30,
    marginLeft: 30,
  },
  imageContent: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
});
