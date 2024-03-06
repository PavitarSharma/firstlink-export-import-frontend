import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Option, TMedia } from "../../types";


interface IProductState {
  view: string;
  category: string;
  color: string;
  size: string;
  price: string;
  type: string;
  sort: Option;
  searchTerm: string;
  image: TMedia
}

const initialState: IProductState = {
  view: "grid",
  category: "",
  color: "",
  price: "",
  size: "",
  type: "",
  sort:{ label: "Date added, newest to oldest", value: "Date added, newest to oldest" },
  searchTerm: "",
  image: {
    medias: [],
    color: ""
  }
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setView: (state, action) => {
      state.view = action.payload;
    },

    setSize: (state, action) => {
      state.size = action.payload;
    },

    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearSerachTerm: (state) => {
      state.searchTerm = "";
    },

    setColor: (state, action) => {
      state.color = action.payload;
    },

    setCategory: (state, action) => {
      state.category = action.payload;
    },

    setType: (state, action) => {
      state.type = action.payload;
    },

    setPrice: (state, action) => {
      state.price = action.payload;
    },

    setSort: (state, action) => {
      state.sort = action.payload;
    },

    setImage: (state, action) => {
      state.image = action.payload;
    },

    setResetSize: (state) => {
      state.size = ""
    },

    setResetCategory: (state) => {
      state.category = ""
    },

    reset: () => initialState,
  },
});

export const ProductState = (state: RootState) => state.product;

export const {
  reset,
  setView,
  setCategory,
  setColor,
  setPrice,
  setSize,
  setType,
  setSort,
  clearSerachTerm,
  setSearchTerm,
  setImage,
  setResetSize,
  setResetCategory
} = productSlice.actions;

export default productSlice.reducer;
