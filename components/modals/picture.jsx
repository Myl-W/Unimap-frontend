import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";

export default function Picture({ visible, onClose, picture }) {
  // utilisation des props 'visible','onClose' et picture pour gérer l'ouverture/fermeture et l'affichage
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {picture ? (
            <Image
              source={{ uri: picture }}
              style={{
                width: "95%",
                height: "90%",
                borderRadius: 20,
              }}
              resizeMode="contain"
            />
          ) : (
            <Text>Aucune image</Text>
          )}
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: "blue" }}>Fermer</Text>
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
    justifyContent: "center",
    borderRadius: 20,
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});
