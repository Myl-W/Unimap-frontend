import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    latitude: 0,
    longitude: 0,
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
  },
});

export const { userLoc, setRouteCoords, setTransport, resetTransport } =
  tripSlice.actions;
export default tripSlice.reducer;
