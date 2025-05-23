import { KeyboardAvoidingView, Platform, StyleSheet, View, TextInput } from "react-native";
import React from "react";
import { Text, TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import Constants from "expo-constants";

export default function AddSignalement({ navigation, route }) {
  
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const placeId = route.params?.id;
  console.log('placeId',placeId)
  const backUrl = Constants.expoConfig?.extra?.BACK_URL;
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

           <TextInput
              placeholder="Ajouter un commentaire"
              value={newComment}
              onChangeText={setNewComment}
              style={{
                borderColor: '#ccc',
                borderWidth: 1,
                borderRadius: 5,
                marginTop: 10,
                padding: 8,
                backgroundColor: 'white',
                width: '70%',
              }}
          />
          <TouchableOpacity
            onPress={async () => {
              if (!newComment.trim()) return;

              const response = await fetch(`${backUrl}/comments`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  picture: photoUri,
                                  comment: newComment,
                                  placeId: placeId
                                }),
                              });

              const data = await response.json();
              if (data.result) {
                setComments(prev => [...prev, data.comment]); // Mise à jour immédiate
                setNewComment('');
              }
            }}
            style={{
              backgroundColor: '#4CAF50',
              padding: 10,
              marginTop: 10,
              borderRadius: 5,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Ajouter un commentaire</Text>
          </TouchableOpacity>

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
