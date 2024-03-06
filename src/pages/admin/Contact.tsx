import { useEffect, useState } from "react";
import { axiosPrivate } from "../../config/api";
import { useDebounce } from "../../hooks/useDebounce";
import { AxiosError } from "axios";
import { handleApiError } from "../../utils/handleApiError";
import Search from "../../components/admin/Search";
import Loading from "../../components/layout/Loading";
import Error from "../../components/Error";
import { Pagination } from "@mui/material";
import { format } from "date-fns";
import { BsTrash3 } from "react-icons/bs";
import { IContact } from "../../types";
import NoData from "../../components/layout/NoData";
import toast from "react-hot-toast";

const Contact = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const debounceSerach = useDebounce(search);

  useEffect(() => {
    const fetchContacts = async () => {
      setError("");
      setIsLoading(true);

      try {
        let url = `/admin/contacts?page=${page}&limit=${limit}`;
        if (search) {
          url += `&q=${debounceSerach}`;
        }
        const { data } = await axiosPrivate.get(url);
        setContacts(data.contacts);
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
    fetchContacts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debounceSerach]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalCount);
  const calculateIndex = (pageIndex: number, index: number) => {
    return pageIndex * limit + index + 1;
  };

  const handleDeleteUser = async (contactId: string) => {
    try {
      await axiosPrivate.delete(`/admin/contacts/${contactId}`);
      setContacts((prevContacts) =>
        prevContacts.filter((contact: IContact) => contact._id !== contactId)
      );

      toast.success("Contact deleted successfully");
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
    <>
      <div className="">
        <Search
          placeholder="Serach by name, email, phone..."
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
        ) : contacts?.length > 0 ? (
          <>
            <div className="relative overflow-x-auto mt-4 rounded-lg">
              <table className="lg:w-full w-[900px] text-left text-sm bg-white  shadow rounded-lg">
                <thead className="text-xs text-gray-700 uppercase whitespace-nowrap h-14 bg-white border-b">
                  <tr>
                    <th scope="col" className="px-6 py-3 rounded-md">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Phone
                    </th>

                    <th scope="col" className="px-6 py-3">
                      Created On
                    </th>

                    <th scope="col" className="px-6 py-3 rounded-md"></th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((row: IContact, index: number) => (
                    <tr
                      key={index}
                      className="border border-r-0 border-t-0 border-l-0 border-b border-b-gray-200 hover:bg-gray-50 transition duration-300 cursor-pointer "
                    >
                      <td className="px-6 py-3 text-center">
                        {calculateIndex(page - 1, index)}
                      </td>
                      <td className="px-6 py-3 ">{row?.name}</td>
                      <td className="px-6 py-3">{row?.email}</td>
                      <td className="px-6 py-3">{row?.phone}</td>

                      <td className="px-6 py-3 whitespace-nowrap">
                        {format(row?.createdAt, "dd MMM, yyyy")}
                      </td>

                      <td className="px-6 py-3">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => handleDeleteUser(row?._id)}>
                            <BsTrash3
                              size={16}
                              className="text-red-600 cursor-pointer"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
    </>
  );
};

export default Contact;
