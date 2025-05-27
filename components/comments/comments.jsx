import Constants from "expo-constants";

const BACK_URL = Constants.expoConfig?.extra?.BACK_URL;

// Fonction exportée upComments qui récupère les commentaires d'un lieu depuis le backend
export const upComments = (key, token, navigation) => {
  // On fait une requête GET à l'URL backend + endpoint /comments/{key}
  fetch(`${BACK_URL}/comments/${key}`, {
    method: "GET", // méthode HTTP GET pour récupérer des données
    headers: {
      // On envoie un header d'autorisation avec le token JWT
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json()) // On parse la réponse JSON
    .then((data) => {
      // Condition pour vérifier que la récupération est réussie :
      // - data.result est vrai (succès)
      // - data.comments est bien un tableau
      // - le tableau contient au moins un commentaire
      if (
        data.result &&
        Array.isArray(data.comments) &&
        data.comments.length > 0
      ) {
        // On navigue vers l'écran PlaceScreen
        // Avec en params l'id du lieu (key) et la liste des commentaires
        navigation.navigate("PlaceScreen", {
          id: key,
          comments: data.comments,
        });
      } else {
        // Si aucun commentaire n'a été trouvé ou autre cas
        console.log("Aucun commentaire trouvé pour ce lieu");
        // On navigue quand même vers PlaceScreen avec un tableau vide pour comments
        navigation.navigate("PlaceScreen", { comments: [] });
      }
    })
    .catch((error) => {
      // En cas d'erreur réseau ou autre, on affiche dans la console
      console.error("Erreur lors de la récupération des commentaires :", error);
    });
};
