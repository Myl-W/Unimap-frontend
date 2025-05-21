import "react-native-reanimated";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
//import polyline from "@mapbox/polyline";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setRouteCoords, userLoc, resetRouteCoords } from "../reducers/trips";

//  --------------  Import des BottomSheets -----------------
import SearchBottomSheet from "../components/bottomSheet/SearchBottomSheet";
import FilterBottomSheet from "../components/bottomSheet/FilterBottomSheet";
import SignalBottomSheet from "../components/bottomSheet/SignalBottomSheet";
import TripBottomSheet from "../components/bottomSheet/TripBottomSheet";

//  ----------  Import des icones FontAwesome ---------------
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function MapScreen() {
  const dispatch = useDispatch();
  const searchSheetRef = useRef(null);
  const filterSheetRef = useRef(null);
  const signalSheetRef = useRef(null);
  const mapRef = useRef(null);

  const [currentPosition, setCurrentPosition] = useState(null);
  const route = useSelector((state) => state.trips.coords?.routeCoords);

  const navigation = useNavigation();

  const handleSheetFilters = useCallback((index) => {}, []);
  const handleSheetSearch = useCallback((index) => {}, []);
  const handleSheetSignal = useCallback((index) => {}, []);
  const [coordinates, setCoordinates] = useState([]);

  // -------- Navigation dans le header ---------------
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        //  ----------  Bouton rechercher ---------------
        <TouchableOpacity
          onPress={() => searchSheetRef.current?.present()}
          style={{ marginRight: 15 }}
        >
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        // -------- Bouton menu drawer  --------------
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ marginLeft: 15 }}
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

  useEffect(() => {
    if (currentPosition) {
      dispatch(userLoc(currentPosition));
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1000
        );
      }
    }
  }, [currentPosition]);

  // -------------  Stop le trajet en cours -------------
  const handleStopTrip = () => {
    dispatch(resetRouteCoords());
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        mapType="normal"
        style={styles.map}
        showsUserLocation
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {route && route.length > 0 && (
          <Polyline coordinates={route} strokeWidth={8} strokeColor="blue" />
        )}

        <View style={styles.buttonFiltre}>
          <TouchableOpacity
            onPress={() => filterSheetRef.current?.present()}
            accessibilityLabel="Sélectionner des filtres"
            accessibilityRole="button"
          >
            <FontAwesome name="sliders" size={24} color="black" />
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
        {/*BottomSheet pour le trajet*/}
        <TripBottomSheet
          isRouteActive={route && route.length > 0}
          onStopTrip={handleStopTrip}
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
    bottom: 30,
    right: 20,
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
    right: 20,
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
