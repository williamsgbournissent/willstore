import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    email: "",
    localId: "",
    image: "",
  },
  reducers: {
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
    setLocalId: (state, action) => {
      state.localId = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    clearUser: (state) => {
      state.email = "";
      state.localId = "";
      state.image = "";
    },
  },
});

export const { setUserEmail, setLocalId, setImage, clearUser } =
  userSlice.actions;

export default userSlice.reducer;
