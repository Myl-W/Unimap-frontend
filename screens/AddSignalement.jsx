import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import React from "react";
import { Text, TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";

export default function AddSignalement({ navigation }) {

  const photoUri = useSelector((state) => state.user.value.photo);
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.logContent}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
          <TouchableOpacity onPress={() => navigation.navigate("Camera")} style={styles.takePhotoButton}>
            <Text style={styles.takePhotoText} >📸 Prendre une photo</Text>
          </TouchableOpacity>

          {photoUri && (
            <Image source={{ uri: photoUri }} style={styles.photoDisplayed} />
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
    alignItems: 'center',
    paddingTop: 50, 
  },
  takePhotoButton: {
  backgroundColor: '#f0f0f0',
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 20,
  marginBottom: 30, // ✅ espace sous le bouton
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
  },  

  takePhotoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  photoDisplayed: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
  },
});
