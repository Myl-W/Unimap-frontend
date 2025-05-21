import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    latitude: 0,
    longitude: 0,
    tripInfos: null,
  },
  coords: { routeCoords: [] },
  selectedTransport: null,
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
} = tripSlice.actions;
export default tripSlice.reducer;
