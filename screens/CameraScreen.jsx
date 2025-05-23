import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, SafeAreaView } from "react-native";
import { Camera } from "expo-camera";
import { CameraView } from "expo-camera";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addPhoto } from "../reducers/user";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CameraScreen() {
  // Vérifie si l'écran est actuellement visible
  const isFocused = useIsFocused();

  // Permet de naviguer entre les écrans
  const navigation = useNavigation();

  // Accès au dispatch Redux
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.profile.token); // Récupère le token utilisateur

  // Récupère la position de l'utilisateur depuis le store Redux
  const { latitude, longitude } = useSelector((state) => state.trips.value);

  // Référence à la caméra pour interagir avec elle (ex: prendre une photo)
  const cameraRef = useRef(null);

  // État pour savoir si l'utilisateur a donné la permission à la caméra
  const [hasPermission, setHasPermission] = useState(null);

  // Caméra utilisée (frontale ou arrière)
  const [facing, setFacing] = useState("back");

  // Flash activé ou non
  const [flash, setFlash] = useState("off");

  // Adresse backend récupérée depuis les variables d’environnement (app.config.json)
  const BACK_URL = Constants.expoConfig?.extra?.BACK_URL;

  // -------- Demande de permission à la caméra lors du premier rendu --------
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted"); // Met à jour si la permission est accordée
    })();
  }, []);

  // -------- Affichage noir si caméra non disponible ou si l'écran n'est pas actif --------
  if (!isFocused || !hasPermission) {
    return <View style={{ flex: 1, backgroundColor: "black" }} />;
  }

  // -------- Inverse le type de caméra (avant ↔ arrière) --------
  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  // -------- Active/désactive le flash --------
  const toggleFlash = () => {
    setFlash((prev) => (prev === "off" ? "on" : "off"));
  };

  // -------- Fonction pour prendre une photo, l'envoyer à l’API et la stocker --------
  const takePicture = async () => {
    // Prise de photo avec qualité réduite pour l'upload
    const photo = await cameraRef.current?.takePictureAsync({
      quality: 0.3,
    });

    // Préparation de la photo à envoyer via une requête POST
    const formData = new FormData();
    formData.append("photoFromFront", {
      uri: photo?.uri,
      name: "photo.jpg",
      type: "image/jpeg",
    });
    // Ajoute la latitude et la longitude du store Redux
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    // Envoi de la photo vers l’API
    fetch(`${BACK_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      if (data.result) {
        photo && dispatch(addPhoto(data.url));
        navigation.navigate("AddSignalement", { placeId: data.place._id });
      } else {
        console.error("Erreur lors de l'upload de la photo");
      }
  };

  return (
    <CameraView
      style={styles.camera}
      facing={facing}
      flash={flash}
      ref={cameraRef}
    >
      {/* -------- Zone supérieure : paramètres caméra (switch et flash) -------- */}
      <SafeAreaView style={styles.settingContainer}>
        {/* Bascule entre caméra frontale et arrière */}
        <TouchableOpacity
          style={styles.settingButton}
          onPress={toggleCameraFacing}
        >
          <FontAwesome name="rotate-right" size={25} color="white" />
        </TouchableOpacity>

        {/* Active/désactive le flash */}
        <TouchableOpacity style={styles.settingButton} onPress={toggleFlash}>
          <FontAwesome
            name="flash"
            size={25}
            color={flash === "on" ? "#e8be4b" : "white"} // Change la couleur si le flash est actif
          />
        </TouchableOpacity>
      </SafeAreaView>

      {/* -------- Zone inférieure : bouton de capture photo -------- */}
      <View style={styles.snapContainer}>
        <TouchableOpacity style={styles.snapButton} onPress={takePicture}>
          <FontAwesome name="circle-thin" size={95} color="white" />
        </TouchableOpacity>
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    justifyContent: "space-between",
  },
  settingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },
  settingButton: {
    width: 40,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  snapContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  snapButton: {
    width: 100,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
