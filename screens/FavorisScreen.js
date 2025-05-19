import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

export default function FavorisScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.logContent}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      ></KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logContent: {
    position: "absolute",
    top: "20%",
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
    height: 450,
    borderRadius: 20,
  },
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
    marginTop: 10,
  },
});
