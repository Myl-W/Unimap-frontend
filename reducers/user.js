import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { nickname: null, places: [] },
  profile: {
    userId: "",
    firstname: "",
    lastname: "",
    birthdate: "",
    email: "",
    token: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateEmail: (state, action) => {
      state.value.email = action.payload;
    },
    resetUser: (state) => {
      state.value.profile = {
        userId: "",
        firstname: "",
        lastname: "",
        birthdate: "",
        email: "",
        token: "",
      };
    },
    userInfos: (state, action) => {
      state.value.profile = action.payload;
    },
  },
});

export const { updateEmail, resetUser, userInfos } = userSlice.actions;
export default userSlice.reducer;
