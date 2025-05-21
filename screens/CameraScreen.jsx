import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, SafeAreaView } from "react-native";
import { Camera } from "expo-camera";
import { CameraView } from "expo-camera";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addPhoto } from "../reducers/user";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CameraScreen() {
  const isFocused = useIsFocused();
  console.log("Navigation is active");
  const dispatch = useDispatch();
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");

  const BACK_URL = Constants.expoConfig?.extra?.BACK_URL;

  // ------ Effect hook to check permissions for camera access -------
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      console.log("status", status);
    })();
  }, []);

  // ------- Background color when the camera is not focused or permission is not granted -------
  if (!isFocused || !hasPermission) {
    return <View style={{ flex: 1, backgroundColor: "black" }} />;
  }
  console.log("hasPermission", hasPermission);

  // --------- Functions to toggle camera facing and flash status ----------
  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((prev) => (prev === "off" ? "on" : "off"));
  };

  // ------------- Function to get the token from AsyncStorage -------------
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      return token;
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };

  // ------- Function to take a picture and save it to the reducer store --------
  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({
      quality: 0.3,
    });

    const token = await getToken();
    if (!token) {
      console.error("No token found");
      return;
    }

    const formData = new FormData();
    formData.append("photoFromFront", {
      uri: photo?.uri,
      name: "photo.jpg",
      type: "image/jpeg",
    });
    console.log("formData", formData);

    fetch(`${BACK_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        photo && dispatch(addPhoto(data.url));
        navigation.goBack();
      });
  };

  return (
    <CameraView
      style={styles.camera}
      facing={facing}
      flash={flash}
      ref={cameraRef}
    >
      {/* --------- Top container with the setting buttons ------------ */}
      <SafeAreaView style={styles.settingContainer}>
        {/* Caméra front/back */}
        <TouchableOpacity
          style={styles.settingButton}
          onPress={toggleCameraFacing}
        >
          <FontAwesome name="rotate-right" size={25} color="white" />
        </TouchableOpacity>

        {/* Flash on/off */}
        <TouchableOpacity style={styles.settingButton} onPress={toggleFlash}>
          <FontAwesome
            name="flash"
            size={25}
            color={flash === "on" ? "#e8be4b" : "white"}
          />
        </TouchableOpacity>
      </SafeAreaView>

      {/* --------- Bottom container with the snap button ------------ */}
      <View style={styles.snapContainer}>
        {/* -------------------- Take picture -------------------*/}
        <TouchableOpacity style={styles.snapButton} onPress={takePicture}>
          <FontAwesome name="circle-thin" size={95} color="white" />
        </TouchableOpacity>
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    justifyContent: "space-between",
  },
  settingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },
  settingButton: {
    width: 40,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  snapContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  snapButton: {
    width: 100,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
