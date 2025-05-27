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
import { setHomeAddress, setWorkAddress } from "../reducers/user";
import React, { useState } from "react";
import Constants from "expo-constants";

export default function HomeWorkScreen() {
  const dispatch = useDispatch();
  const homeAddress = useSelector((state) => state.user.value.homeAddress);
  const workAddress = useSelector((state) => state.user.value.workAddress);
  const token = useSelector((state) => state.user.profile.token);
  const BACK_URL = Constants.expoConfig?.extra?.BACK_URL;  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // "home" ou "work"
  const [addressInput, setAddressInput] = useState("");

  const handleSetHome = () => {
    // Indique que la modal sert à éditer l'adresse "domicile"
    setModalType("home");
    // Pré-remplit le champ de saisie avec l'adresse domicile existante (ou vide si aucune)
    setAddressInput(homeAddress || "");
      // Affiche la modal à l'écran
    setModalVisible(true);
  };

  const handleSetWork = () => {
    setModalType("work");
    setAddressInput(workAddress || "");
    setModalVisible(true);
  };
    // Fonction pour valider l'adresse saisie
  const handleValidate = async () => {
    let body = {}
    if (modalType === "home") body.homeAddress = addressInput;
    if (modalType === "work") body.workAddress = addressInput;

  try {
    const response = await fetch(`${BACK_URL}/address`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  if (data.homeAddress !== undefined || data.workAddress !== undefined) {
    if (modalType === "home") dispatch(setHomeAddress(addressInput));
    if (modalType === "work") dispatch(setWorkAddress(addressInput));
    setModalVisible(false);
  } else {
    alert("Erreur lors de la mise à jour de l'adresse !");
  }
  } catch (error) {
    alert("Erreur réseau ou serveur !");
    console.error("Erreur lors de la mise à jour de l'adresse :", error);
  }
}


    // Fonction pour supprimer l'adresse
const handleDelete = async () => {
  let body = {};
  if (modalType === "home") body.homeAddress = null;
  if (modalType === "work") body.workAddress = null;

  try {
    const response = await fetch(`${BACK_URL}/address`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (data.homeAddress !== undefined || data.workAddress !== undefined) {
      if (modalType === "home") dispatch(setHomeAddress(null));
      if (modalType === "work") dispatch(setWorkAddress(null));
      setModalVisible(false);
    } else {
      alert("Erreur lors de la suppression de l'adresse !");
    }
  } catch (error) {
    alert("Erreur réseau ou serveur !");
    console.error("Erreur lors de la suppression de l'adresse :", error);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Domicile & Travail</Text>

      {/* Modal for address input */}
      <Modal
        // Affiche la modal si modalVisible est true
        visible={modalVisible}
        // Animation d'ouverture de la modal
        animationType="slide"
        // Rend le fond de la modal transparent pour voir l'écran derrière
        transparent
        // Ferme la modal quand l'utilisateur appuie sur "Annuler"
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
              padding: 24,// Espace intérieur
              width: "80%",
              alignItems: "center",
            }}
          > 
            {/* Titre de la modal, change selon le type */}
            <Text style={{ fontSize: 18, marginBottom: 12 }}>
              {modalType === "home" ? "Adresse domicile" : "Adresse travail"}
            </Text>
            {/* Champ de saisie pour l'adresse */}
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
              placeholderTextColor={"#aaa"}
              value={addressInput}// Valeur du champ
              onChangeText={setAddressInput}// Met à jour l'état à chaque frappe
            />
            {/* Bouton Valider, désactivé si le champ est vide */}
            <TouchableOpacity
              style={{
                backgroundColor: "#3498db",
                borderRadius: 8,
                padding: 12,
                width: "100%",
                alignItems: "center",
              }}
              onPress={handleValidate}
              // Désactive le bouton si le champ est vide ou ne contient que des espaces
              disabled={!addressInput.trim()}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Valider</Text>
            </TouchableOpacity>   

            {/* Bouton Supprimer l'adresse, affiché seulement si une adresse existe */}
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

            {/* Bouton Annuler pour fermer la modal */}
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
  },
  addressBlock: { 
    flex: 1, marginLeft: 16
},
  label: { 
    fontSize: 18, fontWeight: "bold", marginBottom: 4
},
  address: {
     fontSize: 16, color: "#222" 
},
  noAddress: { 
    fontSize: 16, color: "#aaa" 
},
  editBtn: {
    backgroundColor: "#3498db",
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
},
});
