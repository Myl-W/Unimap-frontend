import { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Keyboard,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  setFavorites,
  addFavorite,
  updateFavorite,
  deleteFavorite,
} from "../reducers/user";
import { setSearchAddress } from "../reducers/trips";
import Constants from "expo-constants";
import polyline from "@mapbox/polyline";

export default function FavorisScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addressName, setAddressName] = useState("");
  const [address, setAddress] = useState("");
  const [editingFavorite, setEditingFavorite] = useState(null);
  const token = useSelector((state) => state.user.profile.token);
  const favorites = useSelector((state) => state.user.value.favorites) || [];
  const dispatch = useDispatch();
  const BACK_URL = Constants.expoConfig?.extra?.BACK_URL;
  const google = Constants.expoConfig?.extra?.API_GOOGLE;
  const loc = useSelector((state) => state.trips.value);
  const transport = useSelector((state) => state.trips.selectedTransport);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${BACK_URL}/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.result) {
          dispatch(setFavorites(data.favorites)); // Met à jour le store Redux avec les favoris récupérés
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris:", error);
      }
    };
    // Vérifie si le token existe et si oui, récupère les favoris depuis l'API
    if (token) {
      fetchFavorites();
    }
  }, [token]);

  const handleAddFavorite = async () => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${loc.latitude},${loc.longitude}&destination=${address}&mode=${transport}&key=${google}`
      );
      const data1 = await res.json();
      const arrival = data1.routes[0].legs[0].end_address;

      const response = await fetch(`${BACK_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: addressName,
          address: arrival,
        }),
      });

      const data = await response.json();
      if (data.result) {
        dispatch(addFavorite(data.favorite));
        setModalVisible(false);
        setAddressName("");
        setAddress("");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris:", error);
    }
  };

  const handleEditFavorite = async () => {
    try {
      // Trouver l'index du favori dans le tableau
      const favoriteIndex = favorites.findIndex(
        (fav) => fav._id === editingFavorite._id
      );

      const response = await fetch(`${BACK_URL}/favorites/${favoriteIndex}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: addressName,
          address: address,
        }),
      });

      const data = await response.json();
      if (data.result) {
        dispatch(
          updateFavorite({
            id: editingFavorite._id,
            updatedFavorite: data.favorite,
          })
        );
        setEditModalVisible(false);
        setEditingFavorite(null);
        setAddressName("");
        setAddress("");
      }
    } catch (error) {
      console.error("Erreur lors de la modification du favori:", error);
    }
  };

  const handleDeleteFavorite = async (id) => {
    try {
      const response = await fetch(`${BACK_URL}/favorites/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.result) {
        dispatch(deleteFavorite(id));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du favori:", error);
    }
  };
  // Ouvre le modal de modification pour un favori existant
  const openEditModal = (favorite) => {
    setEditingFavorite(favorite);
    setAddressName(favorite.name);
    setAddress(favorite.address);
    setEditModalVisible(true);
  };
  // Ferme le clavier lorsque l'utilisateur appuie sur "Done"
  const handleSubmitEditing = () => {
    Keyboard.dismiss();
  };

  // Démarre la navigation vers la carte avec l'adresse du favori
  const handleStartNavigation = (favorite) => {
    dispatch(
      setSearchAddress({
        address: favorite.address,
        fromFavorites: true,
      })
    );
    navigation.navigate("MapScreen");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Ajouter une adresse favorite</Text>
      </TouchableOpacity>

      <ScrollView style={styles.favoritesList}>
        {favorites?.map((favorite, index) => (
          <TouchableOpacity
            key={favorite._id || index}
            style={styles.favoriteItem}
            onPress={() => handleStartNavigation(favorite)}
          >
            <View style={styles.favoriteInfo}>
              <Text style={styles.favoriteName}>{favorite.name}</Text>
              <Text style={styles.favoriteAddress}>{favorite.address}</Text>
            </View>
            <View style={styles.favoriteActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  openEditModal(favorite);
                }}
              >
                <FontAwesome name="pencil" size={20} color="#3498db" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleDeleteFavorite(favorite._id);
                }}
              >
                <FontAwesome name="trash" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal d'ajout */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter une adresse favorite</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom du lieu"
              placeholderTextColor="#3498db"
              value={addressName}
              onChangeText={setAddressName}
              returnKeyType="done"
              onSubmitEditing={handleSubmitEditing}
              blurOnSubmit={true}
            />
            <TextInput
              style={styles.input}
              placeholder="Adresse"
              placeholderTextColor="#3498db"
              value={address}
              onChangeText={setAddress}
              multiline
              blurOnSubmit={true}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddFavorite}
              >
                <Text style={styles.buttonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de modification */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier l'adresse favorite</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom du lieu"
              placeholderTextColor="#3498db"
              value={addressName}
              onChangeText={setAddressName}
              returnKeyType="done"
              onSubmitEditing={handleSubmitEditing}
              blurOnSubmit={true}
            />
            <TextInput
              style={styles.input}
              placeholder="Adresse"
              placeholderTextColor="#3498db"
              value={address}
              onChangeText={setAddress}
              multiline
              blurOnSubmit={true}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleEditFavorite}
              >
                <Text style={styles.buttonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    padding: 15,
    margin: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  favoritesList: {
    flex: 1,
    padding: 15,
  },
  favoriteItem: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  favoriteAddress: {
    fontSize: 14,
    color: "#666",
  },
  favoriteActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 10,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "#3498db",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 18,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#2ecc71",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
