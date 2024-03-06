import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { UserState } from "../redux/slices/userSlice";

const ProtectedRoute = () => {
  const { isAuth } = useAppSelector(UserState);
  return isAuth ? <Outlet /> : <Navigate replace to="/auth/login" />;
};

export default ProtectedRoute;
