import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { toggleHandicap } from "../reducers/accessibility";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function RegisterScreen({ navigation }) {
  const backUrl = Constants.expoConfig?.extra?.BACK_URL;
  const dispatch = useDispatch();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const accessibility = useSelector((state) => state.accessibility);

  const handicapKeys = [
    "sourd",
    "aveugle",
    "fauteuil",
    "canne",
    "malvoyant",
    "malentendant",
    "autisme",
  ];

  const handleToggle = (key) => {
    dispatch(toggleHandicap(key));
  };
  console.log("BACK_URL:", backUrl);
  const handleRegister = () => {
    const selectedHandicaps = Object.keys(accessibility).filter(
      (key) => accessibility[key]
    );

    fetch(`${backUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: nom,
        username: prenom,
        email: email.trim().toLowerCase(),
        password: password.trim(),
        dateNaissance: date,
        handicap: selectedHandicaps,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        if (data.result && data.token) {
          try {
            await AsyncStorage.setItem("token", data.token);
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TextInput
            placeholder="Nom"
            onChangeText={setNom}
            value={nom}
            style={styles.input}
          />
          <TextInput
            placeholder="Prénom"
            onChangeText={setPrenom}
            value={prenom}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            placeholder="Mot de passe"
            onChangeText={setPassword}
            value={password}
            keyboardType="email-address"
            style={styles.input}
          />
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
          <TouchableOpacity
            onPress={handleRegister}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>S'inscrire</Text>
          </TouchableOpacity>

          <View style={styles.line} />

          <Text style={styles.textOu}>Ou</Text>
          <View style={styles.imageContent}>
            <TouchableOpacity onPress={handleRegister} activeOpacity={0.8}>
              <Image
                style={styles.image}
                source={require("../assets/google.png")}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegister} activeOpacity={0.8}>
              <Image
                style={styles.image}
                source={require("../assets/facebook.png")}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegister} activeOpacity={0.8}>
              <Image
                style={styles.image}
                source={require("../assets/apple.png")}
              />
            </TouchableOpacity>
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
});
