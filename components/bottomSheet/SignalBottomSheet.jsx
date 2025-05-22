import { forwardRef } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { toggleSignalement } from "../../reducers/signalement";
import {
  getSignalButtons,
  signalButtonStyles,
} from "./signalButton/SignalButton";

// forwardRef permet de passer une référence à un composant enfant
const SignalBottomSheet = forwardRef(({ handleSheetSignal }, ref) => {
  const navigation = useNavigation();

  const snapPoints = ["50%", "75%"]; // Definie la taille d'ouverture du BottomSheet

  const dispatch = useDispatch();

  const handleToggle = (key) => {
    dispatch(toggleSignalement(key));
  };

  const icons = getSignalButtons(signalButtonStyles);

  const chunkedIcons = [...Array(Math.ceil(icons.length / 3))].map((_, i) =>
    icons.slice(i * 3, i * 3 + 3)
  );

  const handleToggleSignal = (key) => {
    handleToggle(key);
    ref?.current?.close();
    navigation.navigate("Signalement");
  };

  return (
    <BottomSheetModal
      ref={ref}
      onChange={handleSheetSignal}
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
        {chunkedIcons.map((row, idx) => (
          <View key={idx} style={styles.buttonRow}>
            {row.map((item) => (
              <View key={item.key} style={item.style}>
                <TouchableOpacity
                  style={
                    item.key === "alerte"
                      ? styles.optionButtonAlert
                      : styles.optionButton
                  }
                  onPress={() => handleToggleSignal(item.key)}
                  accessible={true}
                  accessibilityLabel={item.label}
                  accessibilityRole="button"
                >
                  <View
                    style={
                      item.key === "alerte"
                        ? styles.optionButtonContentAlert
                        : styles.optionButtonContent
                    }
                  >
                    {item.icon}
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
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
  optionButtonAlert: {
    width: 60,
    height: 60,
    backgroundColor: "#ffb71e",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
});
export default SignalBottomSheet;
