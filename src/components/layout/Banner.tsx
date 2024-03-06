import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div
      style={{
        backgroundImage: `url('/images/hero.png')`,
        backgroundPosition: "top top",
      }}
      className="md:min-h-[550px] min-h-[450px] flex items-center justify-center w-full bg-cover bg-no-repeat"
    >
     <div className="w-full h-full p-4 font-bold text-white flex flex-col items-center justify-center z-10">
        <h1 className="sm:text-5xl text-3xl text-center font-serif">The new way to diplay the products</h1>

        <Link to="/shop" className="bg-primary px-4 py-3 rounded-md text-sm mt-6 cursor-pointer">Explore Now</Link>
     </div>
    </div>
  );
};

export default Banner;
