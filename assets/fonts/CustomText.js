import { Text } from "react-native";

export default function CustomText(props) {
  return <Text {...props} style={[{ fontFamily: "Kanit" }, props.style]} />;
}
