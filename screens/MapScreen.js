import "react-native-reanimated";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

export default function MapScreen() {
  const bottomSheetModalRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const navigation = useNavigation();

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {}, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={handlePresentModalPress}
          style={{ marginLeft: 15 }}
        >
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ marginRight: 15 }}
        >
          <FontAwesome name="bars" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let location = await Location.getCurrentPositionAsync({});
      setCurrentPosition(location.coords);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        mapType="normal"
        style={styles.map}
        showsUserLocation
        initialRegion={{
          latitude: currentPosition?.latitude || 48.8566,
          longitude: currentPosition?.longitude || 2.3522,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {currentPosition && (
          <Marker
            coordinate={currentPosition}
            title="Ma position"
            pinColor="#fecb2d"
          />
        )}
        <View style={styles.buttonFiltre}>
          <TouchableOpacity>
            <FontAwesome name="filter" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonSignalement}>
          <TouchableOpacity>
            <Image
              style={styles.iconSignalement}
              source={require("../assets/icon/alert.png")}
            />
          </TouchableOpacity>
        </View>
      </MapView>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
          snapPoints={["50%", "75%"]}
        >
          <BottomSheetView style={styles.contentContainer}>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.optionButton}>
                <View style={styles.optionButtonContent}>
                  <FontAwesome name="home" size={24} color="black" />
                  <Text style={styles.optionButtonText}>Domicile</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton}>
                <View style={styles.optionButtonContent}>
                  <FontAwesome name="briefcase" size={24} color="black" />
                  <Text style={styles.optionButtonText}>Travail</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.searchInputContainer}>
              <TouchableOpacity>
                <FontAwesome name="search" size={24} color="black" />
              </TouchableOpacity>

              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher une adresse..."
                value={search}
                onChangeText={setSearch}
                onFocus={() => {
                  bottomSheetModalRef.current?.present();
                  bottomSheetModalRef.current?.snapToIndex(2);
                }}
              />
              <TouchableOpacity>
                <FontAwesome name="microphone" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.addressHistory}>
              <Text style={styles.historyTitle}>Adresses consultées :</Text>

              <Text style={styles.historyAdress}>Adresse</Text>
              <Text style={styles.historyAdress}>Adresse</Text>
              <Text style={styles.historyAdress}>Adresse</Text>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetContent: {
    padding: 16,
  },
  searchInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  resultItem: {
    paddingVertical: 8,
    fontSize: 16,
  },
  /////////// styles BottomSheet recherche /////////////
  contentContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  optionButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 20,
  },
  optionButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 50,
    width: "70%",
  },
  addressHistory: {
    marginTop: 8,
    alignItems: "center",
  },
  historyTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyAdress: {
    fontSize: 16,
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    width: "90%",
  },

  /////////// Bouton Signalement et filtres///////////////
  buttonSignalement: {
    position: "absolute",
    bottom: 60,
    right: 60,
    width: 80,
    height: 80,
    backgroundColor: "#ffb71e",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#e0e0e0",

    // shadow iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 5.84,

    // shadow Android
    elevation: 5,
  },
  iconSignalement: {
    width: 50,
    height: 50,
    marginTop: -5,
  },
  buttonFiltre: {
    position: "absolute",
    top: 20,
    right: 40,
    width: 50,
    height: 30,
    backgroundColor: "#DFF0FF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
  },
});
