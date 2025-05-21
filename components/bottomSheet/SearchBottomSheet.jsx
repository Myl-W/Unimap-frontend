import React, { forwardRef, useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import Text from "../../assets/fonts/CustomText";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
//import Constants from "expo-constants";
import { useSelector, useDispatch } from "react-redux";
import polyline from "@mapbox/polyline";

import {
  setRouteCoords,
  setTripInfos,
  recentSearch,
  suppRecentSearch,
} from "../../reducers/trips";

const SearchBottomSheet = forwardRef(({ handleSheetSearch }, ref) => {
  const transport = useSelector((state) => state.trips.selectedTransport);
  const dispatch = useDispatch();
  const loc = useSelector((state) => state.trips.value);
  const google = process.env.EXPO_PUBLIC_API_GOOGLE;
  const [search, setSearch] = useState("");
  const snapPoints = ["50%", "75%"];
  const lastSearch = useSelector((state) => state.trips?.recentSearch);

  //  -------- Fonction pour rechercher un itinéraire via l'API Google Directions ------------
  const searchGoogle = () => {
    fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${loc.latitude},${loc.longitude}&destination=${search}&mode=${transport}&key=${google}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // ------------- Adresse réelle de départ obtenue depuis l'API Google --------------
        const arrival = data.routes[0].legs[0].end_address;
        // ------------- Enregistrement dans l'historique des recherches -------------------
        const searchRecent = {
          arrival: arrival,
        };
        dispatch(recentSearch(searchRecent));

        // ------------- Récupération et décodage de la route -------------------
        const encodedPolyline = data.routes[0].overview_polyline.points;
        const decodedPoints = polyline.decode(encodedPolyline);
        const coords = decodedPoints.map((point) => ({
          latitude: point[0],
          longitude: point[1],
        }));
        //  ----------- Affiche la durée du trajet et le nombre de km  -------------
        const tripTime = {
          duration: data.routes[0].legs[0].duration.text,
          distance: data.routes[0].legs[0].distance.text,
        };
        //  ----------- Mise à jour du réducer de la distance du trajet en heure/minutes et en km -------------
        dispatch(setTripInfos(tripTime));
        //  ----------- Mise à jour du réducer avec les coordonnées de la route -------------
        dispatch(setRouteCoords(coords));
        ref?.current?.close();
        // Si le parent a donné une fonction onTripReady, on l’exécute pour lui dire que le trajet est prêt (pour ouvrir la bottom sheet du trajet)
        if (props.onTripReady) props.onTripReady();

        // ------------- Fermeture de la bottomSheet --------------------------
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération de la route :", error);
      });
  };

  // Si une des valeurs change, on lance la fonction de recherche Google
  // uniquement si le champ 'search' n'est pas vide (après suppression des espaces).
  useEffect(() => {
    if (search.trim() !== "") {
      searchGoogle();
    }
  }, [transport]);

  // fonction pour mapper le tableau afin d'afficher les elements dans le bottomSheet
  const renderRecentSearch = () => {
    return lastSearch?.map((item, index) => (
      <View key={index} style={styles.historyAdress}>
        <View style={styles.historyLign}>
          <FontAwesome name="clock-o" size={24} color="black" />
          <FontAwesome name="heart" size={24} color="black" />
        </View>
        <View>
          <Text style={styles.addressHistory}>{item.arrival}</Text>
        </View>
        <FontAwesome
          name="trash"
          size={24}
          color="black"
          style={styles.iconDelete}
        />
      </View>
    ));
  };

  const suppRecent = () => {
    dispatch(suppRecentSearch());
  };

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
              setSearch("");
            }}
          />

          <TouchableOpacity onPress={suppRecent}>
            <FontAwesome name="microphone" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.addressHistoryContent}>
          <View style={styles.scrollContent}>
            <Text style={styles.historyTitle}>Adresses consultées :</Text>
            {renderRecentSearch()}
          </View>
        </ScrollView>
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
  addressHistoryContent: {
    marginTop: 8,
    width: "100%",
    maxHeight: 500,
  },

  historyTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  historyAdress: {
    fontSize: 18,
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    position: "relative",
    width: "100%",
  },
  historyLign: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconDelete: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  addressHistory: {
    fontSize: 20,
    width: "100%",
  },
  scrollContent: {
    alignItems: "center",
    width: "100%",
  },
});

export default SearchBottomSheet;
