import React, { useCallback } from "react";
import { LuMenu } from "react-icons/lu";
import { useAppSelector } from "../../redux/hooks";
import { UserState } from "../../redux/slices/userSlice";
import { Link } from "react-router-dom";

interface NavbarProps {
  openSidebar: boolean;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}
const AdminNavbar: React.FC<NavbarProps> = ({
  openSidebar,
  setOpenSidebar,
}) => {
  const {  user } = useAppSelector(UserState);
  const handleOpenSidebar = useCallback(
    () => setOpenSidebar((prev) => !prev),
    [setOpenSidebar]
  );

  const isAdmin = user?.role === "Admin"

  return (
    <header
      className={`${
        openSidebar && "md:w-[calc(100%_-_288px)]"
      } w-full fixed h-16 border border-l-0 top-0 right-0  bg-white z-50`}
    >
      <div className="w-full flex items-center h-full justify-between md:px-6 px-4">
        <button onClick={handleOpenSidebar} className="cursor-pointer">
          <LuMenu size={24} />
        </button>
        <Link to="/admin/profile" className="w-10 h-10 rounded-full border">
          <img
            src={isAdmin && user?.profileImg ? user?.profileImg.url : "/images/user.png"}
            alt="profile"
            loading="lazy"
            className="w-full h-full rounded-full object-cover cursor-pointer border border-gray-400"
          />
        </Link>
      </div>
    </header>
  );
};

export default AdminNavbar;
