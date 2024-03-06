import { Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import {
  About,
  AddProduct,
  AdminOrders,
  AdminProducts,
  AdminProfile,
  AdminUsers,
  Cart,
  Checkout,
  Contact,
  Contacts,
  EditProduct,
  ForgotPassword,
  Home,
  Login,
  NewArrival,
  NotFound,
  OrderSuccess,
  Product,
  Profile,
  Register,
  ResetPassword,
  Shop,
  VerifyEmail,
  Wishlist,
} from "./pages";
import { Toaster } from "react-hot-toast";
import useWishlists from "./hooks/queries/useWishlists";
import useCarts from "./hooks/queries/useCarts";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { UserState, setAddresses } from "./redux/slices/userSlice";
import { useEffect } from "react";
import { setCart } from "./redux/slices/cartSlice";
import { setWishlists } from "./redux/slices/wishlistSlice";
import AdminLayout from "./layouts/AdminLayout";
import useAddresses from "./hooks/queries/useAddresses";
import useProfile from "./hooks/queries/useProfile";
import ProtectedRoute from "./layouts/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector(UserState);
  useWishlists();
  useCarts();
  useAddresses();
  useProfile();

  useEffect(() => {
    if (!isAuth) {
      dispatch(setCart([]));
      dispatch(setWishlists([]));
      dispatch(setAddresses([]));
    }
  }, [isAuth, dispatch]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path="auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="verification" element={<VerifyEmail />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="cart" element={<Cart />} />
          <Route element={<ProtectedRoute />}>
            <Route path="success/:orderId" element={<OrderSuccess />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="new-arrivals" element={<NewArrival />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminProducts />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="product/edit-product/:id" element={<EditProduct />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster
        toastOptions={{
          duration: 3000,
        }}
      />
    </>
  );
}

export default App;
