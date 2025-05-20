import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

export default function AddSignalement({ navigation }) {
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
    backgroundColor: "white",
  },
  logContent: {
    backgroundColor: "white",
  },
});
