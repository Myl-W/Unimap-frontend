import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
} from "react-native";
import { toggleHandicap } from "../reducers/accessibility";
import { addProfilePhoto, userInfos } from "../reducers/user";
import DateTimePicker from "@react-native-community/datetimepicker";
import Popup from "../components/modals/popup";

export default function RegisterScreen({ navigation }) {
  const BACK_URL = Constants.expoConfig?.extra?.BACK_URL;
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false); // Contrôle d'affichage du date picker
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // État pour la visibilité du mot de passe

  // Fonction appelée lorsqu'une nouvelle date est sélectionnée
  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios"); // Gère la fermeture du date picker sur Android
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const accessibility = useSelector((state) => state.accessibility); // Accès à l'état global redux lié aux handicaps

  // ------ Fonction pour afficher / fermer la modal ------
  const handlePressModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Liste des handicaps proposés
  const handicapKeys = [
    "sourd",
    "aveugle",
    "mobilité",
    "canne",
    "malvoyant",
    "malentendant",
    "autisme",
  ];

  // Fonction pour activer/désactiver un handicap donné
  const handleToggle = (key) => {
    dispatch(toggleHandicap(key)); // Envoie une action redux pour modifier l'état
  };

  // Fonction principale appelée lors du clic sur "S'inscrire"
  const handleRegister = () => {
    // Récupère la liste des handicaps sélectionnés (ceux ayant la valeur true)
    const selectedHandicaps = Object.keys(accessibility).filter(
      (key) => accessibility[key]
    );

    // Requête HTTP POST vers le backend pour enregistrer l'utilisateur
    fetch(`${BACK_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lastname: lastname,
        firstname: firstname,
        email: email.trim().toLowerCase(), // Normalise l'email
        password: password.trim(), // Supprime les espaces inutiles
        birthdate: date,
        disability: selectedHandicaps,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.result && data.token) {
          // Dispatch des infos reçues vers le reducer
          dispatch(userInfos(data));
          if (data.profilePhoto) {
            dispatch(addProfilePhoto(data.profilePhoto));
          }

          try {
            // Sauvegarde du token en local avec la même clé que dans LoginScreen
            await AsyncStorage.setItem("userToken", data.token);

            navigation.navigate("Map");
          } catch (error) {
            console.error("Erreur en sauvegardant le token:", error);
            alert("Erreur lors de la sauvegarde du token.");
          }
        } else {
          alert("Inscription échouée. Veuillez vérifier les champs.");
        }
      })
      .catch((err) => {
        console.error("Erreur réseau :", err);
        alert("Erreur réseau. Vérifiez votre connexion.");
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Pour éviter que le clavier recouvre les champs sur iOS
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Champs de saisie pour les infos personnelles */}
          <TextInput
            placeholder="nom"
            onChangeText={setLastname}
            value={lastname}
            style={styles.input}
            autoCapitalize="words" // Met en majuscule les premières lettres de chaque mot
            textContentType="name" // Indique que le champ est un nom
          />
          <TextInput
            placeholder="Prénom"
            onChangeText={setFirstname}
            value={firstname}
            style={styles.input}
            autoCapitalize="words"
            textContentType="name"
          />
          <TextInput
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            style={styles.input}
            autoCapitalize="none" // Ne met pas en majuscule les premières lettres
            textContentType="emailAddress" // Indique que le champ est une adresse email
          />

          {/* Champ mot de passe avec l'icône d'œil */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Mot de passe"
              secureTextEntry={!isPasswordVisible}
              textContentType="password"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <FontAwesome
                name={isPasswordVisible ? "eye" : "eye-slash"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>

          {/* Sélection de la date de naissance */}
          <View style={styles.inputDate}>
            <Text style={styles.titleDate}>Date de naissance</Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
              onPress={() => setShow(true)}
              maximumDate={new Date()}
              locale="fr-FR"
            />
          </View>

          {/* Section pour la sélection des handicaps */}
          <View style={styles.checkboxContainer}>
            <Text style={styles.subtitle}>Sélectionnez votre handicap</Text>
            <View style={styles.checkBoxGrid}>
              {handicapKeys.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.checkBoxItem}
                  onPress={() => handleToggle(key)}
                  accessibilityLabel={`Activer mode ${key}`}
                  accessibilityRole="button"
                >
                  <MaterialIcons
                    name={
                      accessibility[key]
                        ? "check-box"
                        : "check-box-outline-blank"
                    }
                    size={24}
                    color={accessibility[key] ? "#007AFF" : "#aaa"}
                  />
                  <Text style={styles.textCheckbox}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Bouton principal d'inscription */}
          <TouchableOpacity
            onPress={handleRegister}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>S'inscrire</Text>
          </TouchableOpacity>

          {/* Ligne de séparation */}
          <View style={styles.line} />

          <Text style={styles.textOu}>Ou</Text>

          {/* -------------- Boutons d'inscription avec Google / Facebook / Apple (non fonctionnels ici) ----------------*/}
          <View style={styles.imageContent}>
            <TouchableOpacity onPress={handlePressModal} activeOpacity={0.8}>
              <Image
                style={styles.image}
                source={require("../assets/google.png")}
              />
            </TouchableOpacity>

            {/* --------- Modal -------- */}
            <Popup visible={showModal} onClose={handleCloseModal} />

            <TouchableOpacity onPress={handlePressModal} activeOpacity={0.8}>
              <Image
                style={styles.image}
                source={require("../assets/facebook.png")}
              />
            </TouchableOpacity>

            {/* --------- Modal -------- */}
            <Popup visible={showModal} onClose={handleCloseModal} />

            <TouchableOpacity onPress={handlePressModal} activeOpacity={0.8}>
              <Image
                style={styles.image}
                source={require("../assets/apple.png")}
              />
            </TouchableOpacity>

            {/* --------- Modal -------- */}
            <Popup visible={showModal} onClose={handleCloseModal} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFF0FF",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  checkboxContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 5,
  },
  input: {
    width: "80%",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  inputDate: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    marginBottom: 10,
  },
  titleDate: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 4,
    color: "black",
    alignSelf: "center",
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 15,
    letterSpacing: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    alignSelf: "center",
  },
  checkBoxGrid: {
    width: "80%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  checkBoxItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 15,
  },
  textCheckbox: {
    marginLeft: 5,
    fontSize: 16,
    color: "#000",
  },
  button: {
    marginTop: 10,
    width: "80%",
    height: 50,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  textButton: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
  line: {
    width: "90%",
    height: 2,
    backgroundColor: "#000",
    marginVertical: 8,
  },
  textOu: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#000",
  },
  imageContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  image: {
    width: 60,
    height: 60,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "white",
    borderColor: "#ccc",
    fontSize: 16,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 5,
  },
});
