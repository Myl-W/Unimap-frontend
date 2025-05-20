import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sourd: false,
  aveugle: false,
  fauteuil: false,
  canne: false,
  poussette: false,
  alerte: false,
  pied: false,
  voiture: false,
  malvoyant: false,
  moto: false,
  malentendant: false,
  velo: false,
  bus: false,
  autisme: false,
  cane: false,
  autres2: false,
};

const accessibilitySlice = createSlice({
  name: "accessibility",
  initialState,
  reducers: {
    toggleHandicap: (state, action) => {
      const key = action.payload;
      state[key] = !state[key];
    },
    resetAccessibility: () => ({ ...initialState }),
    setMultipleHandicaps: (state, action) => {
      const keys = action.payload;
      keys.forEach((key) => {
        if (key in state) {
          state[key] = true;
        }
      });
    },
    toggleMultiple: (state, action) => {
      const keys = action.payload;
      const shouldEnable = keys.some((key) => !state[key]);
      keys.forEach((key) => {
        if (key in state) {
          state[key] = shouldEnable;
        }
      });
    },
    toggleMultipleTransport: (state, action) => {
      const keys = action.payload;
      const shouldEnable = keys.some((key) => !state[key]);
      keys.forEach((key) => {
        if (key in state) {
          state[key] = shouldEnable;
        }
      });
    },
  },
});

export const {
  toggleHandicap,
  resetAccessibility,
  setMultipleHandicaps,
  toggleMultiple,
  toggleMultipleTransport,
} = accessibilitySlice.actions;
export default accessibilitySlice.reducer;
