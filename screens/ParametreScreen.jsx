import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addProfilePhoto, resetUser, updateUser } from "../reducers/user";

// Composants natifs pour la mise en page
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Import des fonctionnalités de gestion d'image (galerie et appareil photo)
import * as ImagePicker from "expo-image-picker";

// Hooks React
import { useState } from "react";

// Composant natif pour afficher des images
import { Image } from "react-native";

import Constants from "expo-constants"; // Pour accéder aux variables d'environnement définies dans le fichier app.config.js

export default function ParametreScreen({ navigation }) {
  const dispatch = useDispatch();

  // Récupération des infos de l'utilisateur dans le store Redux
  const userPhoto = useSelector((state) => state.user.profile.profilePhoto);
  const userInfo = useSelector((state) => state.user.profile); // Infos utilisateur (email, token, etc.)
  const BACK_URL = Constants.expoConfig?.extra?.BACK_URL; // URL du backend, récupérée depuis les variables d'environnement

  // État local pour stocker l'URI de l'image de profil
  const [profileImage, setProfileImage] = useState(null);

  // États pour les modales
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [isUsernameModalVisible, setIsUsernameModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  // États pour les formulaires
  const [emailForm, setEmailForm] = useState(userInfo.email);
  const [nameForm, setNameForm] = useState({
    firstname: userInfo.firstname,
    lastname: userInfo.lastname,
  });
  const [usernameForm, setUsernameForm] = useState(userInfo.username);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);

  // ------------------- GESTION DE LA DÉCONNEXION -------------------

  // Affichage d'une alerte pour confirmer la déconnexion
  const handleLogout = () => {
    Alert.alert(
      "Se déconnecter",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Se déconnecter", style: "destructive", onPress: logoutAsync },
      ],
      { cancelable: true }
    );
  };

  // Suppression du token et redirection vers l'écran de login
  const logoutAsync = async () => {
    try {
      await AsyncStorage.removeItem("userToken"); // Supprime le token stocké localement
      dispatch(resetUser()); // Réinitialise l'état utilisateur dans Redux
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }], // Redirige vers l'écran Login
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  // ------------------- GESTION DE LA PHOTO DE PROFIL -------------------
  const uploadProfileImage = async (uri) => {
    const formData = new FormData();
    formData.append("photo", {
      uri,
      name: "profile.jpg",
      type: "image/jpeg",
    });

    const response = await fetch(`${BACK_URL}/profile/photo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: formData,
    });
    const data = await response.json();
    if (data.result) {
      setProfileImage(data.photo);
      dispatch(addProfilePhoto(data.photo)); // Met à jour l'image de profil dans le store Redux
    }
  };

  // Ouvre la galerie d'images du téléphone
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission refusée pour accéder à la galerie !");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      await uploadProfileImage(result.assets[0].uri); // Envoie l'image sélectionnée au serveur
    }
  };

  // Lance l'appareil photo pour prendre une nouvelle photo de profil
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission refusée pour utiliser la caméra !");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      await uploadProfileImage(result.assets[0].uri);
    }
  };

  // Supprime la photo de profil (localement et potentiellement côté serveur)
  const deleteProfileImage = async () => {
    Alert.alert(
      "Supprimer la photo de profil",
      "Êtes-vous sûr de vouloir supprimer votre photo de profil ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              setProfileImage(null); // Supprime l'image du state local
              await AsyncStorage.removeItem("profileImage"); // Supprime l'image du stockage local
              // Optionnel : Appeler l'API pour suppression côté serveur
              Alert.alert("Succès", "Photo de profil supprimée");
            } catch (error) {
              console.error("Erreur lors de la suppression:", error);
              Alert.alert("Erreur", "La suppression a échoué");
            }
          },
        },
      ]
    );
  };

  // Affiche un menu avec les options liées à la photo de profil
  const showImagePickerOptions = () => {
    const options = [
      { text: "Prendre une photo", onPress: takePhoto },
      { text: "Choisir depuis la galerie", onPress: pickImage },
    ];

    // Affiche l'option de suppression uniquement si une image est définie
    if (profileImage) {
      options.push({
        text: "Supprimer la photo",
        style: "destructive",
        onPress: deleteProfileImage,
      });
    }

    options.push({ text: "Annuler", style: "cancel" });

    Alert.alert(
      "Changer la photo de profil",
      "Choisissez une option",
      options,
      { cancelable: true }
    );
  };

  // Fonction générique pour mettre à jour n'importe quelle information du profil
  // Le paramètre data contient les champs à mettre à jour (email, username, etc.)
  const handleUpdate = async (data) => {
    try {
      // Appel à l'API pour mettre à jour le profil
      console.log("Token envoyé:", userInfo.token); // Pour déboguer
      const response = await fetch(`${BACK_URL}/profile/update`, {
        method: "PUT", // Méthode HTTP PUT pour mettre à jour des données
        headers: {
          "Content-Type": "application/json", // Format des données envoyées
          Authorization: `Bearer ${userInfo.token}`, // Token d'authentification
        },
        body: JSON.stringify(data), // Conversion des données en format JSON
      });

      // Conversion de la réponse du serveur en objet JavaScript
      const result = await response.json();

      if (result.result) {
        // Si la mise à jour est réussie
        dispatch(
          updateUser({
            ...result.user,
            token: result.token, // On inclut le nouveau token dans les données utilisateur
          })
        );
        Alert.alert("Succès", "Mise à jour effectuée avec succès");
        return true; // Retourne true pour indiquer le succès aux composants appelants
      } else {
        // Si la mise à jour a échoué
        setError(result.error); // Affiche le message d'erreur reçu du serveur
        return false; // Retourne false pour indiquer l'échec aux composants appelants
      }
    } catch (error) {
      // En cas d'erreur lors de la requête
      console.error("Erreur lors de la mise à jour:", error);
      setError("Une erreur est survenue"); // Message d'erreur générique pour l'utilisateur
      return false; // Retourne false en cas d'erreur
    }
  };

  // Fonction spéciale pour la mise à jour du mot de passe
  const handlePasswordUpdate = async () => {
    try {
      // Vérifie que tous les champs du formulaire sont remplis
      if (
        !passwordForm.oldPassword ||
        !passwordForm.newPassword ||
        !passwordForm.confirmPassword
      ) {
        setError("Tous les champs sont obligatoires");
        return;
      }

      // Vérifie que le nouveau mot de passe et sa confirmation correspondent
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError("Les nouveaux mots de passe ne correspondent pas");
        return;
      }

      // Appel à l'API pour mettre à jour le mot de passe
      const response = await fetch(`${BACK_URL}/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword, // Ancien mot de passe pour vérification
          password: passwordForm.newPassword, // Nouveau mot de passe
        }),
      });

      // Traitement de la réponse du serveur
      const result = await response.json();

      if (result.result) {
        // Si la mise à jour est réussie
        setIsPasswordModalVisible(false); // Ferme la modale
        setError(null); // Réinitialise les erreurs
        setPasswordForm({
          oldPassword: "", // Réinitialise tous les champs du formulaire
          newPassword: "",
          confirmPassword: "",
        });
        Alert.alert("Succès", "Mot de passe mis à jour avec succès");
      } else {
        // Si la mise à jour a échoué
        setError(result.error || "Ancien mot de passe incorrect");
      }
    } catch (error) {
      // En cas d'erreur lors de la requête
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      setError("Une erreur est survenue");
    }
  };

  // Fonction de suppression de compte
  const handleDeleteAccount = async () => {
    try {
      // Vérifie que le mot de passe est rempli
      if (!deletePassword) {
        setError("Le mot de passe est requis pour supprimer le compte");
        return;
      }

      // Appel à l'API pour supprimer le compte
      const response = await fetch(`${BACK_URL}/profile/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ password: deletePassword }), // Envoi du mot de passe pour confirmation
      });

      // Parse la réponse du serveur
      const result = await response.json();

      if (result.result) {
        // Si la suppression est réussie
        await AsyncStorage.removeItem("userToken"); // Supprime le token stocké localement
        dispatch(resetUser());
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }], // Redirige vers l'écran Login
        });
      } else {
        setError(result.error);
      }
    } catch (error) {
      // En cas d'erreur lors de la requête
      console.error("Erreur lors de la suppression du compte:", error);
      setError(
        "Une erreur inattendue est survenue. Veuillez réessayer plus tard."
      );
    }
  };

  // ------------------- RENDU VISUEL -------------------

  return (
    <KeyboardAvoidingView
      style={styles.logContent}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {/* Bouton pour modifier l'avatar */}
        <View>
          <TouchableOpacity
            style={styles.optionAvatar}
            accessibilityLabel="Modifier son avatar"
            accessibilityRole="button"
            onPress={showImagePickerOptions}
          >
            <View style={styles.optionButtonContent}>
              <FontAwesome name="pencil" size={28} color="black" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Affichage de la photo ou icône par défaut */}
        <View style={styles.avatarContour}>
          {userPhoto ? (
            <Image
              source={{ uri: userPhoto }}
              style={styles.avatar}
              accessibilityLabel="Photo de profil"
            />
          ) : (
            <View style={styles.avatar}>
              <FontAwesome
                name="user"
                size={100}
                color="black"
                style={styles.icon}
                accessibilityLabel="Avatar"
                accessibilityRole="image"
              />
            </View>
          )}
        </View>

        {/* Infos compte */}
        <View style={styles.body}>
          <Text style={styles.optionText}>Informations sur le compte</Text>
        </View>

        {/* Nom complet */}
        <TouchableOpacity
          style={styles.optionButtonDown}
          accessibilityLabel="Modifier son nom complet"
          accessibilityRole="button"
          onPress={() => setIsNameModalVisible(true)}
        >
          <View style={styles.optionButtonContent}>
            <View>
              <Text style={styles.optionButtonText}>Nom Complet</Text>
              <Text style={styles.optionButtonText2}>
                {userInfo.firstname} {userInfo.lastname}
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={28} color="black" />
          </View>
        </TouchableOpacity>

        {/* Infos connexion */}
        <View style={styles.body}>
          <Text style={styles.optionText}>Informations de connexion</Text>
        </View>

        {/* Adresse e-mail */}
        <TouchableOpacity
          style={styles.optionButton}
          accessibilityLabel="Modifier son mail"
          accessibilityRole="button"
          onPress={() => setIsEmailModalVisible(true)}
        >
          <View style={styles.optionButtonContent}>
            <View>
              <Text style={styles.optionButtonText}>Adresse e-mail</Text>
              <Text style={styles.optionButtonText2}>{userInfo.email}</Text>
            </View>
            <FontAwesome name="chevron-right" size={28} color="black" />
          </View>
        </TouchableOpacity>

        {/* Nom d'utilisateur */}
        <TouchableOpacity
          style={styles.optionButton}
          accessibilityLabel="Modifier le nom d'utilisateur"
          accessibilityRole="button"
          onPress={() => setIsUsernameModalVisible(true)}
        >
          {userInfo.username ? (
            <View style={styles.optionButtonContent}>
              <View>
                <Text style={styles.optionButtonText}>Nom d'utilisateur</Text>
                <Text style={styles.optionButtonText2}>
                  {userInfo.username}
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={28} color="black" />
            </View>
          ) : (
            <View style={styles.optionButtonContent}>
              <View>
                <Text style={styles.optionButtonText}>Nom d'utilisateur</Text>
                <Text style={styles.optionButtonText2}>
                  {"Appuyez pour ajouter"}
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={28} color="black" />
            </View>
          )}
        </TouchableOpacity>

        {/* Mot de passe */}
        <TouchableOpacity
          style={styles.optionButtonDown}
          accessibilityLabel="Modifier le mot de passe"
          accessibilityRole="button"
          onPress={() => setIsPasswordModalVisible(true)}
        >
          <View style={styles.optionButtonContent}>
            <View>
              <Text style={styles.optionButtonText}>Mot de passe</Text>
              <Text style={styles.optionButtonText2}>
                Modifier le mot de passe
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={28} color="black" />
          </View>
        </TouchableOpacity>

        {/* Section avancée */}
        <View style={styles.body}>
          <Text style={styles.optionText}>Avancé</Text>
        </View>

        {/* Bouton de déconnexion */}
        <TouchableOpacity
          style={styles.optionButton}
          accessibilityLabel="Se déconnecter"
          accessibilityRole="button"
          onPress={handleLogout}
        >
          <View style={styles.optionButtonContent}>
            <Text style={styles.optionButtonText}>Se déconnecter</Text>
          </View>
        </TouchableOpacity>

        {/* Suppression de compte */}
        <TouchableOpacity
          style={styles.optionButtonDown}
          accessibilityLabel="Supprimer le compte"
          accessibilityRole="button"
          onPress={() => {
            Alert.alert(
              "Supprimer le compte",
              "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
              [
                { text: "Annuler", style: "cancel" },
                {
                  text: "Supprimer",
                  style: "destructive",
                  onPress: () => setIsDeleteModalVisible(true),
                },
              ]
            );
          }}
        >
          <View style={styles.optionButtonContent}>
            <Text style={styles.optionButtonDelete}>Supprimer le compte</Text>
            <FontAwesome name="chevron-right" size={28} color="black" />
          </View>
        </TouchableOpacity>

        {/* Modal pour l'email */}
        <Modal
          visible={isEmailModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Modifier l'email</Text>
              {error && <Text style={styles.errorText}>{error}</Text>}
              <TextInput
                style={styles.modalInput}
                value={emailForm}
                onChangeText={setEmailForm}
                placeholder="Entrez votre nouvelle adresse email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setIsEmailModalVisible(false);
                    setError(null);
                    setEmailForm(userInfo.email);
                  }}
                >
                  <Text style={styles.modalButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={async () => {
                    if (!emailForm?.trim()) {
                      setError("L'email est obligatoire");
                      return;
                    }
                    const success = await handleUpdate({
                      email: emailForm.trim(),
                    });
                    if (success) {
                      setIsEmailModalVisible(false);
                      setError(null);
                    }
                  }}
                >
                  <Text style={styles.modalButtonText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal pour le nom complet */}
        <Modal
          visible={isNameModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Modifier le nom complet</Text>
              {error && <Text style={styles.errorText}>{error}</Text>}
              <TextInput
                style={styles.modalInput}
                value={nameForm.firstname}
                onChangeText={(text) =>
                  setNameForm({ ...nameForm, firstname: text })
                }
                placeholder="Entrez votre prénom"
                placeholderTextColor="#666"
              />
              <TextInput
                style={styles.modalInput}
                value={nameForm.lastname}
                onChangeText={(text) =>
                  setNameForm({ ...nameForm, lastname: text })
                }
                placeholder="Entrez votre nom"
                placeholderTextColor="#666"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setIsNameModalVisible(false);
                    setError(null);
                    setNameForm({
                      firstname: userInfo.firstname,
                      lastname: userInfo.lastname,
                    });
                  }}
                >
                  <Text style={styles.modalButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={async () => {
                    if (
                      !nameForm.firstname?.trim() ||
                      !nameForm.lastname?.trim()
                    ) {
                      setError("Le prénom et le nom sont obligatoires");
                      return;
                    }
                    const success = await handleUpdate({
                      firstname: nameForm.firstname.trim(),
                      lastname: nameForm.lastname.trim(),
                    });
                    if (success) {
                      setIsNameModalVisible(false);
                      setError(null);
                    }
                  }}
                >
                  <Text style={styles.modalButtonText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal pour le nom d'utilisateur */}
        <Modal
          visible={isUsernameModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Modifier le nom d'utilisateur
              </Text>
              {error && <Text style={styles.errorText}>{error}</Text>}
              <TextInput
                style={styles.modalInput}
                value={usernameForm}
                onChangeText={setUsernameForm}
                placeholder="Entrez votre nom d'utilisateur (optionnel)"
                placeholderTextColor="#666"
                autoCapitalize="none"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setIsUsernameModalVisible(false);
                    setError(null);
                    setUsernameForm(userInfo.username);
                  }}
                >
                  <Text style={styles.modalButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={async () => {
                    const success = await handleUpdate({
                      username: usernameForm,
                    });
                    if (success) {
                      setIsUsernameModalVisible(false);
                      setError(null);
                    }
                  }}
                >
                  <Text style={styles.modalButtonText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>

              {/* Bouton de suppression - visible uniquement si un username existe */}
              {userInfo.username && (
                <TouchableOpacity
                  style={[styles.deleteButton, { marginTop: 20 }]}
                  onPress={() => {
                    Alert.alert(
                      "Supprimer le nom d'utilisateur",
                      "Êtes-vous sûr de vouloir supprimer votre nom d'utilisateur ?",
                      [
                        {
                          text: "Annuler",
                          style: "cancel",
                        },
                        {
                          text: "Supprimer",
                          style: "destructive",
                          onPress: async () => {
                            const success = await handleUpdate({
                              username: null,
                            });
                            if (success) {
                              setIsUsernameModalVisible(false);
                              setError(null);
                              setUsernameForm("");
                            }
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Text style={styles.deleteButtonText}>
                    Supprimer le nom d'utilisateur
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>

        {/* Modal pour le mot de passe */}
        <Modal
          visible={isPasswordModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Modifier le mot de passe</Text>
              {error && <Text style={styles.errorText}>{error}</Text>}
              <TextInput
                style={styles.modalInput}
                value={passwordForm.oldPassword}
                onChangeText={(text) =>
                  setPasswordForm({ ...passwordForm, oldPassword: text })
                }
                placeholder="Entrez votre mot de passe actuel"
                placeholderTextColor="#666"
                secureTextEntry
              />
              <TextInput
                style={styles.modalInput}
                value={passwordForm.newPassword}
                onChangeText={(text) =>
                  setPasswordForm({ ...passwordForm, newPassword: text })
                }
                placeholder="Entrez votre nouveau mot de passe"
                placeholderTextColor="#666"
                secureTextEntry
              />
              <TextInput
                style={styles.modalInput}
                value={passwordForm.confirmPassword}
                onChangeText={(text) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: text })
                }
                placeholder="Confirmez votre nouveau mot de passe"
                placeholderTextColor="#666"
                secureTextEntry
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setIsPasswordModalVisible(false);
                    setError(null);
                    setPasswordForm({
                      oldPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                >
                  <Text style={styles.modalButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handlePasswordUpdate}
                >
                  <Text style={styles.modalButtonText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal pour la suppression du compte */}
        <Modal
          visible={isDeleteModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Supprimer le compte</Text>
              <Text style={styles.modalText}>
                Pour confirmer la suppression de votre compte, veuillez entrer
                votre mot de passe :
              </Text>
              {error && <Text style={styles.errorText}>{error}</Text>}
              <TextInput
                style={styles.modalInput}
                value={deletePassword}
                onChangeText={setDeletePassword}
                placeholder="Entrez votre mot de passe"
                placeholderTextColor="#666"
                secureTextEntry
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setIsDeleteModalVisible(false);
                    setError(null);
                    setDeletePassword("");
                  }}
                >
                  <Text style={styles.modalButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={handleDeleteAccount}
                >
                  <Text style={styles.modalButtonText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
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
  avatarTouchable: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
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
  // Styles pour les modales
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalInput: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    placeholderTextColor: "#666",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 10,
    width: "45%",
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
  },
  deleteButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
});
