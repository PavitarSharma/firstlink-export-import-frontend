import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ICartItem, IOrder } from "../../types";
import { axiosPrivate } from "../../config/api";
import { AxiosError } from "axios";
import { handleApiError } from "../../utils/handleApiError";
import Button from "../../components/layout/buttons/Button";
import { calculateCartTotals } from "../../utils/calculateTotal";
import formatPrice from "../../utils/formatPrice";
import { format } from "date-fns";
import serverErrorAnimation from "../../assets/animations/server-error.json";
import Lottie from "react-lottie";
import Loading from "../../components/layout/Loading";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axiosPrivate.get<IOrder>(`/orders/${orderId}`);
        
        
        setOrder(data);
      } catch (error) {
        let message;

        if (error instanceof AxiosError) {
          message = handleApiError(error);
        } else {
          message = "An unexpected error occurred.";
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
   
  }, [orderId]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: serverErrorAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (loading) {
    return <div className="mt-20">
    <Loading />
   </div>;
  }
  if (error) {
    return (
      <div>
        <Lottie width={400} height={400} options={defaultOptions} />
        <p className="text-center text-xl opacity-70">{error}</p>
      </div>
    );
  }
  if (!order) {
    return (
      <div className="text-center text-xl font-semibold flex items-center justify-center  mt-40">
        Order not found
      </div>
    );
  }

  return (
    <div className="container py-4 my-8 flex lg:flex-row flex-col gap-8">
      <div className="flex-1">
        <OrderConfirm order={order} />
      </div>
      <div className="lg:w-[500px] w-full">
        <OrderDetail order={order} />
      </div>
    </div>
  );
};

export default OrderSuccess;

const OrderConfirm = ({ order }: { order: IOrder }) => {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold">
        Thank you <span className="capitalize">{order?.customer?.name}</span>{" "}
        for your <br /> purchase!
      </h1>

      <div className="p-2 rounded-md mt-4 bg-white shadow">
        <p className="text-xl">Your order is confirmed</p>
        <p className="text-sm mt-2">
          You{"'"}ll be notify when it has been sent
        </p>
      </div>

      <div className="border rounded-md p-4 my-4 bg-white">
        <h4 className="text-xl">Order details</h4>

        <div className="flex items-center justify-between my-4">
          <div className="flex flex-col gap-1">
            <p className="mb-0">Contact Information</p>
            <p className="text-sm text-gray-600">{order?.customer?.email}</p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="mb-0">Payment method</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">
                {order?.paymentInfo?.type}
              </p>
              {"-"}
              <p className="text-sm text-gray-600">{order?.totalPrice}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between my-4">
          <div className="flex flex-col gap-1">
            <p className="mb-0">Shipping address</p>
            <div>
              <p className="text-sm text-gray-600">{order?.customer?.name}</p>
              <p className="text-sm text-gray-600">
                {order?.shippingAddress?.address}
              </p>
              <p className="text-sm text-gray-600">
                {order?.shippingAddress?.country}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="mb-0">Billing address</p>
            <div>
              <p className="text-sm text-gray-600">{order?.customer?.name}</p>
              <p className="text-sm text-gray-600">
                {order?.shippingAddress?.address}
              </p>
              <p className="text-sm text-gray-600">
                {order?.shippingAddress?.country}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[200px] mx-auto mt-6">
        <Button label="Continue Shopping" onClick={() => navigate("/shop")} />
      </div>
    </div>
  );
};

const OrderDetail = ({ order }: { order: IOrder }) => {
  const { total, subtotal, totalShipping } = calculateCartTotals(order?.cart);

  return (
    <div>
      <div className="w-full h-6 bg-gray-200 border shadow-lg rounded-full"></div>
      <div className="-mt-2 p-4 w-[96%] mx-auto rounded-md shadow relative order-confirm bg-white">
        <h1 className="text-xl font-semibold">Order Summary</h1>

        <div className="flex items-center justify-between my-8 border-t border-b border-gray-300 border-dashed py-4">
          <div className="flex flex-col items-center">
            <p className="text-gray-500 text-xs">Date</p>
            <p className="font-semibold text-xs">
              {format(order?.createdAt, "dd MMM, yyyy")}
            </p>
          </div>

          <div className="flex flex-col items-center border-l border-r border-gray-300 px-4">
            <p className="text-gray-500 text-xs">Order Number</p>
            <p className="font-semibold text-xs">{order?.orderId}</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-gray-500 text-xs">Payment Method</p>
            <p className="font-semibold text-xs">{order?.paymentInfo?.type}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {order?.cart?.map((item: ICartItem) => (
            <div key={item?._id} className="flex gap-2 w-full">
              <img
                src={item?.product?.image?.media.url}
                alt={item?.product?.title}
                className="rounded-md w-20 h-20 object-contain border"
              />

              <div className="flex flex-col gap-1">
                <h3 className="font-medium text-sm line-clamp-2">
                  {item?.product?.title}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    Quanitity: <span>{item?.quantity}</span>
                  </p>
                  <p className="text-gray-700">
                    {formatPrice(item?.product?.price, item?.product?.currency)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 py-4 border-t border-b border-gray-300 my-8">
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-70">Sub Total</p>
            <p className="text-sm opacity-70">{subtotal}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-70">Shipping</p>
            <p className="text-sm opacity-70">{totalShipping}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pb-4">
          <p className="font-semibold">Order Total</p>
          <p className="opacity-70">{total}</p>
        </div>
      </div>
    </div>
  );
};
