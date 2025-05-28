//* ----------Import des librairies-----------------------

// Import de la librairie nécessaire pour les animations avec Reanimated
import "react-native-reanimated";

// Fournit un contexte pour afficher des BottomSheets (panneaux glissants)
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

// Hooks de React pour gérer l’état, les effets et les références
import { useRef, useState, useEffect } from "react";

// Composants de base React Native
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";

// Carte interactive avec possibilité de tracer des lignes (routes)
import MapView, { Polyline, Marker, Callout } from "react-native-maps";

// Librairie Expo pour accéder à la géolocalisation
import * as Location from "expo-location";

// Hook pour interagir avec la navigation
import { useIsFocused, useNavigation } from "@react-navigation/native";

// Hooks pour accéder à Redux (store global)
import { useDispatch, useSelector } from "react-redux";

// Actions Redux : enregistrer la position utilisateur et réinitialiser le trajet
import { userLoc, resetRouteCoords } from "../reducers/trips";

import { setHomeAddress, setWorkAddress } from "../reducers/user";

// Import
import Constants from "expo-constants";
import { upComments } from "../components/comments/comments";

//* Import des composants BottomSheet personnalisés
import SearchBottomSheet from "../components/bottomSheet/SearchBottomSheet";
import FilterBottomSheet from "../components/bottomSheet/FilterBottomSheet";
import SignalBottomSheet from "../components/bottomSheet/SignalBottomSheet";
import TripBottomSheet from "../components/bottomSheet/TripBottomSheet";
//* Import des icônes FontAwesome
import FontAwesome from "react-native-vector-icons/FontAwesome";

//* Déclaration du composant principal de l'écran de carte
export default function MapScreen() {
  // Vérifie si l'écran est actuellement visible
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  // Permet de déclencher des actions Redux
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.profile.token); // Récupère le token utilisateur

  // Adresse backend récupérée depuis les variables d’environnement (app.config.json)
  const BACK_URL = Constants.expoConfig?.extra?.BACK_URL;

  // Références vers les différents BottomSheets (permet d’ouvrir/fermer ces panneaux)
  const searchSheetRef = useRef(null);
  const filterSheetRef = useRef(null);
  const signalSheetRef = useRef(null);

  // Référence vers la carte, utilisée pour manipuler l'affichage (zoom, centrage, etc.)
  const mapRef = useRef(null);

  // État local pour stocker la position actuelle de l’utilisateur
  const [currentPosition, setCurrentPosition] = useState(null);

  // Etat pour stocker les lieux à afficher sur la carte
  const [places, setPlaces] = useState([]);

  // Récupération du trajet en cours depuis Redux
  const route = useSelector((state) => state.trips.coords?.routeCoords);

  const tripActive = route && route.length > 0; // Vérifie si un trajet est actif
  const bottomSheetHeight = 120; // Hauteur de la BottomSheet du trajet

  //* Configuration des boutons dans le header (barre du haut)
  useEffect(() => {
    navigation.setOptions({
      // Bouton de recherche à droite
      headerRight: () => (
        <TouchableOpacity
          onPress={() => searchSheetRef.current?.present()} // Ouvre la BottomSheet de recherche
          style={{ marginRight: 15 }}
        >
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      ),
      // Bouton menu (drawer) à gauche
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.openDrawer()} // Ouvre le menu latéral
          style={{ marginLeft: 15 }}
        >
          <FontAwesome name="bars" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]); // Dépendance : navigation

  //* Demande de permission et récupération de la position de l’utilisateur
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync(); // Demande la permission
      if (status !== "granted") return; // Si refusée, on sort
      let location = await Location.getCurrentPositionAsync({}); // Récupère la position
      setCurrentPosition(location.coords); // Met à jour l’état
    })();
  }, []); // Exécuté une seule fois au montage

  //* Mise à jour de la carte et du store Redux lorsque la position change
  useEffect(() => {
    if (currentPosition) {
      dispatch(userLoc(currentPosition)); // Envoie la position à Redux
      if (mapRef.current) {
        // Centre la carte sur la nouvelle position avec animation
        mapRef.current.animateToRegion(
          {
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1000 // Durée de l’animation en ms
        );
      }
    }
  }, [currentPosition]); // Exécuté à chaque changement de position

  // Récupère les lieux à afficher sur la carte
  // console.log("setplaces", places);
  useEffect(() => {
    console.log("Récupération des lieux depuis l'API...");
    // Déclaration d'une fonction asynchrone interne pour récupérer les lieux depuis l'API
    const fetchPlaces = async () => {
      try {
        // Envoie une requête GET à l'API pour récupérer tous les lieux
        const response = await fetch(`${BACK_URL}/places`, {
          headers: {
            // Ajoute le token JWT dans les headers pour l'authentification
            Authorization: `Bearer ${token}`,
          },
        });

        // On attend la réponse sous forme de JSON
        const data = await response.json();

        // Si la réponse est valide et contient bien un tableau "places"
        if (data.result && data.places) {
          // On met à jour le state local avec les lieux récupérés
          setPlaces(data.places);
        }
      } catch (error) {
        // En cas d'erreur lors de la requête ou du traitement de la réponse
        console.error("Erreur lors du chargement des lieux :", error);
      }
    };

    // On appelle la fonction fetchPlaces seulement si le token est disponible
    if (token) fetchPlaces();

    // Le hook s'exécutera à chaque fois que la valeur de "token" change
  }, [token, isFocused]); // Exécuté à chaque changement de token ou si l'écran est visible

  //* Fonction appelée pour stopper un trajet (reset du store Redux)
  const handleStopTrip = () => {
    dispatch(resetRouteCoords());
  };

  // Fonction asynchrone qui récupère les commentaires du lieu identifié par "key"
  const handlePress = async (key) => {
    // Appel de la fonction upComments
    // On récupère les commentaires associés à la clé "key"
    // Si upComments ne retourne rien (undefined), on met un tableau vide par défaut avec || []
    const comments = (await upComments(key, token, navigation)) || [];

    // Ensuite, on navigue vers l'écran "PlaceScreen"
    // On passe en paramètres l'id du lieu ainsi que les commentaires récupérés
    navigation.navigate("PlaceScreen", {
      id: key,
      comments: comments,
    });
  };

  useEffect(() => {
    if (!token) return;
    fetch(`${BACK_URL}/address`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(setWorkAddress(data.workAddress));
        dispatch(setHomeAddress(data.homeAddress));
      });
  }, [token]);

  //* ----------- Rendu du composant principal -----------
  return (
    <View style={styles.container}>
      {/* Affichage de la carte */}
      <MapView
        key={places.length} // Redemander à Clément ou Carine expliquation
        ref={mapRef}
        mapType="normal"
        style={styles.map}
        showsUserLocation // Affiche la position de l’utilisateur sur la carte
        region={
          currentPosition
            ? {
                latitude: currentPosition.latitude,
                longitude: currentPosition.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : null
        } // Centre la carte sur la position actuelle de l’utilisateur
      >
        {/* -------- Affiche un marker pour chaque lieu récupéré --------- il met 5 secondes à s'afficher */}
        {places.map((place) => {
          // console.log("place", place);
          return (
            <Marker
              key={place._id} // Clé unique pour chaque marqueur
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              title="Lieu"
            >
              {/*composant qui permet de personnaliser l'affichage d'un marqueur sur la carte*/}
              <Callout onPress={() => handlePress(place._id)}>
                {/* Vue qui contient le contenu affiché dans le callout, ici une largeur fixe */}
                <View
                  style={{
                    width: 124,
                    padding: 2,
                    backgroundColor: "white",
                  }}
                >
                  {/* Affiche le nom du lieu */}
                  {/* <Text>{place.name}</Text> */}
                  {/* Si la place a une image (picture), on l'affiche */}
                  {place.picture && (
                    <Image
                      source={{ uri: place.picture }}
                      style={{
                        width: 120,
                        height: 100,
                      }}
                      resizeMode="cover"
                    />
                  )}
                </View>
              </Callout>
            </Marker>
          );
        })}

        {/* Si un trajet est en cours, on trace une ligne */}
        {route && route.length > 0 && (
          <Polyline coordinates={route} strokeWidth={8} strokeColor="blue" />
        )}

        {/* Bouton d’accès aux filtres */}
        <View>
          <TouchableOpacity
            style={styles.buttonFiltre}
            onPress={() => filterSheetRef.current?.present()}
            accessibilityLabel="Sélectionner des filtres"
            accessibilityRole="button"
          >
            <FontAwesome name="sliders" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Bouton pour effectuer un signalement */}
        <View
          style={[
            styles.buttonSignalement,
            // 10px au-dessus de la feuille, sinon 30px du bas
            { bottom: tripActive ? bottomSheetHeight + 20 : 30 },
          ]}
        >
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

      {/* Fournisseur de contexte pour les BottomSheets */}
      <BottomSheetModalProvider>
        {/* BottomSheet de recherche */}
        <SearchBottomSheet ref={searchSheetRef} />

        {/* BottomSheet des filtres */}
        <FilterBottomSheet ref={filterSheetRef} />

        {/* BottomSheet de signalement */}
        <SignalBottomSheet ref={signalSheetRef} />

        {/* BottomSheet du trajet (affiche bouton stop si un trajet est actif) */}
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
    left: 20,
    width: 60,
    height: 30,
    backgroundColor: "#DFF0FF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,

    // -----  shadow iOS  -----
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4.84,

    // -----  shadow Android  -----
    elevation: 5,
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

  calloutContainer: {
    width: 150,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  calloutImage: {
    width: "100%",
    height: 75,
    borderRadius: 8,
  },
});
