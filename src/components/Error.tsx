import Lottie from "react-lottie";
import serverErrorAnimation from "../assets/animations/server-error.json";

const Error = ({ error }: { error: string }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: serverErrorAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div>
      <Lottie width={400} height={400} options={defaultOptions} />
      <p className="text-center text-xl opacity-70">{error}</p>
    </div>
  );
};

export default Error;
