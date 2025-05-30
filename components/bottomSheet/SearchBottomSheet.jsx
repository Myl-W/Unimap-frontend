import { forwardRef, useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { FontAwesome } from "@expo/vector-icons";
import polyline from "@mapbox/polyline";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import {
  setRouteCoords,
  setTripInfos,
  recentSearch,
  suppRecentSearch,
} from "../../reducers/trips";
import { addFavorite, deleteFavorite } from "../../reducers/user";
import Constants from "expo-constants";

// forwardRef permet de passer une référence à un composant enfant
const SearchBottomSheet = forwardRef(({ handleSheetSearch }, ref) => {
  // Definie la taille d'ouverture du BottomSheet
  const snapPoints = ["50%", "75%"];

  // Reducers et hooks Redux
  const dispatch = useDispatch();
  const transport = useSelector((state) => state.trips.selectedTransport);
  const loc = useSelector((state) => state.trips.value);
  const searchAddress = useSelector((state) => state.trips.searchAddress);
  const token = useSelector((state) => state.user.profile.token);
  const favorites = useSelector((state) => state.user.value.favorites) || [];
  const lastSearch = useSelector((state) => state.trips?.recentSearch);
  const homeAddress = useSelector((state) => state.user.value.homeAddress);
  const workAddress = useSelector((state) => state.user.value.workAddress);

  // Varibales d'environnement
  const google = process.env.EXPO_PUBLIC_API_GOOGLE;
  const BACK_URL = Constants.expoConfig?.extra?.BACK_URL;

  // State pour la recherche d'adresse
  const [search, setSearch] = useState("");

  const navigation = useNavigation();

  // -------------- Écouter les changements d'adresse de recherche -------------- //
  useEffect(() => {
    if (searchAddress) {
      // Si l'adresse vient des favoris, on utilise l'adresse directement
      const destination =
        typeof searchAddress === "object"
          ? searchAddress.address // Si searchAddress est un objet, on utilise l'adresse de l'objet
          : searchAddress; // Sinon, on utilise la valeur de searchAddress directement
      setSearch(destination);
      searchGoogle(
        destination,
        typeof searchAddress === "object" && searchAddress.fromFavorites // Si searchAddress est un objet, et on vérifie si ça vient des favoris
      );
    }
  }, [searchAddress]);

  // ---------- Effet pour mettre à jour l'état des favoris dans les recherches récentes ---------- //
  useEffect(() => {
    if (lastSearch && lastSearch.length > 0) {
      lastSearch.forEach((item) => {
        // Parcourt chaque élément du tableau lastSearch
        isAddressInFavorites(item.arrival); // Vérifie si l'adresse est un favori
      });
    }
  }, [favorites, lastSearch]);

  // ------------- Si la valeur transport change, on lance la fonction de recherche Google ------------- //
  // uniquement si le champ 'search' n'est pas vide (après suppression des espaces).
  useEffect(() => {
    if (search.trim() !== "") {
      searchGoogle(search);
    }
  }, [transport]);

  // ------------------ Vérifie si une adresse est dans les favoris ------------------ //
  const isAddressInFavorites = (address) => {
    if (!address) return false;
    const normalizedSearchAddress = address.trim().toLowerCase(); // Normalise l'adresse de recherche pour la comparaison
    return favorites.some(
      (fav) => fav.address.trim().toLowerCase() === normalizedSearchAddress // Vérifie si l'adresse est dans les favoris
    );
  };

  // ------------- Trouve le favori par son adresse ------------- //
  const findFavoriteByAddress = (address) => {
    return favorites.find((fav) => fav.address === address);
  };

  // ------------- Trouve le prochain numéro disponible pour les favoris (identifier chaque favori) ------------- //
  const getNextFavoriteNumber = () => {
    const favoriteNumbers = favorites
      .map((fav) => {
        const match = fav.name.match(/^Favori (\d+)$/); // Extrait le numéro de favori
        return match ? parseInt(match[1]) : 0; // Retourne le numéro de favori ou 0 si aucun numéro n'est trouvé
      })
      .filter((num) => !isNaN(num)); // Filtre les numéros valides

    if (favoriteNumbers.length === 0) return 1; // Si aucun numéro de favori n'est trouvé, retourne 1
    return Math.max(...favoriteNumbers) + 1; // Retourne le numéro de favori le plus élevé + 1
  };

  // --------------- Fonction pour ajouter ou supprimer des favoris --------------- //
  const toggleFavorite = async (address) => {
    const isFavorite = isAddressInFavorites(address); // Vérifie si l'adresse est déjà un favori
    if (isFavorite) {
      // Si c'est déjà un favori, on le supprime
      const favorite = findFavoriteByAddress(address);
      if (!favorite) {
        return;
      }

      try {
        const response = await fetch(`${BACK_URL}/favorites/${favorite._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.result) {
          dispatch(deleteFavorite(favorite._id)); // Supprime le favori du store Redux
          // Mettre à jour la recherche récente
          if (lastSearch) {
            const updatedSearch = lastSearch.map(
              (item) =>
                item.arrival === address ? { ...item, isFavorite: false } : item // Met à jour le tableau des recherches récentes pour indiquer que l'adresse n'est plus un favori
            );
            dispatch(suppRecentSearch(updatedSearch)); // Met à jour le store Redux avec le tableau modifié
          }
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du favori:", error);
      }
    } else {
      // Si ce n'est pas un favori, on l'ajoute
      try {
        const nextNumber = getNextFavoriteNumber(); // Récupère le prochain numéro de favori
        const response = await fetch(`${BACK_URL}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: `Favori ${nextNumber}`,
            address: address,
          }),
        });

        const data = await response.json();

        if (data.result) {
          dispatch(addFavorite(data.favorite)); // Ajoute le favori au store Redux
          // Mettre à jour la recherche récente
          if (lastSearch) {
            const updatedSearch = lastSearch.map((item) =>
              item.arrival === address ? { ...item, isFavorite: true } : item
            );
            dispatch(suppRecentSearch(updatedSearch));
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout aux favoris:", error);
      }
    }
  };

  // -------------------- Fonction qui affiche les recherches récentes dans le bottom sheet ------------------- //
  const renderRecentSearch = () => {
    // "?." est utilisé pour verifié si lastSearch n'est pas undefined ou null
    return lastSearch
      ?.slice() // Crée une copie du tableau lastSearch pour éviter de le modifier directement
      .reverse() // inverse le tableau pour afficher les recherches les plus récentes en premier
      .map((item, index) => (
        <View key={index} style={styles.historyAdress}>
          <View style={styles.historyLign}>
            <FontAwesome name="clock-o" size={24} color="black" />
            <TouchableOpacity onPress={() => toggleFavorite(item.arrival)}>
              <FontAwesome
                name="heart"
                size={22}
                color={isAddressInFavorites(item.arrival) ? "#e74c3c" : "black"}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={styles.addressHistory}
              onPress={() => searchGoogle(item.arrival)}
            >
              {item.arrival}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(lastSearch.length - 1 - index)}
          >
            <FontAwesome
              name="trash"
              size={24}
              color="black"
              style={styles.iconDelete}
            />
          </TouchableOpacity>
        </View>
      ));
  };

  //  ----------------- Fonction pour rechercher un itinéraire via l'API Google Directions ------------ //
  const searchGoogle = (destination, fromFavorites = false) => {
    fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${loc.latitude},${loc.longitude}&destination=${destination}&mode=${transport}&key=${google}`
    )
      .then((response) => response.json())
      .then((data) => {
        // ------------- Adresse réelle d'arriver obtenue depuis l'API Google --------------
        const arrival = data.routes[0].legs[0].end_address;
        // ------------- Enregistrement dans l'historique des recherches -------------------
        const searchRecent = {
          arrival: arrival,
          isFavorite: fromFavorites || isAddressInFavorites(arrival),
        };

        dispatch(recentSearch(searchRecent));

        // ------------- Récupération de la polyline pour pouvoir tracer le trajet -------------------
        const encodedPolyline = data.routes[0].overview_polyline.points;
        // ------------- Décodage de la polyligne -------------------
        const decodedPoints = polyline.decode(encodedPolyline);
        // ------------- Conversion des points décodés en coordonnées latitude/longitude ------
        // ------------- et stockage dans un tableau d'objets -------------------
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
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération de la route :", error);
      });
  };

  //  ------------ Fonction pour lancer la recherche d'adresse à partir des boutons Domicile et Travail ------------ //
  const handleHomePress = () => {
    if (homeAddress && homeAddress.length > 0) {
      setSearch(homeAddress);
      searchGoogle(homeAddress);
    } else {
      // Redirige vers l'écran de configuration de l'adresse domicile
      navigation.navigate("HomeWorkScreen");
    }
  };
  const handleWorkAdressPress = () => {
    if (workAddress && workAddress.length > 0) {
      setSearch(workAddress);
      searchGoogle(workAddress);
    } else {
      // Redirige vers l'écran de configuration de l'adresse travail
      navigation.navigate("HomeWorkScreen");
    }
  };

  // ------------- Fonction pour supprimer une recherche récente -------------
  const handleDelete = (index) => {
    const updatedSearch = [...lastSearch];
    // Supprime l'élément à l'index spécifié
    updatedSearch.splice(index, 1);
    // Met à jour le store Redux avec le tableau modifié
    dispatch(suppRecentSearch(updatedSearch));
  };

  return (
    <BottomSheetModal
      ref={ref}
      onChange={handleSheetSearch}
      snapPoints={snapPoints}
      enableDismissOnClose={true}
      backdropComponent={(backdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps} // Permet de faire apparaitre le fond sombre
          appearsOnIndex={0} // Rend le fond sombre visible
          disappearsOnIndex={-1} // Rend le fond sombre invisible
          opacity={0.3} // Opacité du fond sombre
          pressBehavior="close"
        />
      )}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleHomePress}
          >
            <View style={styles.optionButtonContent}>
              <FontAwesome name="home" size={24} color="black" />
              <Text style={styles.optionButtonText}>Domicile</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleWorkAdressPress}
          >
            <View style={styles.optionButtonContent}>
              <FontAwesome name="briefcase" size={24} color="black" />
              <Text style={styles.optionButtonText}>Travail</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.searchInputContainer}>
          <TouchableOpacity onPress={() => searchGoogle(search)}>
            <FontAwesome name="search" size={24} color="black" />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une adresse..."
            value={search}
            onChangeText={setSearch}
            onFocus={() => {
              ref.current?.present(); // Ouvre le bottom sheet
              ref.current?.snapToIndex(2); // Ouvre le bottom sheet à sa taille maximale définie par snapPoints 75 %
              setSearch("");
            }}
          />

          <TouchableOpacity>
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
    minHeight: 110,
    justifyContent: "space-between",
  },
  historyLign: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconDelete: {
    position: "absolute",
    bottom: 2,
    right: 2,
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
