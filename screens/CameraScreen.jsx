import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Camera} from "expo-camera";
import { CameraView } from 'expo-camera';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useDispatch } from 'react-redux';
import { addPhoto } from '../reducers/user';
import { FontAwesome } from '@expo/vector-icons';

export default function CameraScreen() {
  const isFocused = useIsFocused();
  console.log('Navigation is active');
  const dispatch = useDispatch();
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');

  useEffect(() => {
    
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      console.log('status', status)
        }
    )
    ();
  }, []
);

  if (!isFocused || !hasPermission) {
    return <View style={{ flex: 1, backgroundColor: "black" }} />;
  }
console.log('hasPermission',hasPermission)

   const toggleCameraFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(prev => (prev === 'off' ? 'on' : 'off'));
  };

  return (
    <CameraView 
    style={{ flex: 1 }}
    type={facing}
    ref={cameraRef}
    flash={flash} 
    >
       <SafeAreaView style={styles.settingContainer}>
          {/* Caméra front/back */}
          <TouchableOpacity style={styles.settingButton} onPress={toggleCameraFacing}>
              <FontAwesome name="rotate-right" size={25} color="white" />
          </TouchableOpacity>

          {/* Flash on/off */}
          <TouchableOpacity
            style={styles.settingButton}
            onPress={toggleFlash}
          >
            <FontAwesome
                name="flash"
                size={25}
                color={flash === 'on' ? '#e8be4b' : 'white'}
            />
          </TouchableOpacity>
    </SafeAreaView>


      <View style={styles.snapContainer}>
        <TouchableOpacity
           onPress={async () => {
            if (cameraRef.current) {
              const photo = await cameraRef.current.takePictureAsync();
              console.log("Photo prise :", photo);
              dispatch(addPhoto(photo.uri));
              navigation.goBack();
            }
          }}
        >
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
});
