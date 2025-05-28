import { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
} from "react-native";
import { useDispatch } from "react-redux";
import MapView from "react-native-maps";
import * as Location from "expo-location";

export default function HomeScreen({ navigation }) {
  const BACK_URL = process.env.BACK_URL;
  const dispatch = useDispatch();
  const [currentPosition, setCurrentPosition] = useState(null); // État local pour stocker la position actuelle de l'utilisateur

  // Redirige vers l'écran d'inscription
  const handleRegister = () => {
    navigation.navigate("Register");
  };

  // Redirige vers l'écran de connexion
  const handleLogin = () => {
    navigation.navigate("Login");
  };

  useEffect(() => {
    // Fonction pour gérer les permissions de localisation et suivre la position
    const getLocationPermission = async () => {
      // Demande d'autorisation pour accéder à la localisation
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        // Si la permission est accordée, on démarre la surveillance de la position
        Location.watchPositionAsync(
          { distanceInterval: 10 }, // Rafraîchit la position tous les 10 mètres parcourus
          (location) => {
            setCurrentPosition(location.coords); // Stocke les coordonnées dans le state
          }
        );
      } else {
        alert("Permission de localisation refusée"); // Alerte si l'utilisateur refuse l'accès
      }
    };

    getLocationPermission(); // Appel de la fonction lors du montage du composant
  }, []); // Le tableau vide garantit que l'effet ne s'exécute qu'une seule fois (au montage)

  return (
    <View style={styles.container}>
      <MapView
        mapType="normal" // Type de carte affichée (ici carte classique)
        style={StyleSheet.absoluteFillObject} // Étend la carte sur toute la surface du parent
        scrollEnabled={false} // Désactive le déplacement manuel de la carte
        zoomEnabled={false} // Désactive le zoom (par pincement)
        rotateEnabled={false} // Empêche l'utilisateur de faire pivoter la carte
        pitchEnabled={false} // Empêche l'inclinaison 3D de la carte
      />

      <KeyboardAvoidingView
        style={styles.logContent}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Ajustement automatique de la vue avec le clavier selon la plateforme
      >
        {/* Titre principal de l'application */}
        <Text style={styles.title}>Bienvenue sur UniMap+</Text>

        {/* Logo de l'application */}
        <Image style={styles.image} source={require("../assets/logo.png")} />

        {/* Bouton de connexion */}
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
          activeOpacity={0.8} // Réduction de l'opacité lors du clic
        >
          <Text style={styles.textButton}>Se connecter</Text>
        </TouchableOpacity>

        {/* Bouton d'inscription */}
        <TouchableOpacity
          onPress={handleRegister}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>S'inscrire</Text>
        </TouchableOpacity>

        {/* Lien pour accéder à la carte sans compte */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Map")}>
          <Text style={styles.textInscription}>
            Continuer en tant qu'invitée
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Prend tout l'espace disponible
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
    textShadowColor: "grey", // Ombre de texte grise
    textShadowOffset: { width: 1, height: 1 }, // Décalage de l'ombre
    textShadowRadius: 2, // Flou de l'ombre
    marginTop: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
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
    resizeMode: "contain", // Garde les proportions de l'image
  },
});
