import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IOrder, IProduct, IUser } from "../../types";
import { RootState } from "../store";

interface IAdminState {
  users: IUser[];
  orders: IOrder[];
  products: IProduct[];
}

const initialState: IAdminState = {
  users: [],
  orders: [],
  products: [],
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<IUser[]>) => {
      state.users = action.payload;
    },
    setOrders: (state, action: PayloadAction<IOrder[]>) => {
      state.orders = action.payload;
    },
    setProducts: (state, action: PayloadAction<IProduct[]>) => {
      state.products = action.payload;
    },

    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    },

    addUser: (state, action) => {
      state.users = [action.payload, ...state.users];
    },
  },
});

export const { setUsers, setOrders, setProducts, deleteUser, addUser } =
  adminSlice.actions;

export const AdminState = (state: RootState) => state.admin;

export default adminSlice.reducer;
