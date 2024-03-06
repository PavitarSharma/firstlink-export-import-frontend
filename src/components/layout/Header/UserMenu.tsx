import { Link } from "react-router-dom";
import { UserState } from "../../../redux/slices/userSlice";
import { useAppSelector } from "../../../redux/hooks";
import useLogout from "../../../hooks/useLogout";
import { useCallback } from "react";

interface UserMenuProps {
  setUserMenu: React.Dispatch<React.SetStateAction<boolean>>;
}
const UserMenu: React.FC<UserMenuProps> = ({ setUserMenu }) => {
  const { isAuth, user } = useAppSelector(UserState);
  const logout = useLogout();

  const handleLogout = async () => {
    logout();
    setUserMenu(false);
  };
  const onClose = useCallback(() => setUserMenu(false), [setUserMenu])
  return (
    <>
      {isAuth ? (
        <div className="flex flex-col py-4">
          <div className="px-4 flex gap-2 items-center">
            <img
              src={user?.profileImg ? user?.profileImg.url : "/images/user.png"}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover border border-gray-400"
            />
            <div className="flex flex-col flex-1 gap-1">
              <span className="text-xs break-all leading-normal">
                {user?.name}
              </span>
              <span className="text-xs break-all leading-normal">
                @ {user?.username}
              </span>
            </div>
          </div>
          <div className="mt-2">
            <Link
            onClick={onClose}
              to="/wishlist"
              className="hover:bg-gray-100 transition flex items-center w-full px-4 h-10"
            >
              Wishlist
            </Link>
            <Link
            onClick={onClose}
              to="/profile"
              className="hover:bg-gray-100 transition flex items-center w-full px-4 h-10"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full px-4 text-left h-10 hover:bg-gray-100 block"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col py-4">
          <Link
            to="/auth/login"
            className="hover:bg-gray-100 transition flex items-center w-full px-4 h-10"
          >
            Login
          </Link>
          <Link
            to="/auth/register"
            className="hover:bg-gray-100 transition flex items-center w-full px-4 h-10"
          >
            Register
          </Link>
        </div>
      )}
    </>
  );
};

export default UserMenu;
