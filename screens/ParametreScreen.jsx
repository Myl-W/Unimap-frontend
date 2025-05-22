// Import des hooks Redux pour accéder au store et dispatcher des actions
import { useDispatch, useSelector } from "react-redux";

// Composant natif pour afficher des alertes système
import { Alert } from "react-native";

// Stockage asynchrone local pour stocker/effacer le token utilisateur
import AsyncStorage from "@react-native-async-storage/async-storage";

// Action pour réinitialiser les données utilisateur dans le store Redux
import { resetUser } from "../reducers/user";

// Composants natifs pour la mise en page
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";

// Icônes FontAwesome
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Import des fonctionnalités de gestion d'image (galerie et appareil photo)
import * as ImagePicker from "expo-image-picker";

// Hooks React
import { useState } from "react";

// Composant natif pour afficher des images
import { Image } from "react-native";

export default function ParametreScreen({ navigation }) {
  const dispatch = useDispatch();

  // Récupération des infos de l'utilisateur dans le store Redux
  const userInfo = useSelector((state) => state.user.value.profile);

  // État local pour stocker l'URI de l'image de profil
  const [profileImage, setProfileImage] = useState(null);

  // ------------------- GESTION DE LA DÉCONNEXION -------------------

  // Affichage d'une alerte pour confirmer la déconnexion
  const handleLogout = () => {
    Alert.alert(
      "Se déconnecter",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Se déconnecter", style: "destructive", onPress: logoutAsync },
      ],
      { cancelable: true }
    );
  };

  // Suppression du token et redirection vers l'écran de login
  const logoutAsync = async () => {
    try {
      await AsyncStorage.removeItem("userToken"); // Supprime le token stocké localement
      dispatch(resetUser()); // Réinitialise l'état utilisateur dans Redux
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }], // Redirige vers l'écran Login
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  // ------------------- GESTION DE LA PHOTO DE PROFIL -------------------

  // Ouvre la galerie d’images du téléphone
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission refusée pour accéder à la galerie !");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      // Optionnel : Envoyer cette image au serveur pour sauvegarde
    }
  };

  // Lance l'appareil photo pour prendre une nouvelle photo de profil
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission refusée pour utiliser la caméra !");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Supprime la photo de profil (localement et potentiellement côté serveur)
  const deleteProfileImage = async () => {
    Alert.alert(
      "Supprimer la photo de profil",
      "Êtes-vous sûr de vouloir supprimer votre photo de profil ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              setProfileImage(null); // Supprime l'image du state local
              await AsyncStorage.removeItem("profileImage"); // Supprime l'image du stockage local
              // Optionnel : Appeler l’API pour suppression côté serveur
              Alert.alert("Succès", "Photo de profil supprimée");
            } catch (error) {
              console.error("Erreur lors de la suppression:", error);
              Alert.alert("Erreur", "La suppression a échoué");
            }
          },
        },
      ]
    );
  };

  // Affiche un menu avec les options liées à la photo de profil
  const showImagePickerOptions = () => {
    const options = [
      { text: "Prendre une photo", onPress: takePhoto },
      { text: "Choisir depuis la galerie", onPress: pickImage },
    ];

    // Affiche l'option de suppression uniquement si une image est définie
    if (profileImage) {
      options.push({
        text: "Supprimer la photo",
        style: "destructive",
        onPress: deleteProfileImage,
      });
    }

    options.push({ text: "Annuler", style: "cancel" });

    Alert.alert(
      "Changer la photo de profil",
      "Choisissez une option",
      options,
      { cancelable: true }
    );
  };

  // ------------------- RENDU VISUEL -------------------

  return (
    <KeyboardAvoidingView
      style={styles.logContent}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {/* Bouton pour modifier l’avatar */}
        <View>
          <TouchableOpacity
            style={styles.optionAvatar}
            accessibilityLabel="Modifier son avatar"
            accessibilityRole="button"
            onPress={showImagePickerOptions}
          >
            <View style={styles.optionButtonContent}>
              <FontAwesome name="pencil" size={28} color="black" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Affichage de la photo ou icône par défaut */}
        <View style={styles.avatarContour}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.avatar}
              accessibilityLabel="Photo de profil"
            />
          ) : (
            <View style={styles.avatar}>
              <FontAwesome
                name="user"
                size={100}
                color="black"
                style={styles.icon}
                accessibilityLabel="Avatar"
                accessibilityRole="image"
              />
            </View>
          )}
        </View>

        {/* Infos compte */}
        <View style={styles.body}>
          <Text style={styles.optionText}>Informations sur le compte</Text>
        </View>

        {/* Nom complet */}
        <TouchableOpacity
          style={styles.optionButtonDown}
          accessibilityLabel="Modifier son nom complet"
          accessibilityRole="button"
        >
          <View style={styles.optionButtonContent}>
            <View>
              <Text style={styles.optionButtonText}>Nom Complet</Text>
              <Text style={styles.optionButtonText2}>
                Appuyez pour modifier
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={28} color="black" />
          </View>
        </TouchableOpacity>

        {/* Infos connexion */}
        <View style={styles.body}>
          <Text style={styles.optionText}>Informations de connexion</Text>
        </View>

        {/* Adresse e-mail */}
        <TouchableOpacity
          style={styles.optionButton}
          accessibilityLabel="Modifier son mail"
          accessibilityRole="button"
        >
          <View style={styles.optionButtonContent}>
            <View>
              <Text style={styles.optionButtonText}>Adresse e-mail</Text>
              <Text style={styles.optionButtonText2}>{userInfo.email}</Text>
            </View>
            <FontAwesome name="chevron-right" size={28} color="black" />
          </View>
        </TouchableOpacity>

        {/* Nom d'utilisateur */}
        <TouchableOpacity
          style={styles.optionButton}
          accessibilityLabel="Modifier le nom d'utilisateur"
          accessibilityRole="button"
        >
          <View style={styles.optionButtonContent}>
            <View>
              <Text style={styles.optionButtonText}>Nom d'utilisateur</Text>
              <Text style={styles.optionButtonText2}>Appuyez pour ajouter</Text>
            </View>
            <FontAwesome name="chevron-right" size={28} color="black" />
          </View>
        </TouchableOpacity>

        {/* Mot de passe */}
        <TouchableOpacity
          style={styles.optionButtonDown}
          accessibilityLabel="Modifier le mot de passe"
          accessibilityRole="button"
        >
          <View style={styles.optionButtonContent}>
            <View>
              <Text style={styles.optionButtonText}>Mot de passe</Text>
              <Text style={styles.optionButtonText2}>
                Modifier le mot de passe
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={28} color="black" />
          </View>
        </TouchableOpacity>

        {/* Section avancée */}
        <View style={styles.body}>
          <Text style={styles.optionText}>Avancé</Text>
        </View>

        {/* Bouton de déconnexion */}
        <TouchableOpacity
          style={styles.optionButton}
          accessibilityLabel="Se déconnecter"
          accessibilityRole="button"
          onPress={handleLogout}
        >
          <View style={styles.optionButtonContent}>
            <Text style={styles.optionButtonText}>Se déconnecter</Text>
          </View>
        </TouchableOpacity>

        {/* Suppression de compte */}
        <TouchableOpacity
          style={styles.optionButtonDown}
          accessibilityLabel="Supprimer le compte"
          accessibilityRole="button"
        >
          <View style={styles.optionButtonContent}>
            <Text style={styles.optionButtonDelete}>Supprimer le compte</Text>
            <FontAwesome name="chevron-right" size={28} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  },
  avatarTouchable: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  logContent: {
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    width: "100%",
    alignItems: "center",
  },
  avatarContour: {
    width: 170,
    height: 170,
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "#DFF0FF",
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    marginTop: 30,
    alignSelf: "flex-start",
    paddingLeft: 10,
  },
  optionButton: {
    backgroundColor: "white",
    width: "100%",
    height: 60,
    justifyContent: "center",
    borderTopWidth: 1,
    borderColor: "black",
  },
  optionButtonDown: {
    backgroundColor: "white",
    width: "100%",
    height: 60,
    justifyContent: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "black",
  },
  optionButtonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 5,
  },
  optionButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  optionButtonText2: {
    fontSize: 16,
    marginLeft: 10,
  },
  optionButtonDelete: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
    color: "red",
  },
  optionText: {
    fontSize: 16,
  },
  optionAvatar: {
    top: 40,
    left: 55,
    position: "relative",
    backgroundColor: "#DFF0FF",
    width: 40,
    height: 40,
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 4,
    zIndex: 2,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
