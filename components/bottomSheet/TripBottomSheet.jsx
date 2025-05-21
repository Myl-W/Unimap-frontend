import React, { useRef, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Text from "../../assets/fonts/CustomText";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";

const TripBottomSheet = ({ isRouteActive, onStopTrip }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = ["20%", "70%"];
  const tripinfos = useSelector((state) => state.trips.value.tripInfos);

  // Fonction pour fermer la bottom sheet (continuer le trajet)
  const handleContinue = () => {
    bottomSheetRef.current?.snapToIndex(0); // 20%
  };

  // Ce useEffect permet d'ouvrir automatiquement la TripBottomSheet à 20% (snapToIndex(0))
  // dès qu'un trajet est actif (isRouteActive = true) et de la fermer dès qu'il n'y a plus de trajet.
  // cela synchronise l'affichage de la bottom sheet avec l'état du trajet dans l'application.
  useEffect(() => {
    if (isRouteActive) {
      bottomSheetRef.current?.present();
      bottomSheetRef.current?.snapToIndex(0); // 20%
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isRouteActive]);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.header}>
          {tripinfos ? (
            <>
            <Text style={styles.title}>{tripinfos.duration}</Text>
            <Text style={styles.title}>{tripinfos.distance}</Text>
            </>
          ) : (
            <Text style={styles.title}>Aucun trajet en cours</Text>
          )}
        </View>
      </BottomSheetView>
      <View style={styles.buttonRow}>
        <View style={styles.stopTrip} >
          <TouchableOpacity style={styles.stopButton} onPress={onStopTrip}>
            <Text style={styles.stopButtonText}>Arrêt</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.continueTrip}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Y aller</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  stopTrip: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: "#e74c3c",
    padding: 0,
    borderRadius: 10,
  },
  stopButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 0,
    marginTop: 10,
  },
  continueButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width:"60%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TripBottomSheet;
