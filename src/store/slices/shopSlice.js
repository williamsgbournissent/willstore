import { createSlice } from "@reduxjs/toolkit";

const shopSlice = createSlice({
  name: "shop",
  initialState: {
    categories: [],
    products: [],
    categorySelected: "",
    productSelected: {},
  },
  reducers: {
    setCategorySelected: (state, action) => {
      state.categorySelected = action.payload;
    },
    setProductSelected: (state, action) => {
      state.productSelected = action.payload;
    },
  },
});

export const { setCategorySelected, setProductSelected } = shopSlice.actions;

export default shopSlice.reducer;
