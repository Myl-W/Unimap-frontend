import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    nickname: null,
    places: [],
    homeAddress: null,
    workAddress: null,
  },
  profile: {
    profilePhoto: "",
    userId: "",
    firstname: "",
    lastname: "",
    birthdate: "",
    email: "",
    token: "",
    username: "",
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
      state.profile = {
        profilePhoto: "",
        userId: "",
        firstname: "",
        lastname: "",
        birthdate: "",
        email: "",
        token: "",
        username: "",
      };
      state.value = {
        nickname: null,
        places: [],
        homeAddress: null,
        workAddress: null,
      };
    },
    userInfos: (state, action) => {
      state.profile = action.payload;
    },
    updateFullName: (state, action) => {
      const { firstname, lastname } = action.payload;
      state.profile.firstname = firstname;
      state.profile.lastname = lastname;
    },
    updateUsername: (state, action) => {
      state.profile.username = action.payload;
    },
    setHomeAddress: (state, action) => {
      state.value.homeAddress = action.payload;
    },
    setWorkAddress: (state, action) => {
      state.value.workAddress = action.payload;
    },
    addProfilePhoto: (state, action) => {
      state.profile.profilePhoto = action.payload;
    },
  },
});

export const {
  updateEmail,
  resetUser,
  userInfos,
  updateFullName,
  updateUsername,
  setHomeAddress,
  setWorkAddress,
  addProfilePhoto,
} = userSlice.actions;
export default userSlice.reducer;
