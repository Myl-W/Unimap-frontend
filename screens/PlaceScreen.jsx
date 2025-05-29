import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Picture from "../components/modals/picture";

export default function PlaceScreen({ route }) {
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [picture, setPicture] = useState(null); // Photo du lieu
  const [placeId, setPlaceId] = useState(null); // ID du lieu
  const [showModal, setShowModal] = useState(false);

  const BACK_URL = Constants.expoConfig?.extra?.BACK_URL;
  const token = useSelector((state) => state.user.profile.token);

  // On récupère les paramètres passés à la navigation (s'ils existent)
  const { id, comments } = route.params || {};

  // On enregistre l'ID du lieu dans le state dès qu'on le reçoit
  useEffect(() => {
    if (route.params?.id) {
      setPlaceId(route.params.id);
    }
  }, [route.params]);

  // On initialise la liste des commentaires si elle est transmise
  useEffect(() => {
    if (comments) {
      setCommentList(comments);
    }
  }, [comments]);
  console.log(comments);

  // On récupère la photo associée au lieu via l’ID
  useEffect(() => {
    console.log("route id", route.params.id);
    if (!placeId) return;

    fetch(`${BACK_URL}/place/${placeId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setPicture(data.place.picture);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération de la photo :", error);
      });
    // }
  }, [placeId]);

  // Ajouter un commentaire
  const handleAddComment = async () => {
    if (!newComment.trim() || !placeId) return;

    try {
      const response = await fetch(`${BACK_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: newComment,
          placeId: placeId,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.result) {
        setNewComment("");
        setCommentList((newComments) => [...newComments, data.comment]); // Ajoute le nouveau commentaire à la liste
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Fonction utilitaire qui calcule combien de temps s'est écoulé depuis une date donnée
  const timeSince = (date) => {
    // On calcule le nombre total de secondes entre maintenant et la date
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    // Tableau définissant les intervalles de temps avec leur libellé et leur durée en secondes
    const intervals = [
      { label: "an", seconds: 31536000 }, // 1 an = 365 * 24 * 60 * 60
      { label: "mois", seconds: 2592000 }, // ~30 jours
      { label: "jour", seconds: 86400 }, // 1 jour
      { label: "heure", seconds: 3600 }, // 1 heure
      { label: "minute", seconds: 60 }, // 1 minute
      { label: "seconde", seconds: 1 }, // 1 seconde
    ];

    // Boucle sur chaque intervalle, du plus grand au plus petit
    for (let i = 0; i < intervals.length; i++) {
      // On divise le nombre total de secondes par l'intervalle actuel pour obtenir le nombre d'unités écoulées
      const interval = Math.floor(seconds / intervals[i].seconds);
      // Dès qu'on trouve un intervalle où au moins une unité s'est écoulée, on retourne le texte
      if (interval >= 1) {
        return `il y a ${interval} ${
          interval > 1 ? intervals[i].label + "s" : intervals[i].label
        }`;
      }
    }
    // Si moins d'une seconde s'est écoulée, on affiche "à l'instant"
    return "à l'instant";
  };

  // ------ Fonction pour afficher / fermer la modal ------
  const handlePressModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  console.log("commentList", commentList);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.logContent}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.title}>Commentaires</Text>

        {/* Affichage de la photo si elle est disponible */}
        {picture && (
          <TouchableOpacity onPress={handlePressModal} activeOpacity={0.8}>
            <Image
              source={{ uri: picture }}
              style={{
                width: 300,
                height: 300,
                borderRadius: 20,
                marginBottom: 20,
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

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
        <ScrollView style={{ marginTop: 10, width: "100%" }}>
          {/* Affichage des commentaires */}
          {commentList.length > 0 ? (
            commentList.map((comment) => (
              <View key={comment._id} style={styles.comment}>
                <View style={styles.commentHeader}>
                  <Text style={styles.author}>
                    {comment.userId.firstname}
                    {comment.userId.lastname?.charAt(0)}.
                  </Text>
                  <Text style={styles.timeAgo}>
                    {timeSince(comment.createdAt)}
                  </Text>
                </View>
                <Text style={styles.commentText}>{comment.comment}</Text>
              </View>
            ))
          ) : (
            <Text style={{ fontSize: 16, textAlign: "center", marginTop: 10 }}>
              Aucun commentaire pour ce lieu.
            </Text>
          )}
        </ScrollView>
        {/* --------- Modal pour l'affichage de l'image en grand  -------- */}
        <Picture
          visible={showModal}
          onClose={handleCloseModal}
          picture={picture}
        />
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
    fontSize: 24,
    fontWeight: "550",
    color: "black",
    textShadowColor: "grey",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 10,
    marginTop: 10,
  },
  comment: {
    width: "80%",
    alignSelf: "center",
    fontSize: 20,
    margin: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
  },
  commentInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    backgroundColor: "white",
    width: "80%",
  },
  addCommentButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "80%",
  },
  addCommentText: {
    color: "white",
    fontWeight: "bold",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  author: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  timeAgo: {
    fontSize: 12,
    color: "gray",
  },
  commentText: {
    fontSize: 16,
    color: "#000",
  },
});
