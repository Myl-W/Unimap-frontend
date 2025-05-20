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
          <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
            <Text>📸 Prendre une photo</Text>
          </TouchableOpacity>

          {photoUri && (
            <Image source={{ uri: photoUri }} style={{ width: 200, height: 200 }} />
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
  },
});
