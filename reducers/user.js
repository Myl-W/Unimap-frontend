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
    username: ""
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
        username: ""
      };
    },
    userInfos: (state, action) => {
      state.value.profile = action.payload;
    },
     updateFullName: (state, action) => {
      const { firstname, lastname } = action.payload;
      state.profile.firstname = firstname;
      state.profile.lastname = lastname;
    },
    updateUsername: (state, action) => {
      state.profile.username = action.payload;
    }
  },
});

export const { updateEmail, resetUser, userInfos, updateFullName, updateUsername } = userSlice.actions;
export default userSlice.reducer;
