/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { CartState, removeAllFromCart } from "../../../../redux/slices/cartSlice";
import { calculateCartTotalPrice } from "../../../../utils/calculateTotal";
import { axiosPrivate } from "../../../../config/api";
import toast from "react-hot-toast";

import { AxiosError } from "axios";
import { handleApiError } from "../../../../utils/handleApiError";
import { createOrder } from "../../../../services";
import { generateId } from "../../../../utils/generateId";
declare global {
  interface Window {
    Razorpay: any;
  }
}
export interface StepThreeRef {
  paymentMode: string;
  razorpayPaymentHandler: () => void;
  cashOnDeliveryHandler: () => void;
  razorPaySuccess: boolean;
  isLoading: boolean
}

interface StepThreeProps {
  getValues: any;
  setComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

const StepThree: React.ForwardRefRenderFunction<
  StepThreeRef,
  StepThreeProps
> = ({ getValues, setComplete }, ref) => {
  const [paymentMode, setPaymentMode] = useState("");
  const navigate = useNavigate();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const { carts } = useAppSelector(CartState);
  const { total: totalAmount, currencyCode } = calculateCartTotalPrice(carts);
  const [razorPaySuccess, setRazorPaySuccess] = useState(false)
  const dispatch = useAppDispatch()

  // const paymentMode =
  //   active === 1
  //     ? "Razorpay"
  //     : "Cash on Delivery"

  const togglePaymenyMode = (val: string) => setPaymentMode(val);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  
  const createOrderMutataion = async (payment: any) => {
    const orderData = {
      cart: carts,
      totalPrice: totalAmount,
      shippingAddress: {
        city: getValues("city"),
        state: getValues("state"),
        country: getValues("country"),
        zipcode: getValues("zipcode"),
        address: getValues("address"),
      },
      orderId: payment.razorpay_order_id,
      paymentInfo: {
        id: payment.razorpay_payment_id,
        status: payment ? "Success": "Pending",
        type: "Razorpay",
      },
      customer: {
        name: getValues("name"),
        email: getValues("email"),
        phone: getValues("phone"),
      },
    };
    try {
      const data = await createOrder(orderData);
      dispatch(removeAllFromCart())
      toast.success("Order Placed Successfully");
      navigate(`/success/${data._id}`);
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
  const razorpayPaymentHandler = async () => {

  
    try {
      const { data } = await axiosPrivate.post("/payment/process", {
        amount: totalAmount,
        currency: currencyCode,
        receipt: getValues("email"),
      });

      if (window.Razorpay && scriptLoaded) {
        const options = {
          key: data.key, // Your Razorpay API key
          amount: data.payment.amount,
          currency: data.payment.currency,
          order_id: data.payment.id,
          name: "Firstlink Export & Import",
          image: "https://your-company-logo.png",
          handler: async function (response: any) {
            await createOrderMutataion(response);
            setRazorPaySuccess(true);
            setComplete(true);
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
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

  const cashOnDeliveryHandler = async () => {
    const paymentId = generateId(16);
    const orderId = generateId(16);
    const orderData = {
      cart: carts,
      totalPrice: totalAmount,
      shippingAddress: {
        city: getValues("city"),
        state: getValues("state"),
        country: getValues("country"),
        zipcode: getValues("zipcode"),
        address: getValues("address"),
      },
      orderId: `order_${orderId}`,
      paymentInfo: {
        id: `pay_${paymentId}`,
        status: "Pending",
        type: "Cash On Delivery",
      },
      customer: {
        name: getValues("name"),
        email: getValues("email"),
        phone: getValues("phone"),
      },
    };
    toast.success("Success")
    const loading = toast.loading("Loading...")
    setIsLoading(true)
    try {
      const data = await createOrder(orderData);
      dispatch(removeAllFromCart())
      toast.success("Order Placed Successfully");
      setComplete(true);
      navigate(`/success/${data._id}`);
    } catch (error) {
      let message;

      if (error instanceof AxiosError) {
        message = handleApiError(error);
      } else {
        message = "An unexpected error occurred.";
      }

      toast.error(message);
    }finally {
      toast.dismiss(loading)
      setIsLoading(false)
    }
  };

  useImperativeHandle(ref, () => ({
    paymentMode,
    razorpayPaymentHandler,
    cashOnDeliveryHandler,
    razorPaySuccess,
    isLoading
  }));

  return (
    <div className="flex flex-col gap-4">
      <div
        onClick={() => togglePaymenyMode("Razorpay")}
        className="w-full bg-white shadow-sm rounded-md p-4 border relative cursor-pointer"
      >
        <div className="flex items-center gap-2">
        <div
            className={`w-6 h-6 flex items-center justify-center rounded-full ${
              paymentMode === "Razorpay" && "border border-primary"
            }`}
          >
            <div
              className={`w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-full outline-none ${
                paymentMode === "Razorpay" && "bg-primary"
              }`}
            ></div>
          </div>
          <p className="font-medium">Pay With Card</p>
        </div>

        {/* {active === 2 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`py-4 bg-white transition duration-300`}
          >
            <div className="max-w-[200px] w-full">
              <Button label="Pay Now" onClick={razorpayPaymentHandler} />
            </div>
          </div>
        )} */}
      </div>

      <div
        onClick={() => togglePaymenyMode("Cash on Delivery")}
        className="w-full bg-white shadow-sm rounded-md p-4 border relative cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6  flex items-center justify-center rounded-full ${
              paymentMode === "Cash on Delivery" && "border border-primary"
            }`}
          >
            <div
              className={`w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-full outline-none ${
                paymentMode === "Cash on Delivery" && "bg-primary"
              }`}
            ></div>
          </div>
          <p className="font-medium">Cash On Delivery</p>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(StepThree);
