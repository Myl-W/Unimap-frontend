import React, { forwardRef, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const SignalBottomSheet = forwardRef(({ handleSheetSignal }, ref) => {
  const [search, setSearch] = useState("");
  const snapPoints = ["50%", "75%"];

  return (
    <BottomSheetModal
      ref={ref}
      onChange={handleSheetSignal}
      snapPoints={snapPoints}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.buttonRow}>
          <View style={styles.buttonCouleur_Deaf}>
            <TouchableOpacity style={styles.optionButton}>
              <View style={styles.optionButtonContent}>
                <FontAwesome name="deaf" size={42} color="black" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonCouleur_WeelChair}>
            <TouchableOpacity style={styles.optionButton}>
              <View style={styles.optionButtonContent}>
                <FontAwesome name="wheelchair" size={42} color="black" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonCouleur_Alert}>
            <TouchableOpacity style={styles.optionButtonAlert}>
              <View style={styles.optionButtonContentAlert}>
                <Image
                  style={styles.iconAlert}
                  source={require("../../assets/icon/alert.png")}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <View style={styles.buttonCouleur_Aveugle}>
            <TouchableOpacity style={styles.optionButton}>
              <View style={styles.optionButtonContent}>
                <FontAwesome name="eye-slash" size={42} color="black" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonCouleur_Poussette}>
            <TouchableOpacity style={styles.optionButton}>
              <View style={styles.optionButtonContent}>
                <FontAwesome6 name="baby-carriage" size={42} color="black" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonCouleur_Canne}>
            <TouchableOpacity style={styles.optionButton}>
              <View style={styles.optionButtonContent}>
                <FontAwesome6
                  name="person-walking-with-cane"
                  size={42}
                  color="black"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    padding: 40,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
  },

  optionButton: {
    width: 60,
    height: 60,
    backgroundColor: "#f0f0f0",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  optionButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonCouleur_WeelChair: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "blue",
  },
  buttonCouleur_Deaf: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "green",
  },
  buttonCouleur_Alert: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#ffb71e",
    borderWidth: 2,
    borderColor: "black",
  },
  optionButtonAlert: {
    width: 60,
    height: 60,
    backgroundColor: "#ffb71e",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  optionButtonContentAlert: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffb71e",
  },
  iconAlert: {
    width: 42,
    height: 42,
  },
  buttonCouleur_Aveugle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "red",
  },
  buttonCouleur_Poussette: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "orange",
  },
  buttonCouleur_Canne: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#2dfcfc",
  },
});
export default SignalBottomSheet;
