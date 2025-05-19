import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Text from "../assets/fonts/CustomText";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ParametreScreen from "./ParametreScreen";
import { Component } from "react";

export default function CompteScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text
            style={styles.title}
            accessibilityLabel="Nombre de points"
            accessibilityRole="number"
          >
            Points
          </Text>

          <View style={styles.avatarContainer}>
            <View style={styles.point}>
              <View style={styles.pointContent}>
                <Text style={styles.number}>#9999</Text>
              </View>
            </View>
            <View style={styles.avatar}>
              <FontAwesome
                name="user"
                size={150}
                color="black"
                style={styles.icon}
                accessibilityLabel="Photo d'identité"
                accessibilityRole="Image"
              />
            </View>
          </View>

          <View style={styles.bodyContainer}>
            <Text style={styles.bodyText}>
              <Text
                style={styles.bold}
                accessibilityLabel="Prénom"
                accessibilityRole="text"
              >
                Prénom:{" "}
              </Text>
              John
            </Text>
            <Text style={styles.bodyText}>
              <Text
                style={styles.bold}
                accessibilityLabel="Nom"
                accessibilityRole="text"
              >
                Nom:{" "}
              </Text>
              Doe
            </Text>
            <Text style={styles.bodyText}>
              <Text
                style={styles.bold}
                accessibilityLabel="Age"
                accessibilityRole="text"
              >
                Âge:{" "}
              </Text>
              22 ans
            </Text>
            <View style={styles.bodyTextColumn}>
              <Text
                style={styles.bold}
                accessibilityLabel="Date de naissance"
                accessibilityRole="text"
              >
                Date de naissance:
              </Text>
              <Text style={styles.bodyText}>01/01/2003</Text>
            </View>
            <View style={styles.bodyTextColumn}>
              <Text
                style={styles.bold}
                accessibilityLabel="Email"
                accessibilityRole="text"
              >
                Email:
              </Text>
              <Text style={styles.bodyText}>john.doe@gmail.com</Text>
            </View>
            <View style={styles.bodyTextColumn}>
              <Text
                style={styles.bold}
                accessibilityLabel="Téléphone"
                accessibilityRole="text"
              >
                Téléphone:
              </Text>
              <Text style={styles.bodyText}>06.99.99.99.99</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.optionButton}
              accessibilityLabel="Adresse domicile et travail"
              accessibilityRole="button"
            >
              <View style={styles.iconTextRow}>
                <FontAwesome
                  name="home"
                  size={24}
                  color="black"
                  style={styles.icon}
                />
                <Text style={styles.optionButtonText}>Domicile</Text>

                <Text style={styles.optionButtonText}> / </Text>

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

          <View style={styles.footer}>
            <TouchableOpacity
              accessibilityLabel="Aller aux paramètres"
              accessibilityRole="button"
              style={styles.optionButton}
              onPress={() => navigation.navigate("Parametre")}
            >
              <Text style={styles.optionButtonText}>
                <FontAwesome
                  name="gear"
                  size={24}
                  color="black"
                  accessibilityLabel="Parametre"
                  accessibilityRole="image"
                />{" "}
                Paramètres
              </Text>
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
    backgroundColor: "#f0f0f0",
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 20,
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
    marginTop: 5,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#DFF0FF",
    padding: 20,
    height: "100%",
  },
});
