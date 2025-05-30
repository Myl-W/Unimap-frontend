import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sourd: false,
  aveugle: false,
  fauteuil: false,
  canne: false,
  malentendant: false,
  autisme: false,
  poussette: false,
  alerte: false,
  pied: false,
  voiture: false,
  malvoyant: false,
  moto: false,
  velo: false,
  bus: false,
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
      // Pour chaque clé, si elle existe dans le state, on la passe à true
      keys.forEach((key) => {
        if (key in state) {
          state[key] = true;
        }
      });
    },
    toggleMultiple: (state, action) => {
      const keys = action.payload;

      // Vérifie s'il y a au moins une case à cocher qui n'est pas activée
      const shouldEnable = keys.some((key) => !state[key]);
      // Si au moins une case n'est pas activée, on active toutes les cases
      // Sinon, on désactive toutes les cases
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
