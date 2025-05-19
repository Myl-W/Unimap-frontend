import { useDispatch } from "react-redux";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetUser } from "../reducers/user";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import Text from "../assets/fonts/CustomText";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function ParametreScreen({ navigation }) {
  const dispatch = useDispatch();

  // ------------ Ouverture de l'alerte pour la confirmation de la déconnection -----------------
  const handleLogout = () => {
    Alert.alert(
      "Se déconnecter",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        // ---------  Bouton de selection ---------------------
        { text: "Annuler", style: "cancel" },
        { text: "Se déconnecter", style: "destructive", onPress: logoutAsync },
      ],
      { cancelable: true }
    );
  };

  // -----  Si confirmer, dispatch dans le reducer, suppression du token dans asyncStorage, retour a la page login  -----
  const logoutAsync = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      dispatch(resetUser());
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.logContent}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View>
            <TouchableOpacity
              style={styles.optionAvatar}
              accessibilityLabel="Modifier son avatar"
              accessibilityRole="button"
            >
              <View style={styles.optionButtonContent}>
                <View>
                  <FontAwesome name="pencil" size={28} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.avatarContour}>
            <View style={styles.avatar}>
              <FontAwesome
                name="user"
                size={100}
                color="black"
                style={styles.icon}
                accessibilityLabel="Avatar"
                accessibilityRole="Image"
              />
            </View>
          </View>

          <View style={styles.body}>
            <Text style={styles.optionText}>Informations sur le compte</Text>
          </View>
          <TouchableOpacity
            style={styles.optionButtonDown}
            accessibilityLabel="Modifier son nom complet"
            accessibilityRole="button"
          >
            <View style={styles.optionButtonContent}>
              <View>
                <Text style={styles.optionButtonText}>Nom Complet</Text>
                <Text style={styles.optionButtonText2}>
                  Appuyez pour modifier
                </Text>
              </View>
              <View>
                <FontAwesome name="chevron-right" size={28} color="black" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.body}>
            <Text style={styles.optionText}>Informations de connexion</Text>
          </View>

          <TouchableOpacity
            style={styles.optionButton}
            accessibilityLabel="Modifier son mail"
            accessibilityRole="button"
          >
            <View style={styles.optionButtonContent}>
              <View>
                <Text style={styles.optionButtonText}>Adresse e-mail</Text>
                <Text style={styles.optionButtonText2}>john.doe@gmail.com</Text>
              </View>
              <View>
                <FontAwesome name="chevron-right" size={28} color="black" />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            accessibilityLabel="Modifier le nom d'utilisateur"
            accessibilityRole="button"
          >
            <View style={styles.optionButtonContent}>
              <View>
                <Text style={styles.optionButtonText}>Nom d'utilisateur</Text>
                <Text style={styles.optionButtonText2}>
                  Appuyez pour ajouter
                </Text>
              </View>
              <View>
                <FontAwesome name="chevron-right" size={28} color="black" />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButtonDown}
            accessibilityLabel="Modifier le mot de passe"
            accessibilityRole="button"
          >
            <View style={styles.optionButtonContent}>
              <View>
                <Text style={styles.optionButtonText}>Mot de passe</Text>
                <Text style={styles.optionButtonText2}>
                  Modifier le mot de passe
                </Text>
              </View>
              <View>
                <FontAwesome name="chevron-right" size={28} color="black" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.body}>
            <Text style={styles.optionText}>Avancé</Text>
          </View>

          <TouchableOpacity
            style={styles.optionButton}
            accessibilityLabel="Se déconnecter"
            accessibilityRole="button"
            onPress={handleLogout}
          >
            <View style={styles.optionButtonContent}>
              <View>
                <Text style={styles.optionButtonText}>Se déconnecter</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButtonDown}
            accessibilityLabel="Supprimer le compte"
            accessibilityRole="button"
          >
            <View style={styles.optionButtonContent}>
              <View>
                <Text style={styles.optionButtonDelete}>
                  Supprimer le compte
                </Text>
              </View>
              <View>
                <FontAwesome name="chevron-right" size={28} color="black" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    width: "100%",
    textAlign: "left",
    fontSize: 30,
    fontWeight: "550",
    color: "black",
    textShadowColor: "grey",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginLeft: 30,
  },
  logContent: {
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    width: "100%",
    alignItems: "center",
  },
  avatarContour: {
    width: 170,
    height: 170,
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "#DFF0FF",
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    marginTop: 30,
    alignSelf: "flex-start",
    paddingLeft: 10,
  },
  optionButton: {
    backgroundColor: "white",
    width: "100%",
    height: 60,
    justifyContent: "center",
    borderTopWidth: 1,
    borderColor: "black",
  },
  optionButtonDown: {
    backgroundColor: "white",
    width: "100%",
    height: 60,
    justifyContent: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "black",
  },
  optionButtonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 5,
  },
  optionButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  optionButtonText2: {
    fontSize: 16,
    marginLeft: 10,
  },
  optionButtonDelete: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
    color: "red",
  },
  optionText: {
    fontSize: 16,
  },
  optionAvatar: {
    top: 40,
    left: 55,
    position: "relative",
    backgroundColor: "#DFF0FF",
    width: 40,
    height: 40,
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 4,
    zIndex: 2,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
