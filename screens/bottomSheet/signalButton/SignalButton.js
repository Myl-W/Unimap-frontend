import { Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export const getSignalButtons = (styles) => [
  {
    key: "sourd",
    icon: <FontAwesome name="deaf" size={42} color="black" />,
    style: styles.buttonCouleur_Deaf,
    label: "Ajouter un dispositif pour personnes sourdes",
  },
  {
    key: "fauteuil",
    icon: <FontAwesome name="wheelchair" size={42} color="black" />,
    style: styles.buttonCouleur_WeelChair,
    label: "Ajouter un dispositif pour personnes en fauteuil roulant",
  },
  {
    key: "alerte",
    icon: (
      <Image
        style={styles.iconAlert}
        source={require("../../../assets/icon/alert.png")}
      />
    ),
    style: styles.buttonCouleur_Alert,
    isImage: true,
    label: "Ajouter un danger",
  },
  {
    key: "aveugle",
    icon: <FontAwesome name="eye-slash" size={42} color="black" />,
    style: styles.buttonCouleur_Aveugle,
    label: "Ajouter un dispositif pour personnes aveugles",
  },
  {
    key: "poussette",
    icon: <FontAwesome6 name="baby-carriage" size={42} color="black" />,
    style: styles.buttonCouleur_Poussette,
    label: "Ajouter un dispositif pour personnes avec poussette",
  },
  {
    key: "cane",
    icon: (
      <FontAwesome6 name="person-walking-with-cane" size={42} color="black" />
    ),
    style: styles.buttonCouleur_Canne,
    label: "Ajouter un dispositif pour personnes avec canne",
  },
  {
    key: "parking",
    icon: <FontAwesome6 name="square-parking" size={42} color="black" />,
    style: styles.buttonCouleur_Parking,
    label: "Ajouter un parking",
  },
  {
    key: "baby",
    icon: <FontAwesome6 name="baby" size={42} color="black" />,
    style: styles.buttonCouleur_Baby,
    label: "Ajouter une table à langer",
  },
];

export const signalButtonStyles = StyleSheet.create({
  optionButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonCouleur_WeelChair: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "blue",
  },
  buttonCouleur_Deaf: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "green",
  },
  buttonCouleur_Alert: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#ffb71e",
    borderWidth: 2,
    borderColor: "black",
  },
  optionButtonContentAlert: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffb71e",
  },
  buttonCouleur_Parking: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#000",
  },
  buttonCouleur_Baby: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#e91fd4",
  },
  iconAlert: {
    width: 42,
    height: 42,
  },
  buttonCouleur_Aveugle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "red",
  },
  buttonCouleur_Poussette: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "orange",
  },
  buttonCouleur_Canne: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#2dfcfc",
  },
});
