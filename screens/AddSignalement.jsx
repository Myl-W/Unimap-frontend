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
import { useEffect, useState } from "react";

// Import des constantes de l’environnement (via app.json ou app.config.js)
import Constants from "expo-constants";

// Déclaration du composant AddSignalement
export default function AddSignalement({ navigation, route }) {
  // État local pour le nouveau commentaire saisi par l'utilisateur
  const [newComment, setNewComment] = useState("");

  // État local pour stocker les commentaires (même si ici ils ne sont pas affichés)
  const [comments, setComments] = useState([]);

  // Récupération de l'identifiant de l'endroit signalé (transmis via navigation)
  const placeId = route.params?.id;

  // Affichage en console de l'ID pour debug
  console.log("placeId", placeId);

  // Récupération de l'URL du backend définie dans les constantes d'Expo
  const backUrl = Constants.expoConfig?.extra?.BACK_URL;

  // Récupération de l'URI de la photo depuis le store Redux (stockée après prise de photo)
  const photoUri = useSelector((state) => state.user.value.photo);

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

        {/* Si une photo a été prise, elle est affichée ici */}
        {photoUri && (
          <Image source={{ uri: photoUri }} style={styles.photoDisplayed} />
        )}

        {/* Champ de saisie pour le commentaire */}
        <TextInput
          placeholder="Ajouter un commentaire" // Texte par défaut quand vide
          value={newComment} // Valeur liée à l’état local
          onChangeText={setNewComment} // Mise à jour de l’état à chaque saisie
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 5,
            marginTop: 10,
            padding: 8,
            backgroundColor: "white",
            width: "70%",
          }}
        />

        {/* Bouton pour envoyer le commentaire */}
        <TouchableOpacity
          onPress={async () => {
            // Ne rien faire si le champ commentaire est vide ou contient juste des espaces
            if (!newComment.trim()) return;

            // Envoi de la requête POST au backend avec photo, commentaire et placeId
            const response = await fetch(`${backUrl}/comments`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                picture: photoUri,
                comment: newComment,
                placeId: placeId,
              }),
            });

            // Réponse JSON du serveur
            const data = await response.json();

            // Si le serveur renvoie un résultat valide
            if (data.result) {
              // On ajoute le commentaire reçu à la liste (non visible ici)
              setComments((prev) => [...prev, data.comment]);
              // Réinitialise le champ de saisie
              setNewComment("");
            }
          }}
          style={{
            backgroundColor: "#4CAF50",
            padding: 10,
            marginTop: 10,
            borderRadius: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Ajouter un commentaire
          </Text>
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
});
