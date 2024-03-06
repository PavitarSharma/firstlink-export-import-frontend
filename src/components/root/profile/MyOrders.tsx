import { useEffect, useState } from "react";
import { BsMinecartLoaded } from "react-icons/bs";
import { axiosPrivate } from "../../../config/api";
import { IOrder } from "../../../types";
import { format } from 'date-fns';
import Loading from "../../layout/Loading";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { handleApiError } from "../../../utils/handleApiError";
import { cancelOrderService } from "../../../services";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchedOrders = async () => {
      setIsLoading(true);

      try {
        const { data } = await axiosPrivate.get("/customers/orders", {
          signal,
        });
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchedOrders();

    return () => {
      abortController.abort();
    };
  }, []);


  const cancelOrder = async (id: string, orderId: string) => {
    const loading = toast.loading("Cancelling order...")
    try {
      await cancelOrderService(id)
      toast.success(`Order ${orderId} cancelled`)
  
    } catch (error) {
      let message;

      if (error instanceof AxiosError) {
        message = handleApiError(error);
      } else {
        message = "An unexpected error occurred.";
      }

      toast.error(message);
    }finally {
      toast.dismiss(loading);
    }
  }

  return (
    <div className="p-4 ">
      {isLoading ? (
        <Loading />
      ) : orders && orders?.length > 0 ? (
        <div className="relative lg:w-[800px] w-full overflow-x-auto shadow rounded-md p-4 bg-white">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-s-lg">
                  id
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Items
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap rounded-s-lg">
                  Created Date
                </th>
                <th scope="col" className="px-6 py-3">
                 
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: IOrder, index: number) => {
                const {
                  orderId,
                  cart,
                  totalPrice,
                  status,
                  createdAt,
                  _id
                } = order;
                const formattedDate = format(createdAt, 'dd MMM, yyyy');
                const items = cart?.length
                return (
                  <tr key={index} className="bg-white">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{orderId}</td>
                    <td className="px-6 py-4 text-center">{items}</td>
                    <td className="px-6 py-4">{totalPrice.toFixed(2)}</td>
                    
                    <td className="px-6 py-4">{status}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{formattedDate}</td>
                    <td>
                      <button onClick={() => cancelOrder(_id, orderId)} className="whitespace-nowrap bg-red-500 text-white px-2 py-2 rounded-md text-sm cursor-pointer">Cancel Order</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="sm:w-[200px] sm:h-[200px] w-[180px] h-[180px] flex items-center justify-center rounded-full bg-gray-100">
            <BsMinecartLoaded className="sm:text-6xl text-5xl text-gray-500" />
          </div>

          <p className="mt-2 text-lg">No order placed yet.</p>
          <p className="text-center max-w-lg text-sm text-gray-600 mt-2 leading-normal">
            You have not placed any order yet. Please add items to your cart and
            checkout when you are ready to order.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyOrders;


