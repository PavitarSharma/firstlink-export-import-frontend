import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  AdminState,
  deleteUser,
  setUsers,
} from "../../redux/slices/adminSlice";
import { axiosPrivate } from "../../config/api";
import { AxiosError } from "axios";
import { handleApiError } from "../../utils/handleApiError";
import { IUser } from "../../types";
import { format } from "date-fns";
import Button from "../../components/layout/buttons/Button";
import Search from "../../components/admin/Search";
import { BsTrash3 } from "react-icons/bs";
import { PiEye } from "react-icons/pi";
import Loading from "../../components/layout/Loading";
import NoData from "../../components/layout/NoData";
import toast from "react-hot-toast";
import useCreateUserModal from "../../hooks/modals/useCreateUserModal";
import CreateUserModal from "../../components/modals/CreateUserModal";
import { useDebounce } from "../../hooks/useDebounce";
import { Pagination } from "@mui/material";
import useUserViewModal from "../../hooks/modals/useUserViewModal";
import ViewUserModal from "../../components/modals/ViewUserModal";
import Error from "../../components/Error";

const Users = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const { users } = useAppSelector(AdminState);
  const createUserModal = useCreateUserModal();

  const debounceSerach = useDebounce(search);

  useEffect(() => {
    
    const fetchProducts = async () => {
      setError("");
      setIsLoading(true);
      try {
        let url = `/admin/users?page=${page}&limit=${limit}`;
        if (search) {
          url += `&q=${debounceSerach}`;
        }
        const { data } = await axiosPrivate.get(url);
        dispatch(setUsers(data.users));
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      } catch (error) {
        let message;

        if (error instanceof AxiosError) {
          message = handleApiError(error);
        } else {
          message = "An unexpected error occurred.";
        }
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, limit, debounceSerach]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalCount);

  return (
    <>
      <div className="">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">All Users</h1>
          <Button label="Add User" onClick={createUserModal.onOpen} />
        </div>
        <Search
          placeholder="Serach by name, email, mobile..."
          value={search}
          onChange={handleSearchChange}
        />
        {isLoading ? (
          <div className="mt-20">
            <Loading />
          </div>
        ) : error ? (
          <div className="mt-8">
            <Error error={error} />
          </div>
        ) : users?.length > 0 ? (
          <>
            <UserTable page={page} limit={limit} />
            <div className="mb-6 mt-6 flex lg:items-center lg:justify-between lg:flex-row flex-col  gap-6">
              <div className="flex flex-row items-center gap-3">
                <p className="text-gray-600">
                  Showing {startIndex}-{endIndex} out of {totalCount}
                </p>

                <select
                  value={limit}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                    setLimit(Number(event.target.value))
                  }
                  className="p-2 border-gray-300 border rounded-md outline-0"
                >
                  {[10, 15, 20, 25].map((value, index) => (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <Pagination
                showFirstButton
                showLastButton
                count={totalPages}
                page={page}
                onChange={(_e, value) => setPage(value)}
                variant="outlined"
                shape="rounded"
                color="primary"
              />
            </div>
          </>
        ) : (
          <div>
            <NoData />
          </div>
        )}
      </div>
      {createUserModal.isOpen && <CreateUserModal />}
    </>
  );
};

export default Users;

const UserTable = ({ page, limit }: { page: number; limit: number }) => {
  interface RoleState {
    [userId: string]: string;
  }

  const { users } = useAppSelector(AdminState);
  const [roles, setRoles] = useState<RoleState>({});
  const dispatch = useAppDispatch();
  const viewUserModal = useUserViewModal();
  const [selectUser, setSelectUser] = useState<IUser | null>(null);
  const handleRoleChange = async (userId: string, role: string) => {
    try {
      setRoles((prevRoles) => ({
        ...prevRoles,
        [userId]: role,
      }));
      await axiosPrivate.post(`/admin/users/role`, {
        id: userId,
        role,
      });

      toast.success("Role updated successfully");
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

  const handleDeleteUser = async (userId: string) => {
    try {
      await axiosPrivate.delete(`/admin/users/${userId}`);
      dispatch(deleteUser(userId));

      toast.success("User deleted successfully");
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

  const calculateIndex = (pageIndex: number, index: number) => {
    return pageIndex * limit + index + 1;
  };

  return (
    <>
      <div className="relative overflow-x-auto mt-4 rounded-lg">
        <table className="w-full text-left text-sm bg-white shadow rounded-lg">
          <thead className="text-xs text-gray-700 uppercase whitespace-nowrap h-14 bg-white border-b rounded-t-lg">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-t-lg">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Mobile
              </th>
              <th scope="col" className="px-6 py-3">
                Verified
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th className="px-6 py-3 rounded-t-lg"></th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users?.length > 0 &&
              users?.map((user: IUser, index: number) => {
                const {
                  _id,
                  profileImg,
                  name,
                  email,
                  phone,
                  verified,
                  createdAt,
                  role,
                } = user;

                const userRole = roles[_id] || role;

                return (
                  <tr key={index} className="border border-b">
                    <td className="px-6 py-4">
                      {calculateIndex(page - 1, index)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            profileImg ? profileImg?.url : "/images/user.png"
                          }
                          alt="profile"
                          className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        />
                        <span className="whitespace-nowrap break-words">
                          {name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{phone}</td>
                    <td className="px-6 py-4">
                      <div
                        className={`${
                          verified
                            ? "bg-green-200 border border-green-600 rounded-md p-1 w-16 text-center text-green-700"
                            : "bg-red-200 text-red-700 border border-red-600 text-center p-1 rounded-md w-[72px]"
                        }`}
                      >
                        {verified ? "Verified" : "Unverified"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        name="role"
                        id="role"
                        value={userRole}
                        onChange={(e) => handleRoleChange(_id, e.target.value)}
                        className="p-2 border capitalize border-gray-300 rounded-md outline-0"
                      >
                        {["User", "Admin"]?.map(
                          (role: string, index: number) => {
                            return (
                              <option
                                key={index}
                                value={role}
                                className="capitalize"
                              >
                                {role}
                              </option>
                            );
                          }
                        )}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(createdAt, "dd MMM, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectUser(user);
                            viewUserModal.onOpen();
                          }}
                        >
                          <PiEye size={18} className=" cursor-pointer" />
                        </button>
                        <button onClick={() => handleDeleteUser(_id)}>
                          <BsTrash3
                            size={16}
                            className="text-red-600 cursor-pointer"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {viewUserModal.isOpen && selectUser && (
        <ViewUserModal user={selectUser} />
      )}
    </>
  );
};
