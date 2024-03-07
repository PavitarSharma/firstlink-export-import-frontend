import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="text-xl font-semibold cursor-pointer flex items-center gap-2">
      <div className="flex flex-col relative">
      <span className="sm:text-4xl text-[28px] font-montez text-primary opacity-90">Clothes & Hair</span>
      <span className="text-[10px] sm:tracking-widest tracking-wide absolute  -bottom-4 left-4 text-gray-900 font-dancing-script">FirstLink Export & Import</span>
      </div>
    </Link>
  );
};

export default Logo;
