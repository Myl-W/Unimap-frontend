import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    nickname: null,
    places: [],
    homeAddress: null,
    workAddress: null,
    favorites: [],
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
        favorites: [],
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
    updateUser: (state, action) => {
      state.profile = action.payload;
    },
    setFavorites: (state, action) => {
      state.value.favorites = action.payload;
    },
    addFavorite: (state, action) => {
      state.value.favorites.push(action.payload); 
    },
    updateFavorite: (state, action) => {
      const { id, updatedFavorite } = action.payload; // Récupère l'id et le favori mis à jour
      const index = state.value.favorites.findIndex((fav) => fav._id === id); // Trouve l'index du favori à mettre à jour
      if (index !== -1) { // Vérifie si l'index existe
        state.value.favorites[index] = updatedFavorite; // Met à jour le favori dans le tableau
      }
    },
    deleteFavorite: (state, action) => {
      state.value.favorites = state.value.favorites.filter(
        (fav) => fav._id !== action.payload // Filtre le tableau pour supprimer le favori avec l'id correspondant
      );
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
  updateUser,
  setFavorites,
  addFavorite,
  updateFavorite,
  deleteFavorite,
} = userSlice.actions;
export default userSlice.reducer;
