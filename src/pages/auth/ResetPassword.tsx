import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LuKeyRound } from "react-icons/lu";
import { FaCheckCircle, FaLongArrowAltLeft } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { ResetPasswordSchema } from "../../schemas";
import { axiosInstance } from "../../config/api";
import { AxiosError } from "axios";
import { handleApiError } from "../../utils/handleApiError";
import FormError from "../../components/layout/FormError";
import FormSuccess from "../../components/layout/FormSuccess";
import Input from "../../components/layout/inputs/Input";
import Button from "../../components/layout/buttons/Button";
import { Link, useSearchParams } from "react-router-dom";
import { IoMailOpenOutline } from "react-icons/io5";

type Schema = z.infer<typeof ResetPasswordSchema>;

const ResetPassword = () => {
  const [params] = useSearchParams()
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const token = params.get("token")
  

  const {
    register,
    formState: { errors, dirtyFields, touchedFields },
    handleSubmit,
    watch,
    reset,
  } = useForm<Schema>({
    resolver: zodResolver(ResetPasswordSchema),
  });


  const onSubmit = async (values: Schema) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const responseData = {
        ...values,
        newPassword: values.password,
        token,
      };
      const { data } = await axiosInstance.patch(
        "/customers/reset-password",
        responseData
      );

      setSuccess(data.message);
      reset()
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

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Validation functions
  const validations: Record<string, () => boolean> = {
    "Minimum 8 Characters": () => !!password && password.length >= 8,
    Number: () => !!password && /\d/.test(password),
    Letter: () => !!password && /\w/.test(password),
    "Special Character": () => !!password && /\W/.test(password),
    "Passwords Match": () => {
      return !!password && !!confirmPassword && dirtyFields.confirmPassword
        ? password === confirmPassword
        : false;
    },
  };

  return (
    <div className="container py-4 my-8">
      <div className="max-w-lg w-full mx-auto">
        <div className="border px-2 py-1 rounded flex items-center justify-center mb-6 w-12 mx-auto">
          <IoMailOpenOutline size={24} className="opacity-70" />
        </div>
        <div className="mb-8">
          <h2 className="sm:text-2xl text-xl font-bold text-center">
            Set new password.
          </h2>
          <p className="text-center text-sm opacity-70 mt-2">
            Must be atleast 8 characters
          </p>
        </div>
        <form className="bg-white border border-gray-300 rounded p-4 flex flex-col gap-4">
          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}

          <Input
            type="password"
            id="password"
            register={register}
            label="Password"
            error={errors.password?.message}
            icon={LuKeyRound}
            placeholder="***************"
          />
          <Input
            type="password"
            id="confirmPassword"
            register={register}
            label="Confirm Password"
            error={errors.confirmPassword?.message}
            icon={LuKeyRound}
            placeholder="***************"
          />

          <div>
            <p className="opacity-70">Password must contains</p>

            <div className="flex flex-col gap-2 my-2">
              {Object.entries(validations).map(([title, validationFn]) => (
                <PassowrdValidation
                  key={title}
                  title={title}
                  isValid={validationFn()}
                  isError={
                    title === "Passwords Match"
                      ? (!!password || !!confirmPassword) && !validationFn()
                      : !!touchedFields.password &&
                        !!touchedFields.confirmPassword &&
                        !validationFn()
                  }
                />
              ))}
            </div>
          </div>

          <Button disabled={loading} loading={loading} label="Reset Password" onClick={handleSubmit(onSubmit)} />

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

export default ResetPassword;

const PassowrdValidation = ({
  title,
  isValid,
  isError,
}: {
  title: string;
  isValid?: boolean;
  isError?: boolean;
}) => {
  return (
    <div className="flex items-center gap-2">
      {isError ? (
        <IoIosCloseCircle size={18} className="text-red-600" />
      ) : (
        <FaCheckCircle
          size={16}
          className={isValid ? "text-green-600" : "text-gray-400"}
        />
      )}

      <span className="text-sm font-medium text-gray-600">{title}</span>
    </div>
  );
};
