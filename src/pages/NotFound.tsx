import { Link } from "react-router-dom";
import animationData from "../assets/animations/404.json";
import Lottie from "react-lottie";

const NotFound = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="flex items-center justify-center w-full h-full flex-col">
      <Lottie options={defaultOptions} width={600}  height={600} />
      <Link to="/" className="bg-primary px-4 py-2 rounded-md mt-8 text-white tetx-sm cursor-pointer">Go To Home</Link>
    </div>
  );
};

export default NotFound;
