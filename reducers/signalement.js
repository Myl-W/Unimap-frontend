import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sourd: false,
  aveugle: false,
  fauteuil: false,
  canne: false,
  poussette: false,
  alerte: false,
  parkink: false,
  baby: false,
};

const signalementSlice = createSlice({
  name: "signalement",
  initialState,
  reducers: {
    toggleSignalement: (state, action) => {
      const key = action.payload;
      state[key] = !state[key];
    },
    resetSignalement: () => ({ ...initialState }),
  },
});

export const { toggleSignalement, resetSignalement } = signalementSlice.actions;
export default signalementSlice.reducer;
