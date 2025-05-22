import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    latitude: 0,
    longitude: 0,
    tripInfos: null,
  },
  coords: { routeCoords: [] },
  selectedTransport: null,
  recentSearch: [],
};

export const tripSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    userLoc: (state, action) => {
      state.value = action.payload;
    },
    setRouteCoords: (state, action) => {
      state.coords = { routeCoords: action.payload };
    },
    setTransport: (state, action) => {
      state.selectedTransport = action.payload;
    },
    resetTransport: (state) => {
      state.selectedTransport = null;
    },
    resetRouteCoords: (state) => {
      state.coords = { routeCoords: [] };
    },
    setTripInfos: (state, action) => {
      state.value.tripInfos = action.payload;
    },
    resetTripInfos: (state) => {
      state.value.tripInfos = null;
    },
    suppRecentSearch: (state, action) => {
      state.recentSearch = action.payload;
    },
    recentSearch: (state, action) => {
      // Vérifie si recentSearch n'est pas un tableau (ex : s'il est null ou undefined)
      // Si ce n’est pas un tableau, on l’initialise à un tableau vide pour éviter les erreurs plus bas
      if (!Array.isArray(state.recentSearch)) {
        state.recentSearch = []; //  garantit que recentSearch est bien un tableau
      }

      // Vérifie si la recherche à ajouter existe déjà dans le tableau recentSearch
      // On compare à la fois la ville d'arrivée (arrival) et les coordonnées de départ (departure)
      const alreadyExists = state.recentSearch.some(
        (item) =>
          item.arrival === action.payload.arrival &&
          item.departure === action.payload.departure
      );

      // Si la recherche n'existe pas déjà, on l'ajoute au tableau des recherches récentes
      if (!alreadyExists) {
        state.recentSearch.push(action.payload);
      }
    },
  },
});

export const {
  userLoc,
  setRouteCoords,
  setTransport,
  resetTransport,
  resetRouteCoords,
  setTripInfos,
  resetTripInfos,
  recentSearch,
  suppRecentSearch,
} = tripSlice.actions;
export default tripSlice.reducer;
