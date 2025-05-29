import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sourd: false,
  aveugle: false,
  fauteuil: false,
  canne: false,
  poussette: false,
  alerte: false,
  parking: false,
  baby: false,
  color: "",
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
    signalColor: (state, action) => {
      state.color = action.payload;
    },
  },
});

export const { toggleSignalement, resetSignalement, signalColor } =
  signalementSlice.actions;
export default signalementSlice.reducer;
