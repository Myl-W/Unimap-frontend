import { forwardRef } from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
// BottomSheet
import {
  BottomSheetModal, // Composant principal du BottomSheet
  BottomSheetView, // Vue principale du BottomSheet
  BottomSheetBackdrop, // Composant de fond sombre du BottomSheet
} from "@gorhom/bottom-sheet";
// Icons
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { toggleHandicap, toggleMultiple } from "../../reducers/accessibility";
import { setTransport, resetTransport } from "../../reducers/trips";

// forwardRef permet de passer une référence à un composant enfant
const FilterBottomSheet = forwardRef(({ handleSheetFilters }, ref) => {
  const snapPoints = ["50%", "75%"]; // Definie la taille d'ouverture du BottomSheet

  // Reducers pour les handicaps et les transports
  const transport = useSelector((state) => state.trips.selectedTransport);
  const dispatch = useDispatch();

  const handleToggleHandicaps = () => {
    dispatch(toggleMultiple(handicapKeys));
  };

  const handleToggleTransport = () => {
    dispatch(resetTransport(null));
  };

  const handleCheckHandicap = (key) => {
    // Vérifie si la clé est dans la liste des handicaps
    if (handicapKeys.includes(key)) {
      // Si la clé est déjà sélectionnée, on la désélectionne
      dispatch(toggleHandicap(key));
    }
  };
  const handleCheckTransport = (key) => {
    if (transportKeys.includes(key)) {
      dispatch(setTransport(key));
    }
  };

  // Checkbox keys for handicaps and transports
  const handicapKeys = [
    "sourd",
    "aveugle",
    "fauteuil",
    "canne",
    "malvoyant",
    "malentendant",
    "autisme",
  ];

  const transportKeys = [
    "walking",
    "driving",
    "two_wheeler",
    "bicycling",
    "transit",
  ];

  //  ---------- RECUPERATION BOOLEAN DES FILTRES DU REDUCER ----------------

  const accessibility = useSelector((state) => state.accessibility);

  //---------------------------------------------------------

  return (
    <BottomSheetModal
      ref={ref}
      onChange={handleSheetFilters}
      snapPoints={snapPoints}
      enableDismissOnClose={true} // Permet de fermer le BottomSheet en cliquant en dehors
      backdropComponent={(
        backdropProps // Composant de fond sombre
      ) => (
        <BottomSheetBackdrop
          {...backdropProps} // Permet de faire apparaitre le fond sombre
          appearsOnIndex={0} // Rend le fond sombre visible
          disappearsOnIndex={-1} // Rend le fond sombre invisible
          opacity={0.3} // Opacité du fond sombre
          pressBehavior="close" // Permet de fermer le BottomSheet en cliquant sur le fond sombre
        />
      )}
    >
      <BottomSheetView
        style={styles.contentContainer}
        accessible={true}
        accessibilityViewIsModal={true}
        accessibilityLabel="Menu des options de signalement" // Annonce vocale pour les utilisateurs de lecteurs d'écran
      >
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleToggleHandicaps}
            accessibilityLabel="Sélectionner tous les handicaps"
            accessibilityRole="button" // Expliquer le rôle cliquable pour les lecteurs d'écran
          >
            <View style={styles.optionButtonContent}>
              <FontAwesome name="wheelchair" size={24} color="black" />
              <Text style={styles.optionButtonText}>Handicap</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleToggleTransport}
            accessibilityLabel="Sélectionner tous les transports"
            accessibilityRole="button"
          >
            <View style={styles.optionButtonContent}>
              <FontAwesome name="car" size={24} color="black" />
              <Text style={styles.optionButtonText}>Transport</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* Ligne 1 */}
        <View style={styles.checkBoxRow}>
          <TouchableOpacity
            accessibilityLabel="Personne a mobilité"
            accessibilityRole="button"
            style={styles.checkBoxItem}
            onPress={() => handleCheckHandicap("fauteuil")}
          >
            <MaterialIcons
              name={
                accessibility.fauteuil ? "check-box" : "check-box-outline-blank"
              }
              size={24}
              color={accessibility.fauteuil ? "#007AFF" : "#aaa"}
            />
            <Text style={styles.textCheckbox}>Mobilité réduite</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="Trajet a pied"
            accessibilityRole="button"
            style={styles.checkBoxItem}
            onPress={() => handleCheckTransport("walking")}
          >
            <MaterialIcons
              name={
                transport === "walking"
                  ? "check-box"
                  : "check-box-outline-blank"
              }
              size={24}
              color={transport === "walking" ? "#007AFF" : "#aaa"}
            />
            <Text style={styles.textCheckbox}>A pied</Text>
          </TouchableOpacity>
        </View>
        {/* Ligne 2 */}
        <View style={styles.checkBoxRow}>
          <TouchableOpacity
            accessibilityLabel="Aveugle"
            accessibilityRole="button"
            style={styles.checkBoxItem}
            onPress={() => handleCheckHandicap("aveugle")}
          >
            <MaterialIcons
              name={
                accessibility.aveugle ? "check-box" : "check-box-outline-blank"
              }
              size={24}
              color={accessibility.aveugle ? "#007AFF" : "#aaa"}
            />
            <Text style={styles.textCheckbox}>Aveugle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Trajet en vélo"
            accessibilityRole="button"
            style={styles.checkBoxItem}
            onPress={() => handleCheckTransport("bicycling")}
          >
            <MaterialIcons
              name={
                transport === "bicycling"
                  ? "check-box"
                  : "check-box-outline-blank"
              }
              size={24}
              color={transport === "bicycling" ? "#007AFF" : "#aaa"}
            />
            <Text style={styles.textCheckbox}>Vélo</Text>
          </TouchableOpacity>
        </View>
        {/* Ligne 3 */}
        <View style={styles.checkBoxRow}>
          <TouchableOpacity
            accessibilityLabel="malvoyant"
            accessibilityRole="button"
            style={styles.checkBoxItem}
            onPress={() => handleCheckHandicap("malvoyant")}
          >
            <MaterialIcons
              name={
                accessibility.malvoyant
                  ? "check-box"
                  : "check-box-outline-blank"
              }
              size={24}
              color={accessibility.malvoyant ? "#007AFF" : "#aaa"}
            />
            <Text style={styles.textCheckbox}>Malvoyant(e)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Trajet en moto"
            accessibilityRole="button"
            style={styles.checkBoxItem}
            onPress={() => handleCheckTransport("two_wheeler")}
          >
            <MaterialIcons
              name={
                transport === "two_wheeler"
                  ? "check-box"
                  : "check-box-outline-blank"
              }
              size={24}
              color={transport === "two_wheeler" ? "#007AFF" : "#aaa"}
            />
            <Text style={styles.textCheckbox}>Moto</Text>
          </TouchableOpacity>
        </View>
        {/* Ligne 4 */}
        <View style={styles.checkBoxRow}>
          <TouchableOpacity
            accessibilityLabel="Malentendant"
            accessibilityRole="button"
            style={styles.checkBoxItem}
            onPress={() => handleCheckHandicap("malentendant")}
          >
            <MaterialIcons
              name={
                accessibility.malentendant
                  ? "check-box"
                  : "check-box-outline-blank"
              }
              size={24}
              color={accessibility.malentendant ? "#007AFF" : "#aaa"}
            />
            <Text style={styles.textCheckbox}>Malentendant(e)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Trajet en voiture"
            accessibilityRole="button"
            style={styles.checkBoxItem}
            onPress={() => handleCheckTransport("driving")}
          >
            <MaterialIcons
              name={
                transport === "driving"
                  ? "check-box"
                  : "check-box-outline-blank"
              }
              size={24}
              color={transport === "driving" ? "#007AFF" : "#aaa"}
            />
            <Text style={styles.textCheckbox}>Voiture</Text>
          </TouchableOpacity>
        </View>
        {/* Ligne 5 */}
        <View style={styles.checkBoxRow}>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.checkBoxItem}
            onPress={() => handleCheckHandicap("sourd")}
            accessibilityLabel="Activer mode sourd"
          >
            <MaterialIcons
              name={
                accessibility.sourd ? "check-box" : "check-box-outline-blank"
              }
              size={24}
              color={accessibility.sourd ? "#007AFF" : "#aaa"}
            />
            <Text style={styles.textCheckbox}>Sourd(e)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="Trajet en bus"
            accessibilityRole="button"
            style={styles.checkBoxItem}
            onPress={() => handleCheckTransport("transit")}
          >
            <MaterialIcons
              name={
                transport === "transit"
                  ? "check-box"
                  : "check-box-outline-blank"
              }
              size={24}
              color={transport === "transit" ? "#007AFF" : "#aaa"}
            />
            <Text style={styles.textCheckbox}>Bus</Text>
          </TouchableOpacity>
        </View>
        {/* Ligne 6 */}
        <View style={styles.checkBoxRow}>
          <TouchableOpacity
            accessibilityLabel="Autisme"
            accessibilityRole="button"
            style={styles.checkBoxItem}
            onPress={() => handleCheckHandicap("autisme")}
          >
            <MaterialIcons
              name={
                accessibility.autisme ? "check-box" : "check-box-outline-blank"
              }
              size={24}
              color={accessibility.autisme ? "#007AFF" : "#aaa"}
            />
            <Text style={styles.textCheckbox}>Autisme</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
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
});

export default FilterBottomSheet;
