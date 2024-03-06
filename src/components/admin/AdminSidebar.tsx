import React, { useCallback } from "react";
import { LuShoppingCart, LuUsers } from "react-icons/lu";
import { BsCartPlus, BsCartCheck } from "react-icons/bs";
import { IconType } from "react-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdContacts, IoIosLogOut } from "react-icons/io";
import { axiosPrivate } from "../../config/api";
import { removeFromLocalStorage } from "../../config/localstorage";
import { logOut } from "../../redux/slices/userSlice";
import { useAppDispatch } from "../../redux/hooks";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { handleApiError } from "../../utils/handleApiError";

type TLink = {
  path: string;
  name: string;
  icon: IconType;
};

const links: TLink[] = [
  //   {
  //     path: "/admin",
  //     name: "Dashboard",
  //     icon: LuLayoutDashboard,
  //   },
  {
    path: "/admin",
    name: "Products",
    icon: LuShoppingCart,
  },
  {
    path: "/admin/add-product",
    name: "Add Product",
    icon: BsCartPlus,
  },
  {
    path: "/admin/orders",
    name: "Orders",
    icon: BsCartCheck,
  },
  {
    path: "/admin/users",
    name: "Users",
    icon: LuUsers,
  },
  {
    path: "/admin/contacts",
    name: "Contacts",
    icon: IoMdContacts,
  },
];

interface SidebarProps {
  openSidebar: boolean;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminSidebar: React.FC<SidebarProps> = ({
  openSidebar,
  setOpenSidebar,
}) => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlCloseSidebar = useCallback(
    () => setOpenSidebar(false),
    [setOpenSidebar]
  );

  const handleLogout = async () => {
    try {
      await axiosPrivate.post("/customers/logout");
      removeFromLocalStorage("firstlinks_access_token");
      dispatch(logOut());
      navigate("/auth/login");
      toast.success("Logged out successfully");
    } catch (error) {
      let message;

      if (error instanceof AxiosError) {
        message = handleApiError(error);
      } else {
        message = "An unexpected error occurred.";
      }

      toast.error(message);
    }
  };
  return (
    <div
      className={`fixed left-0 md:top-0 top-[64px] ${
        openSidebar
          ? "translate-x-0 opacity-100"
          : "-translate-x-[300px] opacity-0"
      } bg-white z-50 bottom-0 h-screen md:border-r w-72 md:shadow-none shadow-lg`}
    >
      <div className="h-full w-full relative">
        <div className="h-16 hidden md:flex items-center justify-center border-b">
          <Link to="/admin" className="">
            <div className="flex flex-col relative">
              <span className="text-3xl font-montez text-primary opacity-90">
                Clothes & Hair
              </span>
              <span className="text-[10px] tracking-widest absolute -bottom-2 left-4 text-gray-900 font-dancing-script">
                FirstLink Export & Import
              </span>
            </div>
          </Link>
        </div>

        <div className="px-4  my-8 flex flex-col justify-between">
          <div className="flex-1 h-full">
            {links.map((link: TLink, index: number) => (
              <Link to={link.path} key={index}>
                <div
                  className={`flex h-10 my-2 pl-2 items-center hover:bg-primary hover:text-white transition duration-300 ${
                    pathname === link.path && "bg-primary text-white"
                  } rounded`}
                >
                  <link.icon />
                  <span className="ml-3">{link.name}</span>
                </div>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-10 flex items-center gap-2 justify-center rounded-md border border-gray-300  cursor-pointer mt-10"
          >
            <IoIosLogOut /> <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
