import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function CompteScreen({ navigation }) {
  const dispatch = useDispatch();

  // -------- Récupération des informations de l'utilisateur depuis le reducer Redux ------------
  const userInfo = useSelector((state) => state.user.profile);
  const userPhoto = useSelector((state) => state.user.profile.profilePhoto);

  // ------ Formattage de la date de naissance (au format français) ------
  const dateObj = new Date(userInfo.birthdate);
  const formattedDate = dateObj.toLocaleDateString("fr-FR");

  // --------- Calcul de l'âge de l'utilisateur à partir de sa date de naissance ---------
  const today = new Date();
  let age = today.getFullYear() - dateObj.getFullYear(); // Différence en années
  const monthDiff = today.getMonth() - dateObj.getMonth(); // Différence en mois
  const dayDiff = today.getDate() - dateObj.getDate(); // Différence en jours

  // Si l'anniversaire n'est pas encore passé cette année, on retire 1 an
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return (
    <View style={styles.container}>
      {/* Permet d'éviter que le clavier ne cache les éléments sur iOS/Android */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.scrollContent}>
          {/* Titre de la section des points */}
          <Text
            style={styles.title}
            accessibilityLabel="Nombre de points"
            accessibilityRole="number"
          >
            Points
          </Text>

          {/* Section avatar + points */}
          <View style={styles.avatarContainer}>
            <View style={styles.point}>
              <View style={styles.pointContent}>
                <Text style={styles.number}>#9999</Text>
                {/* Numéro de l'utilisateur (fictif ici) */}
              </View>
            </View>
            <View style={styles.avatar}>
              {/* Icône de l'utilisateur */}
              {userPhoto ? (
                <Image
                  source={{ uri: userPhoto }}
                  style={{ width: "100%", height: "100%", borderRadius: 8 }}
                  accessibilityLabel="Photo d'identité"
                  accessibilityRole="Image"
                />
              ) : (
                <FontAwesome
                  name="user"
                  size={150}
                  color="black"
                  style={styles.icon}
                  accessibilityLabel="Photo d'identité"
                  accessibilityRole="Image"
                />
              )}
            </View>
          </View>

          {/* Affichage des informations personnelles de l'utilisateur */}
          <View style={styles.bodyContainer}>
            <Text style={styles.bodyText}>
              <Text
                style={styles.bold}
                accessibilityLabel="Prénom"
                accessibilityRole="text"
              >
                Prénom:{" "}
              </Text>
              {userInfo.firstname}
            </Text>

            <Text style={styles.bodyText}>
              <Text
                style={styles.bold}
                accessibilityLabel="Nom"
                accessibilityRole="text"
              >
                Nom:{" "}
              </Text>
              {userInfo.lastname}
            </Text>

            <Text style={styles.bodyText}>
              <Text
                style={styles.bold}
                accessibilityLabel="Age"
                accessibilityRole="text"
              >
                Age:{" "}
              </Text>
              {`${age} ans`}
            </Text>

            <View style={styles.bodyTextColumn}>
              <Text
                style={styles.bold}
                accessibilityLabel="Date de naissance"
                accessibilityRole="text"
              >
                Date de naissance:
              </Text>
              <Text style={styles.bodyText}>{formattedDate}</Text>
            </View>

            <View style={styles.bodyTextColumn}>
              <Text
                style={styles.bold}
                accessibilityLabel="Email"
                accessibilityRole="text"
              >
                Email:
              </Text>
              <Text style={styles.bodyText}>{userInfo.email}</Text>
            </View>
          </View>

          {/* Bouton Adresse Domicile / Travail */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.optionButton}
              accessibilityLabel="Adresse domicile et travail"
              accessibilityRole="button"
              onPress={() => navigation.navigate("HomeWorkScreen")}
            >
              <View style={styles.iconTextRow}>
                {/* Icône domicile */}
                <FontAwesome
                  name="home"
                  size={24}
                  color="black"
                  style={styles.icon}
                />
                <Text style={styles.optionButtonText}>Domicile</Text>
                <Text style={styles.optionButtonText}>{" / "}</Text>
                {/* Icône travail */}
                <FontAwesome
                  name="briefcase"
                  size={24}
                  color="black"
                  style={styles.icon}
                />
                <Text style={styles.optionButtonText}>Travail</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Bouton pour accéder aux paramètres */}
          <View style={styles.footer}>
            <TouchableOpacity
              accessibilityLabel="Aller aux paramètres"
              accessibilityRole="button"
              style={styles.optionButton}
              onPress={() => navigation.navigate("Parametre")}
            >
              <View style={styles.iconTextRow}>
                <FontAwesome
                  name="gear"
                  size={24}
                  color="black"
                  accessibilityLabel="Paramètre"
                  accessibilityRole="image"
                  style={styles.icon}
                />
                <Text style={styles.optionButtonText}>Paramètres</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 20,
    height: "100%",
  },
  title: {
    fontSize: 15,
    color: "black",
    textShadowColor: "grey",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: "center",
  },
  avatarContainer: {
    position: "relative",
    width: 200,
    height: 230,
    marginBottom: 45,
    alignItems: "center",
    zIndex: 1,
  },
  point: {
    position: "relative",
    top: 15,
    height: 30,
    width: 100,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    zIndex: 2,
  },
  pointContent: {
    top: 5,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontWeight: "bold",
  },
  avatar: {
    height: 220,
    width: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  bodyContainer: {
    width: "90%",
    alignItems: "center",
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 18,
    marginBottom: 10,
    color: "black",
    textAlign: "center",
  },
  bodyTextColumn: {
    marginBottom: 5,
    alignItems: "center",
  },
  bold: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
  },
  optionButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
    width: "80%",
    borderWidth: 1,
    borderColor: "black",
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  iconTextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  icon: {
    marginHorizontal: 5,
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#DFF0FF",
    padding: 20,
  },
});
