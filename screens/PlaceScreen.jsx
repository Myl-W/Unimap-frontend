import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  Image,
} from "react-native";
import Constants from "expo-constants";
// Hooks de React pour gérer l’état, les effets et les références
import { useEffect, useState } from "react";

// Hooks pour accéder à Redux (store global)
import { useSelector } from "react-redux";

export default function PlaceScreen({ route }) {
  const [picture, setPicture] = useState(null); // État pour stocker la photo du lieu

  // Adresse backend récupérée depuis les variables d’environnement (app.config.json)
  const BACK_URL = Constants.expoConfig?.extra?.BACK_URL;

  const token = useSelector((state) => state.user.profile.token); // Récupère le token utilisateur

  // On récupère les paramètres passés à cet écran via la navigation
  // route.params contient les données envoyées, ici on attend un tableau comments
  const { id, comments } = route.params || {};

  // Si aucun tableau comments n’est reçu (ex: encore en chargement), on affiche un message d’attente
  if (!comments) {
    return (
      <View style={styles.container}>
        <Text>Chargement des commentaires...</Text>
      </View>
    );
  }

  console.log("id", id);

  useEffect(() => {
    fetch(`${BACK_URL}/place/${route.params.id}`, {
      method: "GET",
      headers: {
        // On envoie un header d'autorisation avec le token JWT
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Condition pour vérifier que la récupération est réussie :
        // - data.result est vrai (succès)

        if (data.result) {
          const picture = data.place.picture; // On récupère la photo du lieu
          setPicture(picture); // On met à jour l'état avec la photo
        } else {
          // Si aucune photo n'a été trouvé
          console.log("Aucune photo trouvé pour ce lieu");
        }
      })
      .catch((error) => {
        // En cas d'erreur réseau ou autre, on affiche dans la console
        console.error("Erreur lors de la récupération de la photo :", error);
      });
  }, [route.params]);

  return (
    // Conteneur principal de l’écran
    <View style={styles.container}>
      {/* KeyboardAvoidingView : évite que le clavier masque le contenu (utile pour les champs à saisir) */}
      {/* Le comportement change selon la plateforme (padding sur iOS, height sur Android) */}
      <KeyboardAvoidingView
        style={styles.logContent}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Titre affiché en haut de la liste */}
        <Text style={styles.title}>Commentaires du lieu</Text>
        <Image
          source={{ uri: picture }}
          style={{
            width: 250,
            height: 250,
            borderRadius: 20,
            marginBottom: 20,
          }}
          resizeMode="cover"
        />

        {/* Si la liste comments contient au moins un élément */}
        {comments.length > 0 ? (
          // On parcourt le tableau comments avec map pour afficher chaque commentaire
          comments.map((comment) => {
            return (
              <View key={comment._id}>
                <Text style={styles.comment}>{comment.comment}</Text>
              </View>
            );
          })
        ) : (
          // Si le tableau comments est vide, on affiche un message indiquant qu'il n'y a pas de commentaire
          <Text>Aucun commentaire pour ce lieu.</Text>
        )}
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
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
    height: "100%",
    borderRadius: 20,
  },
  title: {
    width: "100%",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "550",
    color: "black",
    textShadowColor: "grey",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 20,
    marginTop: 20,
  },
  comment: {
    width: "90%",
    textAlign: "center",
    fontSize: 16,
    margin: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
  },
});
