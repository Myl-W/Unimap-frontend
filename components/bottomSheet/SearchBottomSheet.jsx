import React, { forwardRef, useState, useEffect } from "react";
import { TouchableOpacity, View, StyleSheet, TextInput } from "react-native";
import Text from "../../assets/fonts/CustomText";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
//import Constants from "expo-constants";
import { useSelector, useDispatch } from "react-redux";
import polyline from "@mapbox/polyline";

import { setRouteCoords } from "../../reducers/trips";

const SearchBottomSheet = forwardRef(({ handleSheetSearch }, ref) => {
  const transport = useSelector((state) => state.trips.selectedTransport);
  const dispatch = useDispatch();
  const loc = useSelector((state) => state.trips.value);
  const google = process.env.EXPO_PUBLIC_API_GOOGLE;
  const [search, setSearch] = useState("");
  const snapPoints = ["50%", "75%"];

  //  -------- Fonction pour rechercher un itinéraire via l'API Google Directions ------------
  const searchGoogle = () => {
    fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${loc.latitude},${loc.longitude}&destination=${search}&mode=${transport}&key=${google}`
    )
      .then((response) => response.json())
      .then((data) => {
        //  ------------  Récupération de la polyline encodée représentant le tracé complet de la route  ------------------
        const encodedPolyline = data.routes[0].overview_polyline.points;
        //  ----------- Décodage de la polyline en tableau de points [latitude, longitude] --------------
        const decodedPoints = polyline.decode(encodedPolyline);
        //  ----------- Transformation des points en objets {latitude, longitude} compatibles avec la carte  -------------
        const coords = decodedPoints.map((point) => ({
          latitude: point[0],
          longitude: point[1],
        }));
        //  ----------- Mise à jour du réducer avec les coordonnées de la route -------------
        dispatch(setRouteCoords(coords));
        //  ----------- Fermeture de la bottomSheet -------------
        ref?.current?.close();
      });
  };

  // Dès que la valeur de 'transport' change, on lance la fonction de recherche Google
  // uniquement si le champ 'search' n'est pas vide (après suppression des espaces).
  useEffect(() => {
    if (search.trim() !== "") {
      searchGoogle();
    }
  }, [transport]);

  return (
    <BottomSheetModal
      ref={ref}
      onChange={handleSheetSearch}
      snapPoints={snapPoints}
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
          <TouchableOpacity onPress={searchGoogle}>
            <FontAwesome name="search" size={24} color="black" />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une adresse..."
            value={search}
            onChangeText={setSearch}
            onFocus={() => {
              ref.current?.present();
              ref.current?.snapToIndex(2);
            }}
          />

          <TouchableOpacity>
            <FontAwesome name="microphone" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.addressHistory}>
          <Text style={styles.historyTitle}>Adresses consultées :</Text>
          <Text style={styles.historyAdress}>Adresse </Text>
          <Text style={styles.historyAdress}>Adresse </Text>
          <Text style={styles.historyAdress}>Adresse </Text>
          <Text style={styles.historyAdress}>Adresse </Text>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
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
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
});

export default SearchBottomSheet;
