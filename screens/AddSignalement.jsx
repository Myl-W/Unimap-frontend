// Import des composants React Native nécessaires à l'interface utilisateur
import {
  KeyboardAvoidingView, // Évite que le clavier masque les champs de texte
  Platform, // Pour adapter le comportement selon iOS ou Android
  StyleSheet, // Pour créer des styles en JS
  View, // Conteneur de base
  Text, // Affichage de texte
  TextInput, // Champ de saisie
  TouchableOpacity, // Bouton pressable
  Image, // Affichage d’image
} from "react-native";

// Import du hook Redux pour accéder au store global
import { useSelector } from "react-redux";

// Import des hooks React
import { useState } from "react";

// Import des constantes de l’environnement (via app.json ou app.config.js)
import Constants from "expo-constants";

// Déclaration du composant AddSignalement
export default function AddSignalement({ navigation, route }) {
  const token = useSelector((state) => state.user.profile.token); // Récupère le token utilisateur

  // État local pour le nouveau commentaire saisi par l'utilisateur
  const [newComment, setNewComment] = useState("");

  // Récupération de l'ID du lieu depuis les paramètres de la route
  const { placeId } = route.params || {};
  const BACK_URL = Constants.expoConfig?.extra?.BACK_URL;

  const handleAddComment = async () => {
    // On n'envoie rien si le commentaire est vide ou si aucun lieu n’est ciblé
    if (!newComment.trim() || !placeId) return;

    try {
      // Envoie de la requête POST vers /comments avec les données du commentaire
      const response = await fetch(`${BACK_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: newComment, // Texte du commentaire
          placeId: placeId, // ID du lieu concerné
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.result) {
        setNewComment("");
        alert("Comment added successfully!");
        navigation.navigate("Map"); // Naviguer vers l'écran Map après avoir ajouté le commentaire
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Rendu JSX du composant
  return (
    // Conteneur principal avec un fond blanc
    <View style={styles.container}>
      {/* Permet d'éviter que le clavier masque les éléments sur l'écran */}
      <KeyboardAvoidingView
        style={styles.logContent}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS utilise "padding", Android "height"
      >
        {/* Bouton pour aller à l'écran "Camera" afin de prendre une photo */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Camera")}
          style={styles.takePhotoButton}
        >
          <Text style={styles.takePhotoText}>📸 Prendre une photo</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Ajouter un commentaire"
          value={newComment}
          onChangeText={setNewComment}
          style={styles.commentInput}
        />
        <TouchableOpacity
          onPress={handleAddComment}
          style={styles.addCommentButton}
        >
          <Text style={styles.addCommentText}>Ajouter un commentaire</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

// Définition des styles utilisés plus haut dans le composant
const styles = StyleSheet.create({
  container: {
    flex: 1, // Prend tout l’espace disponible
    backgroundColor: "white",
  },
  logContent: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center", // Centre horizontalement les enfants
    paddingTop: 50,
  },
  takePhotoButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 30,
    // Ombre (effet visuel uniquement visible sur iOS/Android avec elevation)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Ombre sur Android
  },

  takePhotoText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  photoDisplayed: {
    width: 300,
    height: 300,
    resizeMode: "cover", // Recouvre entièrement l’espace sans déformer
    borderRadius: 10,
  },
  commentInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    padding: 8,
    backgroundColor: "white",
    width: "70%",
  },
  addCommentButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  addCommentText: {
    color: "white",
    fontWeight: "bold",
  },
});
