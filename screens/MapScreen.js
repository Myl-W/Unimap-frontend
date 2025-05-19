import "react-native-reanimated";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

//  --------------  Import des BottomSheets -----------------
import SearchBottomSheet from "./bottomSheet/SearchBottomSheet";
import FilterBottomSheet from "./bottomSheet/FilterBottomSheet";
import SignalBottomSheet from "./bottomSheet/SignalBottomSheet";

//  ----------  Import des icones FontAwesome ---------------
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function MapScreen() {
  const searchSheetRef = useRef(null);
  const filterSheetRef = useRef(null);
  const signalSheetRef = useRef(null);

  const [currentPosition, setCurrentPosition] = useState(null);
  const navigation = useNavigation();

  const handleSheetFilters = useCallback((index) => {}, []);
  const handleSheetSearch = useCallback((index) => {}, []);
  const handleSheetSignal = useCallback((index) => {}, []);

  // -------- Navigation dans le header ---------------
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        //  ----------  Bouton rechercher ---------------
        <TouchableOpacity
          onPress={() => searchSheetRef.current?.present()}
          style={{ marginLeft: 15 }}
        >
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        // -------- Bouton menu drawer  --------------
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ marginRight: 15 }}
        >
          <FontAwesome name="bars" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // -------------  Permission de la geolocalisation  --------------
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
          <TouchableOpacity
            onPress={() => filterSheetRef.current?.present()}
            accessibilityLabel="Sélectionner des filtres"
            accessibilityRole="button"
          >
            <FontAwesome name="filter" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonSignalement}>
          <TouchableOpacity
            onPress={() => signalSheetRef.current?.present()}
            accessibilityLabel="Effectuer un signalement"
            accessibilityRole="button"
          >
            <Image
              style={styles.iconSignalement}
              accessibilityLabel="Effectuer un signalement"
              accessibilityRole="Image"
              source={require("../assets/icon/alert.png")}
            />
          </TouchableOpacity>
        </View>
      </MapView>

      <BottomSheetModalProvider>
        {/*BottomSheet pour la recherche*/}
        <SearchBottomSheet
          ref={searchSheetRef}
          handleSheetSearch={handleSheetSearch}
        />

        {/*BottomSheet pour les filtres*/}
        <FilterBottomSheet
          ref={filterSheetRef}
          handleSheetFilters={handleSheetFilters}
        />

        {/*BottomSheet pour le signalement*/}
        <SignalBottomSheet
          ref={signalSheetRef}
          handleSheetSearch={handleSheetSignal}
        />
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

  resultItem: {
    paddingVertical: 8,
    fontSize: 16,
  },

  //---------------- Bouton Signalement et filtres  -----------------
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

    // -----  shadow iOS  -----
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 5.84,

    // -----  shadow Android  -----
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

  //  -------- CheckBox des filtres -----------

  checkBoxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 20,
  },

  checkBoxItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    maxWidth: 160,
  },
  textCheckbox: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "Kanit",
  },
});
