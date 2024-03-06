import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IReview } from "../../types";

export interface IUserState {
  reviews: IReview[]
}

const initialState: IUserState = {
  reviews: [],
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setReviews : (state, action:PayloadAction<IReview[]>) => {
        state.reviews = action.payload;
    },
    setProductReview: (state, action) => {
        state.reviews = [action.payload, ...state.reviews];
    },

    setEditProductReview : (state, action) => {
        const reviewId = action.payload._id;
        state.reviews = state.reviews.map((review) => {
            return review._id === reviewId? {...action.payload } : review;
        });
    },
    setDeleteProductReview : (state, action) => {
        const reviewId = action.payload;
        state.reviews = state.reviews.filter((review) => {
            return review._id!== reviewId;
        });
    }
  },
});

export const ReviewState = (state: RootState) => state.review;

export const {
  setReviews,
  setProductReview,
  setEditProductReview,
  setDeleteProductReview,
} = reviewSlice.actions;

export default reviewSlice.reducer;
