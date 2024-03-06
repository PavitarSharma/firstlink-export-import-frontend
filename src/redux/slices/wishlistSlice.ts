import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IProduct } from "../../types";

interface IWishlistState {
  wishlists: IProduct[];
}

const initialState: IWishlistState = {
  wishlists: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addProductToWishlist: (state, action: PayloadAction<IProduct>) => {
      const findPrduct = state.wishlists.find(
        (wishlist) => wishlist._id === action.payload._id
      );
      if (findPrduct) {
        state.wishlists = state.wishlists.filter(
          (item) => item._id !== action.payload._id
        );
      } else {
        state.wishlists = [action.payload, ...state.wishlists];
      }
    },
    removeFromWishlist: (state, action: PayloadAction<IProduct>) => {
      state.wishlists = state.wishlists.filter(
        (item) => item._id !== action.payload._id
      );
    },
    clearWishlist: (state) => {
      state.wishlists = [];
    },
    setWishlists: (state, action: PayloadAction<IProduct[]>) => {
      state.wishlists = action.payload;
    },
  },
});

export const WishlistState = (state: RootState) => state.wishlist;

export const {
  addProductToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlists,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
