import {  useState } from "react";
import { ForgotPasswordSchema} from "../../schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { axiosInstance } from "../../config/api";
import { AxiosError } from "axios";
import { handleApiError } from "../../utils/handleApiError";
import FormError from "../../components/layout/FormError";
import FormSuccess from "../../components/layout/FormSuccess";
import Input from "../../components/layout/inputs/Input";
import { IoMailOutline } from "react-icons/io5";
import Button from "../../components/layout/buttons/Button";
import { Link } from "react-router-dom";
import Lottie from "react-lottie";
import animationData from "../../assets/animations/forgot-password.json";
import { FaLongArrowAltLeft } from "react-icons/fa";

type Schema = z.infer<typeof ForgotPasswordSchema>;

const ForgotPassword = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(ForgotPasswordSchema),
  });



  const onSubmit = async (values: Schema) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await axiosInstance.post("/customers/forgot-password", values);
      
     
     setSuccess(data.message);
     
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


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex min-h-screen relative items-center">
      <div className="lg:w-1/2 w-full">
        <Lottie options={defaultOptions} />
      </div>
      <div className="px-4 flex items-center justify-center h-full lg:w-1/2 w-full lg:static absolute">
        <form className="bg-white border border-gray-300 rounded-md p-4 flex flex-col gap-4 max-w-lg w-full mx-auto">
          <h1 className="text-2xl font-bold">Create Account</h1>
          
          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}

          <Input
            type="email"
            id="email"
            register={register}
            label="Email Address"
            error={errors.email?.message}
            icon={IoMailOutline}
            placeholder="john.doe@email.com"
          />

          <Button
            disabled={isLoading}
            loading={isLoading}
            label="Reset password"
            onClick={handleSubmit(onSubmit)}
          />

          <Link
            to={"/auth/login"}
            className="flex text-center justify-center items-center opacity-70 text-sm hover:text-primary transition"
          >
            <FaLongArrowAltLeft />
            <span className="ml-1">Back to login</span>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
