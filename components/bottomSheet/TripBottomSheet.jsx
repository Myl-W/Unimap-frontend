import { useRef, useEffect, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Text from "../../assets/fonts/CustomText";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

// Fonction utilitaire pour convertir "1 h 12 min" ou "15 min" en minutes
function parseDurationToMinutes(durationStr) {
  let total = 0;
  // Cherche le nombre d’heures dans la chaîne (hMatch).
  const hMatch = durationStr.match(/(\d+)\s*h/);
  // Cherche le nombre de minutes dans la chaîne (mMatch).
  const mMatch = durationStr.match(/(\d+)\s*min/);
  // Si hMatch ou mMatch existent, on les convertit en entiers.
  // Si hMatch existe, on ajoute le nombre d'heures converti en minutes.
  if (hMatch) total += parseInt(hMatch[1], 10) * 60;
  // Si mMatch existe, on l'ajoute directement.
  if (mMatch) total += parseInt(mMatch[1], 10);
  return total;
}

// Formate la durée du trajet :
// - Affiche "X min" si moins d'une heure
// - Affiche "H:MMh" si une heure ou plus (ex : "1:05h")
function formatDuration(durationStr) {
  let hours = 0;
  let minutes = 0;
  //Cherche le nombre d’heures dans la chaîne (hMatch).
  const hMatch = durationStr.match(/(\d+)\s*h/);
  //Cherche le nombre de minutes dans la chaîne (mMatch).
  const mMatch = durationStr.match(/(\d+)\s*min/);
  // Si hMatch ou mMatch existent, on les convertit en entiers.
  if (hMatch) hours = parseInt(hMatch[1], 10);
  if (mMatch) minutes = parseInt(mMatch[1], 10);
  // Si le nombre d'heures est supérieur à 0, on affiche le format "H:MMh".
  // Sinon, on affiche le nombre de minutes.
  if (hours === 0) {
    return `${minutes} min`;
  } else {
    return `${hours}:${minutes.toString().padStart(2, "0")}h`;
  }
}

const TripBottomSheet = ({ isRouteActive, onStopTrip }) => {
  const bottomSheetRef = useRef(null);
  const navigation = useNavigation();
  const snapPoints = useMemo(() => ["15%", "70%"], []); // Definie la taille d'ouverture du BottomSheet
  const tripinfos = useSelector((state) => state.trips.value.tripInfos);

  // Calcul de l'heure d'arrivée
  let arrivalTimeStr = "";
  // Si tripinfos existe et contient une durée, on calcule l'heure d'arrivée
  if (tripinfos && tripinfos.duration) {
    const now = new Date();
    // On convertit la durée en minutes
    const durationMinutes = parseDurationToMinutes(tripinfos.duration);
    // On ajoute la durée au temps actuel pour obtenir l'heure d'arrivée
    // On utilise getTime() pour obtenir le temps en millisecondes
    const arrival = new Date(now.getTime() + durationMinutes * 60000);
    // On formate l'heure d'arrivée au format "HH:MM"
    // On utilise padStart pour s'assurer que les heures et minutes sont toujours sur 2 chiffres
    const hours = arrival.getHours().toString().padStart(2, "0");
    // On formate les minutes
    // On utilise padStart pour s'assurer que les heures et minutes sont toujours sur 2 chiffres
    const minutes = arrival.getMinutes().toString().padStart(2, "0");
    arrivalTimeStr = `${hours}:${minutes}`;
  }

  // Fonction pour ouvrir la page Parametre
  const goToParametre = () => {
    navigation.navigate("Parametre");
  };

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
      enablePanDownToClose={false} // Désactive le glissement vers le bas pour fermer la bottom sheet
      index={0} // Définit l'index de la bottom sheet à 0 (20%)
    >
      <BottomSheetView style={styles.content}>
        {tripinfos && (
      <TouchableOpacity
        onPress={goToParametre}
        style={styles.paramIcon}
      >
        <FontAwesome name="cog" size={40} color="#222" />
      </TouchableOpacity>
    )}
        <View style={styles.header}>
          {tripinfos ? (
            <>
                <Text style={styles.arrivalTime}>{arrivalTimeStr}</Text>
                <View style={styles.tripInfos}>
                  <Text style={styles.title}>
                    {formatDuration(tripinfos.duration)}
                    <Text style={styles.dot}> • </Text>
                    {tripinfos.distance}
                  </Text>
            </View>
            </>
          ) : (
            <Text style={styles.title}>Aucun trajet en cours</Text>
          )}
        </View>
      </BottomSheetView>
      <View style={styles.buttonRow}>
        <View style={styles.stopTrip}>
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
    width: "60%",
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
  tripInfos: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    fontWeight: '100'
  },
  dot: {
    fontSize: 20,
    color: "#cccac4",
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  arrivalTime: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
paramIcon: {
  position: "absolute",
  top: 16,
  left: 16,
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 4,
  elevation: 3,// Ajoute une ombre portée sur Android
  shadowColor: "#000",// Couleur de l'ombre (pour iOS)
  shadowOffset: { width: 0, height: 2 }, // Décalage de l'ombre (pour iOS)
  shadowOpacity: 0.2,// Opacité de l'ombre (pour iOS)
  shadowRadius: 2,// Flou de l'ombre (pour iOS)
},

});

export default TripBottomSheet;
