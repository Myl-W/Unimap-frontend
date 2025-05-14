import "react-native-gesture-handler";
import "react-native-reanimated";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import BottomSheet from "@gorhom/bottom-sheet";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

export default function MapScreen() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const snapPoints = useMemo(() => ["25%", "50%", "80%"], []);
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={handleOpenBottomSheet}
          style={{ marginLeft: 15 }}
        >
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ marginRight: 15 }}
        >
          <FontAwesome name="bars" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleOpenBottomSheet]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let location = await Location.getCurrentPositionAsync({});
      setCurrentPosition(location.coords);
    })();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const dummyData = [
      "Supermarché",
      "Pharmacie",
      "Station essence",
      "Restaurant",
      "Hôpital",
    ];
    const filtered = dummyData.filter((item) =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <View style={styles.container}>
      <MapView
        mapType="normal"
        style={styles.map}
        showsUserLocation
        initialRegion={{
          latitude: currentPosition?.latitude || 48.8566,
          longitude: currentPosition?.longitude || 2.3522,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {currentPosition && (
          <Marker
            coordinate={currentPosition}
            title="Ma position"
            pinColor="#fecb2d"
          />
        )}
      </MapView>

      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints}>
        <View style={styles.sheetContent}>
          <TextInput
            placeholder="Rechercher..."
            style={styles.searchInput}
            value={search}
            onChangeText={handleSearch}
          />
          <FlatList
            data={results}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.resultItem}>{item}</Text>
            )}
          />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  sheetContent: {
    padding: 16,
  },
  searchInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  resultItem: {
    paddingVertical: 8,
    fontSize: 16,
  },
});
