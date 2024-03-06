
import { useAppDispatch } from "../redux/hooks"
import { removeFromLocalStorage } from "../config/localstorage"
import { axiosPrivate } from "../config/api"
import toast from "react-hot-toast"
import { logOut, setAddresses } from "../redux/slices/userSlice"
import { handleApiError } from "../utils/handleApiError"
import { AxiosError } from "axios"
import { setCart } from "../redux/slices/cartSlice"
import { setWishlists } from "../redux/slices/wishlistSlice"


const useLogout = () => {
  const dispatch = useAppDispatch()
  const logout = async () => {
    try {
      await axiosPrivate.post('/customers/logout')
      removeFromLocalStorage("firstlinks_access_token")
      dispatch(logOut())
      dispatch(setCart([]))
      dispatch(setWishlists([]));
      dispatch(setAddresses([]));
      toast.success("Logged out successfully")
    } catch (error) {
      let message;

      if (error instanceof AxiosError) {
        message = handleApiError(error);
      } else {
        message = "An unexpected error occurred.";
      }

      toast.error(message)
    }
  }
  return logout
}

export default useLogout