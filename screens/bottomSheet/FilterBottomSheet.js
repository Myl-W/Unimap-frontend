import React, { forwardRef } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

const FilterBottomSheet = forwardRef(
  (
    {
      checkboxes,
      toggleCheckbox,
      multiCheckboxHandicap,
      multiCheckboxTransport,
      handleSheetFilters,
    },
    ref
  ) => {
    const snapPoints = ["50%", "75%"];

    return (
      <BottomSheetModal
        ref={ref}
        onChange={handleSheetFilters}
        snapPoints={snapPoints}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={multiCheckboxHandicap}
            >
              <View style={styles.optionButtonContent}>
                <FontAwesome name="wheelchair" size={24} color="black" />
                <Text style={styles.optionButtonText}>Handicap</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={multiCheckboxTransport}
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
              style={styles.checkBoxItem}
              onPress={() => toggleCheckbox("fauteuil")}
            >
              <MaterialIcons
                name={
                  checkboxes.fauteuil ? "check-box" : "check-box-outline-blank"
                }
                size={24}
                color={checkboxes.fauteuil ? "#007AFF" : "#aaa"}
              />
              <Text style={styles.textCheckbox}>Fauteuil roulant</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkBoxItem}
              onPress={() => toggleCheckbox("pied")}
            >
              <MaterialIcons
                name={checkboxes.pied ? "check-box" : "check-box-outline-blank"}
                size={24}
                color={checkboxes.pied ? "#007AFF" : "#aaa"}
              />
              <Text style={styles.textCheckbox}>A pied</Text>
            </TouchableOpacity>
          </View>
          {/* Ligne 2 */}
          <View style={styles.checkBoxRow}>
            <TouchableOpacity
              style={styles.checkBoxItem}
              onPress={() => toggleCheckbox("aveugle")}
            >
              <MaterialIcons
                name={
                  checkboxes.aveugle ? "check-box" : "check-box-outline-blank"
                }
                size={24}
                color={checkboxes.aveugle ? "#007AFF" : "#aaa"}
              />
              <Text style={styles.textCheckbox}>Aveugle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkBoxItem}
              onPress={() => toggleCheckbox("voiture")}
            >
              <MaterialIcons
                name={
                  checkboxes.voiture ? "check-box" : "check-box-outline-blank"
                }
                size={24}
                color={checkboxes.voiture ? "#007AFF" : "#aaa"}
              />
              <Text style={styles.textCheckbox}>Voiture</Text>
            </TouchableOpacity>
          </View>
          {/* Ligne 3 */}
          <View style={styles.checkBoxRow}>
            <TouchableOpacity
              style={styles.checkBoxItem}
              onPress={() => toggleCheckbox("malvoyant")}
            >
              <MaterialIcons
                name={
                  checkboxes.malvoyant ? "check-box" : "check-box-outline-blank"
                }
                size={24}
                color={checkboxes.malvoyant ? "#007AFF" : "#aaa"}
              />
              <Text style={styles.textCheckbox}>Malvoyant(e)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkBoxItem}
              onPress={() => toggleCheckbox("moto")}
            >
              <MaterialIcons
                name={checkboxes.moto ? "check-box" : "check-box-outline-blank"}
                size={24}
                color={checkboxes.moto ? "#007AFF" : "#aaa"}
              />
              <Text style={styles.textCheckbox}>Moto</Text>
            </TouchableOpacity>
          </View>
          {/* Ligne 4 */}
          <View style={styles.checkBoxRow}>
            <TouchableOpacity
              style={styles.checkBoxItem}
              onPress={() => toggleCheckbox("malentendant")}
            >
              <MaterialIcons
                name={
                  checkboxes.malentendant
                    ? "check-box"
                    : "check-box-outline-blank"
                }
                size={24}
                color={checkboxes.malentendant ? "#007AFF" : "#aaa"}
              />
              <Text style={styles.textCheckbox}>Malentendant(e)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkBoxItem}
              onPress={() => toggleCheckbox("velo")}
            >
              <MaterialIcons
                name={checkboxes.velo ? "check-box" : "check-box-outline-blank"}
                size={24}
                color={checkboxes.velo ? "#007AFF" : "#aaa"}
              />
              <Text style={styles.textCheckbox}>Vélo</Text>
            </TouchableOpacity>
          </View>
          {/* Ligne 5 */}
          <View style={styles.checkBoxRow}>
            <TouchableOpacity
              style={styles.checkBoxItem}
              onPress={() => toggleCheckbox("sourd")}
            >
              <MaterialIcons
                name={
                  checkboxes.sourd ? "check-box" : "check-box-outline-blank"
                }
                size={24}
                color={checkboxes.sourd ? "#007AFF" : "#aaa"}
              />
              <Text style={styles.textCheckbox}>Sourd(e)</Text>
            </TouchableOpacity>
          </View>
          {/* Ligne 6 */}
          <View style={styles.checkBoxRow}>
            <TouchableOpacity
              style={styles.checkBoxItem}
              onPress={() => toggleCheckbox("autisme")}
            >
              <MaterialIcons
                name={
                  checkboxes.autisme ? "check-box" : "check-box-outline-blank"
                }
                size={24}
                color={checkboxes.autisme ? "#007AFF" : "#aaa"}
              />
              <Text style={styles.textCheckbox}>Autisme</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

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
