import { useRef, useEffect, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

// Sert à convertir une durée écrite en texte (par exemple "1 h 12 min" ou "45 min") en nombre total de minutes (par exemple 72 ou 45).
function parseDurationToMinutes(durationStr) {
  let total = 0;
  // Cherche le nombre d’heures dans la chaîne grâce à des expressions régulières (hMatch).
  const hMatch = durationStr.match(/(\d+)\s*h/);
  // Cherche le nombre de minutes dans la chaîne grâce à des expressions régulières (mMatch).
  const mMatch = durationStr.match(/(\d+)\s*min/);
  // Si hMatch ou mMatch existent, on les convertit en entiers.
  // Si elle trouve des heures, elle les convertit en minutes (heures * 60) et les ajoute au total.
  // "10" signifie qu’on convertit en base décimale (donc un nombre classique, pas en binaire, octal, etc.).
  if (hMatch) total += parseInt(hMatch[1], 10) * 60;
  // Si elle trouve des minutes, elle les ajoute directement au total.
  if (mMatch) total += parseInt(mMatch[1], 10);
  return total;
}

// --------------- Formate la durée du trajet : ----------------
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
  // hMatch[1] correspond au premier groupe capturé par l’expression régulière, c’est-à-dire le nombre trouvé (exemple : pour "2 h", hMatch[1] vaut "2").
  // 10 signifie qu’on convertit en base décimale (donc un nombre classique, pas en binaire, octal, etc.).
  if (hMatch) hours = parseInt(hMatch[1], 10);
  if (mMatch) minutes = parseInt(mMatch[1], 10);
  // Si le nombre d'heures est égal à 0, on affiche le nombre de minutes.
  // Sinon, on affiche le format "H:MMh".
  if (hours === 0) {
    return `${minutes} min`;
  } else {
    //Convertit les minutes en chaîne de caractères.
    // 'padStart' -- Ajoute un zéro devant si besoin pour toujours avoir deux chiffres (ex : 5 devient "05").
    return `${hours}:${minutes.toString().padStart(2, "0")}h`;
  }
}

const TripBottomSheet = ({ isRouteActive, onStopTrip }) => {
  const bottomSheetRef = useRef(null);
  const navigation = useNavigation();
  const snapPoints = useMemo(() => ["15%", "15%"], []); // useMemo pour éviter de recréer le tableau à chaque rendu
  const tripinfos = useSelector((state) => state.trips.value.tripInfos);

  // ------------- Calcul de l'heure d'arrivée ------------
  let arrivalTimeStr = ""; // Variable qui contiendra l'heure d'arrivée formatée
  // Si tripinfos existe et contient une durée, on calcule l'heure d'arrivée
  if (tripinfos && tripinfos.duration) {
    // Récupère la date et l'heure actuelles
    const now = new Date();
    // On convertit la durée en minutes
    const durationMinutes = parseDurationToMinutes(tripinfos.duration);
    // On ajoute la durée au temps actuel pour obtenir l'heure d'arrivée
    // getTime() renvoie le temps en millisecondes
    // On multiplie la durée en minutes par 60000 pour la convertir en millisecondes
    const arrival = new Date(now.getTime() + durationMinutes * 60000);
    // Récupère les heures d'arrivée
    // On utilise padStart pour s'assurer que les heures et minutes sont toujours sur 2 chiffres
    const hours = arrival.getHours().toString().padStart(2, "0");
    // Récupère les minutes d'arrivée
    // On utilise padStart pour s'assurer que les heures et minutes sont toujours sur 2 chiffres
    const minutes = arrival.getMinutes().toString().padStart(2, "0");
    // Formate l'heure d'arrivée sous forme "HH:MM"
    arrivalTimeStr = `${hours}:${minutes}`;
  }

  // Fonction pour ouvrir la page Parametre
  const goToParametre = () => {
    navigation.navigate("Parametre");
  };

  // Ce useEffect permet d'ouvrir automatiquement la TripBottomSheet à 20% (snapToIndex(0))
  // dès qu'un trajet est actif (isRouteActive = true) et de la fermer dès qu'il n'y a plus de trajet.
  // cela synchronise l'affichage de la bottom sheet avec l'état du trajet dans l'application.
  useEffect(() => {
    if (isRouteActive) {
      //.current contient donc l’objet réel du composant BottomSheetModal, ce qui te permet d’appeler ses méthodes (comme .present(), .dismiss(), etc.) depuis ton code.
      // Permet d'ouvrir la BottomSheet lorsque le trajet est actif sinon la fermer
      bottomSheetRef.current?.present();
      // Cette ligne demande à la BottomSheet de se positionner à l’index 0 de ses snapPoints
      bottomSheetRef.current?.snapToIndex(0); // 20%
    } else {
      bottomSheetRef.current?.dismiss(); // Ferme la BottomSheet si le trajet n'est plus actif
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
          <TouchableOpacity onPress={goToParametre} style={styles.paramIcon}>
            <FontAwesome name="cog" size={40} color="#222" />
          </TouchableOpacity>
        )}
        <View style={styles.header}>
          {tripinfos ? (
            // '<>' appeler fragments pour encapsuler plusieurs éléments sans ajouter de view ou quelconque autre élément qui pourrait affecter le style
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
        <TouchableOpacity style={styles.stopTrip} onPress={onStopTrip}>
          <Text style={styles.stopButtonText}>Arrêt</Text>
        </TouchableOpacity>
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
    left: 320,
    right: 0,
    width: 80,
    height: 80,
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
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
    fontWeight: "100",
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
    top: 10,
    left: 30,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    elevation: 3, // Ajoute une ombre portée sur Android
    shadowColor: "#000", // Couleur de l'ombre (pour iOS)
    shadowOffset: { width: 0, height: 2 }, // Décalage de l'ombre (pour iOS)
    shadowOpacity: 0.2, // Opacité de l'ombre (pour iOS)
    shadowRadius: 2, // Flou de l'ombre (pour iOS)
  },
});

export default TripBottomSheet;
