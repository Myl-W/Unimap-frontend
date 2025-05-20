import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "react-native";
import Text from "../assets/fonts/CustomText";
import { userInfos } from "../reducers/user";

export default function LoginScreen({ navigation }) {
  const backUrl = Constants.expoConfig?.extra?.BACK_URL;
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // -------- Récuperation des infos utilisateur depuis le reducer ------------
  const userInfo = useSelector((state) => state.user.value.profile);

  //  -------- Fonction pour la connexion utilisateur ------------
  const handleLogin = () => {
    fetch(`${backUrl}/login`, {
      //  ------  fetch vers la route /login du backend ------------
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        //  ------- Envoi email et password dans le body de la requete  --------

        email: email.trim().toLowerCase(), // -----  Format sans espaces et en minuscule ------
        password: password.trim(),
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        dispatch(userInfos(data)); //  ------  Dispatch des infos reçu vers le reducer -------

        if (data.result && data.token) {
          //  ------  Si il y a data et token -------
          try {
            await AsyncStorage.setItem("userToken", data.token); //  ------Enregistrement du token -----------
            navigation.navigate("Map"); //  ----- Navigation vers MapScreen ----------
          } catch (error) {
            console.error("Erreur en sauvegardant le token:", error);
            alert("Erreur lors de la sauvegarde du token.");
          }
        }
      });
  };

  //  ------- Retour vers RegisterScreen  ----------
  const pageRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.textInfos}>Informations de connexion</Text>
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
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Se connecter</Text>
          </TouchableOpacity>

          <View style={styles.line} />

          <Text style={styles.textOu}>Ou</Text>
          <View style={styles.imageContent}>
            <TouchableOpacity onPress={handleLogin} activeOpacity={0.8}>
              <Image
                style={styles.image}
                source={require("../assets/google.png")}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogin} activeOpacity={0.8}>
              <Image
                style={styles.image}
                source={require("../assets/facebook.png")}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogin} activeOpacity={0.8}>
              <Image
                style={styles.image}
                source={require("../assets/apple.png")}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.textRegister}>Vous n'avez pas de compte?</Text>
          <TouchableOpacity onPress={pageRegister} activeOpacity={0.8}>
            <Text style={styles.register}>Inscrivez-vous</Text>
          </TouchableOpacity>
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
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
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
    marginVertical: 20,
  },
  textOu: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    color: "#000",
  },
  textRegister: {
    marginTop: 60,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    color: "#000",
  },
  register: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    color: "blue",
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
  textInfos: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#000",
  },
});
