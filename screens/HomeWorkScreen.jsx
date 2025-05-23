import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import { setHomeAddress, setWorkAddress } from "../reducers/trips";

export default function HomeWorkScreen({ navigation }) {
  const dispatch = useDispatch();
  const homeAddress = useSelector((state) => state.trips.homeAddress);
  const workAddress = useSelector((state) => state.trips.workAddress);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalType, setModalType] = React.useState(null); // "home" ou "work"
  const [addressInput, setAddressInput] = React.useState("");

  const handleSetHome = () => {
    setModalType("home");
    setAddressInput(homeAddress || "");
    setModalVisible(true);
  };

  const handleSetWork = () => {
    setModalType("work");
    setAddressInput(workAddress || "");
    setModalVisible(true);
  };

  const handleValidate = () => {
    if (modalType === "home") dispatch(setHomeAddress(addressInput));
    if (modalType === "work") dispatch(setWorkAddress(addressInput));
    setModalVisible(false);
  };

  const handleDelete = () => {
    if (modalType === "home") dispatch(setHomeAddress(null));
    if (modalType === "work") dispatch(setWorkAddress(null));
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Domicile & Travail</Text>

      {/* Modal for address input */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 24,
              width: "80%",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 12 }}>
              {modalType === "home" ? "Adresse domicile" : "Adresse travail"}
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 12,
                width: "100%",
                marginBottom: 16,
              }}
              placeholder="Tapez votre adresse..."
              value={addressInput}
              onChangeText={setAddressInput}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#3498db",
                borderRadius: 8,
                padding: 12,
                width: "100%",
                alignItems: "center",
              }}
              onPress={handleValidate}
              disabled={!addressInput.trim()}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Valider</Text>
            </TouchableOpacity>
            {((modalType === "home" && homeAddress) ||
              (modalType === "work" && workAddress)) && (
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  backgroundColor: "#e74c3c",
                  borderRadius: 8,
                  padding: 12,
                  width: "100%",
                  alignItems: "center",
                }}
                onPress={handleDelete}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Supprimer l'adresse
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: "#3498db",
                borderRadius: 8,
                padding: 12,
                width: "100%",
                alignItems: "center",
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Section Domicile */}
      <View style={styles.section}>
        <FontAwesome name="home" size={32} color="#3498db" />
        <View style={styles.addressBlock}>
          <Text style={styles.label}>Domicile</Text>
          {homeAddress ? (
            <Text style={styles.address}>{homeAddress}</Text>
          ) : (
            <Text style={styles.noAddress}>Aucune adresse enregistrée</Text>
          )}
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={handleSetHome}>
          <FontAwesome
            name={homeAddress ? "pencil" : "plus"}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* Section Travail */}
      <View style={styles.section}>
        <FontAwesome name="briefcase" size={32} color="#e67e22" />
        <View style={styles.addressBlock}>
          <Text style={styles.label}>Travail</Text>
          {workAddress ? (
            <Text style={styles.address}>{workAddress}</Text>
          ) : (
            <Text style={styles.noAddress}>Aucune adresse enregistrée</Text>
          )}
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={handleSetWork}>
          <FontAwesome
            name={workAddress ? "pencil" : "plus"}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    alignSelf: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  addressBlock: { flex: 1, marginLeft: 16 },
  label: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  address: { fontSize: 16, color: "#222" },
  noAddress: { fontSize: 16, color: "#aaa" },
  editBtn: {
    backgroundColor: "#3498db",
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
  },
});
