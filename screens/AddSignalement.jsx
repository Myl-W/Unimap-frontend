import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function AddSignalement({ navigation, route }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const placeId = route.params?.id;
  const photoUri = useSelector((state) => state.user.value.photo);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.logContent}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
          <Text>📸 Prendre une photo</Text>
        </TouchableOpacity>

        {photoUri && (
          <Image
            source={{ uri: photoUri }}
            style={{ width: 200, height: 200 }}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  logContent: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  takePhotoButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  takePhotoText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  photoDisplayed: {
    width: 300,
    height: 300,
    resizeMode: "cover",
    borderRadius: 10,
  },
});
