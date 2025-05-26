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
import { useSelector, useDispatch } from "react-redux";

// Import des hooks React
import { useEffect, useState } from "react";

// Import des constantes de l’environnement (via app.json ou app.config.js)
import Constants from "expo-constants";
import { addPhoto } from "../reducers/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Déclaration du composant AddSignalement
export default function AddSignalement({ navigation, route }) {
  // État local pour le nouveau commentaire saisi par l'utilisateur
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.profile.token); // Récupère le token utilisateur
  // État local pour stocker les commentaires (même si ici ils ne sont pas affichés)
  const [comments, setComments] = useState([]);
  const { placeId } = route.params || {};
  const BACK_URL = Constants.expoConfig?.extra?.BACK_URL;

  // Récupération de l'URI de la photo depuis le store Redux (stockée après prise de photo)
  const photoUri = useSelector((state) => state.user.value.photo);

   // -------- Récupère le token utilisateur stocké localement --------
  const getToken = async () => {
    
    try {
      const token = await AsyncStorage.getItem("userToken");
      return token;
    } catch (error) {
      console.error("Erreur lors de la récupération du token :", error);
    }
  };

   useEffect(() => {
    const fetchComments = async () => {
      const token = await getToken();
      if (!token) {
        console.error("Aucun token trouvé");
        return;
      }

      try {
        const response = await fetch(`${BACK_URL}/comments/${placeId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.result && data.comments.length > 0) {
          setComments(data.comments);
          console.log("✅ Commentaires récupérés", data.comments[0]._id);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des commentaires :", error);
      }
    };
    fetchComments();
  }, [placeId]);

   const handleAddComment = async () => {
    if (!newComment.trim() || !placeId) return;
    console.log('placeId', placeId)
    try {
      const response = await fetch(`${BACK_URL}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
         },
        body: JSON.stringify({
          picture: photoUri,
          comment: newComment,
          placeId: placeId,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.result) {
        data.picture && dispatch(addPhoto(data.picture));
        setNewComment('');
        alert('Comment added successfully!');
        navigation.navigate('Map'); // Naviguer vers l'écran Map après avoir ajouté le commentaire
      }
    } catch (error) {
      console.error('Error adding comment:', error);
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

        {/* Si une photo a été prise, elle est affichée ici */}
        {photoUri && (
          <Image source={{ uri: photoUri }} style={styles.photoDisplayed} />
        )}

           <TextInput
            placeholder="Ajouter un commentaire"
            value={newComment}
            onChangeText={setNewComment}
            style={styles.commentInput}
          />
          <TouchableOpacity onPress={handleAddComment} style={styles.addCommentButton}>
            <Text style={styles.addCommentText}>Ajouter un commentaire</Text>
          </TouchableOpacity>
          
           <View style={styles.container}>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <View key={comment._id} style={styles.comment}>
                    <Text>{comment.comment}</Text>
                  </View>
                ))
              ) : (
                <Text>Aucun commentaire trouvé</Text>
              )}
          </View>
          
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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    padding: 8,
    backgroundColor: 'white',
    width: '70%',
  },
  addCommentButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addCommentText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
