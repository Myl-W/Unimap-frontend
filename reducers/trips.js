import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    latitude: 0,
    longitude: 0,
  },
  mode: {
    pied: false,
    voiture: false,
    moto: false,
    velo: false,
    bus: false,
  },
};

export const tripSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    userLoc: (state, action) => {
      state.value = action.payload;
      console.log(action.payload);
    },
    toggleMode: (state, action) => {
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

export const { userLoc } = tripSlice.actions;
export default tripSlice.reducer;
