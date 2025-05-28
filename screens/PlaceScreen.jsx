import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useIsFocused } from "@react-navigation/native";

export default function PlaceScreen({ route }) {
  const isFocused = useIsFocused();
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [picture, setPicture] = useState(null); // Photo du lieu
  const [placeId, setPlaceId] = useState(null); // ID du lieu

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

  // On récupère la photo associée au lieu via l’ID
  useEffect(() => {
    // if (isFocused) {
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

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.logContent}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.title}>Commentaires du lieu</Text>

        {/* Affichage de la photo si elle est disponible */}
        {picture && (
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

        {/* Affichage des commentaires */}
        {commentList.length > 0 ? (
          commentList.map((comment) => (
            <View key={comment._id}>
              <Text style={{ fontWeight: "bold" }}>
                {comment.userId.firstname} {comment.userId.lastname?.charAt(0)}.
              </Text>
              <Text style={styles.comment}>{comment.comment}</Text>
            </View>
          ))
        ) : (
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
  commentInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
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
