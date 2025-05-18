import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { nickname: null, places: [] },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateEmail: (state, action) => {
      state.value.email = action.payload;
    },
    resetUser: (state) => {
      state.value = { nickname: null, places: [] };
    },
  },
});

export const { updateEmail, resetUser } = userSlice.actions;
export default userSlice.reducer;
