import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";

export default function Popup({ visible, onClose }) {
  // utilisation des props 'visible' et 'onClose' pour gérer l'ouverture/fermeture
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>En cours de développement 🛠</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ marginTop: 20, color: "blue" }}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
  },
});
