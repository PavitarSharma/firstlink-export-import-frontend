import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import reviewReducer from "./slices/reviewSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    review: reviewReducer,
    admin: adminReducer,
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch