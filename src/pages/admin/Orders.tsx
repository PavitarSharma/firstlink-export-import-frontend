import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { handleApiError } from "../../utils/handleApiError";
import { axiosPrivate } from "../../config/api";
// import { useDebounce } from "../../hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { AdminState, setOrders } from "../../redux/slices/adminSlice";
import { Pagination } from "@mui/material";
import NoData from "../../components/layout/NoData";
// import Search from "../../components/admin/Search";
import { ICartItem, IOrder } from "../../types";
import { format } from "date-fns";
import { PiEye } from "react-icons/pi";
import { BsTrash3 } from "react-icons/bs";
import useViewOrderModal from "../../hooks/modals/useViewOrderModal";
import ViewOrderModal from "../../components/modals/ViewOrderModal";

const Orders = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector(AdminState);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  // const debounceSerach = useDebounce(search);

  useEffect(() => {
    const fetchProducts = async () => {
      setError("");
      setIsLoading(true);
      try {
        let url = `/admin/orders?page=${page}&limit=${limit}&status=${status}&paymentStatus=${paymentStatus}`;
        // if (search) {
        //   url += `&q=${debounceSerach}`;
        // }
        if(status){
          url += `&status=${status}`
        }
        if(paymentStatus){
          url += `&paymentStatus=${status}`
        }
        const { data } = await axiosPrivate.get(url);
        dispatch(setOrders(data.orders));
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
  }, [dispatch, page, limit, status, paymentStatus]);

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearch(e.target.value);
  //   setPage(1);
  // };

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalCount);
  return (
    <>
      <div className="">
        {/* <Search
          placeholder="Serach by name, email, mobile..."
          value={search}
          onChange={handleSearchChange}
        /> */}

        <OrderTable
          page={page}
          limit={limit}
          status={status}
          paymentStatus={paymentStatus}
          setStatus={setStatus}
          setPage={setPage}
          setPaymentStatus={setPaymentStatus}
          isLoading={isLoading}
          error={error}
        />
        {orders?.length > 0 && (
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
        )}
      </div>
    </>
  );
};

export default Orders;

interface OrderTableProps {
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  paymentStatus: string;
  setPaymentStatus: React.Dispatch<React.SetStateAction<string>>;
  page: number;
  limit: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  error: string;
}
const OrderTable = ({
  page,
  limit,
  status,
  setStatus,
  paymentStatus,
  setPaymentStatus,
  setPage,
}: OrderTableProps) => {
  const { orders } = useAppSelector(AdminState);
  const orderViewModal = useViewOrderModal();
  const [selectOrder, setSelectOrder] = useState<ICartItem[]>([]);
  const calculateIndex = (pageIndex: number, index: number) => {
    return pageIndex * limit + index + 1;
  };

  const handleViewOrder = (cart: ICartItem[]) => {
    setSelectOrder(cart);
    orderViewModal.onOpen();
  };

  const handleStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handlePaymentStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    
    setPaymentStatus(event.target.value);
    setPage(1);
  };

  return (
    <>
      <div className="relative overflow-x-auto mt-4 rounded-lg">
        <table className="md:w-full w-[1400px] text-left text-sm bg-white shadow rounded-lg">
          <thead className="text-xs text-gray-700 uppercase whitespace-nowrap h-14 bg-white border-b rounded-t-lg">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-t-lg">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Customer
              </th>
              <th scope="col" className="px-6 py-3">
                Order ID
              </th>
              <th scope="col" className="px-6 py-3">
                <select
                  name="status"
                  id="status"
                  value={status}
                  onChange={handleStatus}
                  className="outline-0 border h-10 rounded-md"
                >
                  <option value="">Order Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="processing">Success</option>
                  <option value="completed">Completed</option>
                  <option value="completed">Cancelled</option>
                </select>
              </th>
              <th scope="col" className="px-6 py-3">
                Total Price
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                <select
                  name="status"
                  id="status"
                  value={paymentStatus}
                  onChange={handlePaymentStatus}
                  className="outline-0 border h-10 rounded-md"
                >
                  <option value="">Payment Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Success</option>
                </select>
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Created At
              </th>
              <th className="px-6 py-3 rounded-t-lg"></th>
            </tr>
          </thead>
          
            <tbody className="relative">
              {orders &&
                orders.map((order: IOrder, index: number) => {
                  const {
                    customer: { profileImg, name },
                    status,
                    paymentInfo: { status: paymentStatus },
                    createdAt,
                    shippingAddress,
                    totalPrice,
                    cart,
                    orderId,
                  } = order;
                  const formattedDate = format(createdAt, "dd MMM, yyyy");
                  return (
                    <tr key={index} className="border border-b">
                      <td scope="row" className="px-6 py-4">
                        {calculateIndex(page - 1, index)}
                      </td>

                      <td scope="row" className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              profileImg ? profileImg?.url : "/images/user.png"
                            }
                            alt="profile"
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                          />
                          <p className="text-xs font-medium text-gray-900">
                            {name}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">{orderId}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`${
                            status === "Processing"
                              ? "text-yellow-600"
                              : status === "Cancelled"
                              ? "text-red-600"
                              : status === "Pending"
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-6 py-4">{totalPrice.toFixed(2)}</td>

                      <td className="px-6 py-4 break-all">
                        {shippingAddress.address}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={` capitalize ${
                            paymentStatus === "Pending"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {paymentStatus}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleViewOrder(cart)}>
                            <PiEye size={18} className=" cursor-pointer" />
                          </button>
                          <button onClick={() => {}}>
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

        {orders?.length === 0 && <NoData />}
      </div>

      {orderViewModal.isOpen && selectOrder && (
        <ViewOrderModal cart={selectOrder} />
      )}
    </>
  );
};
