import { useEffect, useState } from "react";
import { FaCheckCircle, FaRegClock, FaExclamationCircle } from "react-icons/fa";
import { AxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../config/api";
import { handleApiError } from "../../utils/handleApiError";
import { sendVerificationMail } from "../../services";
import Button from "../../components/layout/buttons/Button";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const token = params.get("token");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);


  useEffect(() => {
    const verifyToken = async () => {
      setError("");
      try {
        await axiosInstance.post("/customers/verify", { token, email });
        setError("");
        setSuccess(true);
      } catch (error) {
        let message;

        if (error instanceof AxiosError) {
          message = handleApiError(error);
        } else {
          message = "An unexpected error occurred.";
        }
        setError(message);
      }
    };
    verifyToken();
  }, [token, email]);
  
  const sendVerificationEmail = async () => {
    setError("");
    setSuccess(false);
    const loading = toast.loading("Sending...");
    try {
      const data = await sendVerificationMail(email);
      if (data) {
        setError("");
        setSuccess(true);
      }
    } catch (error) {
      let message;

      if (error instanceof AxiosError) {
        message = handleApiError(error);
      } else {
        message = "An unexpected error occurred.";
      }
      setError(message);
      toast.error(message, { position: "top-center" });
    } finally {
      toast.dismiss(loading);
    }
  };

  return (
    <div className="container py-4 my-8">
      {error && (
        <div className="max-w-lg w-full mx-auto">
          {error === "Verification token has expired" ? (
            <>
              <h2 className="text-center mb-8 text-xl font-semibold">
                Token Expired
              </h2>
              <div className="flex flex-col items-center justify-center">
                <FaRegClock className="sm:text-[200px] text-[150px] text-red-600" />
                <p className="text-center text-sm text-gray-600 my-3">
                  {error}
                </p>

                <div className="mt-3">
                  <Button
                    label="Resend Verification Email"
                    onClick={sendVerificationEmail}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-center mb-8 text-xl font-semibold">Error</h2>
              <div className="flex flex-col items-center justify-center">
                <FaExclamationCircle className="sm:text-[200px] text-[150px] text-red-600" />
                <p className="text-center text-lg text-gray-600 my-3">
                  {error}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {success && (
        <div className="max-w-lg w-full mx-auto">
          <h2 className="text-center mb-8 text-xl font-semibold">
            Account Activated
          </h2>
          <div className="flex flex-col items-center justify-center">
            <FaCheckCircle className="sm:text-[200px] text-[150px] text-green-600" />
            <p className="text-center text-sm text-gray-600 my-3">
              Thank you, your email has been successfully verified. Your account
              is now active. Please use the below to login to your account.
            </p>

            <div className="mt-3">
              <Button
                label="Login To Your Account"
                onClick={() => navigate("/auth/login")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;

