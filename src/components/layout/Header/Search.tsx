import React, { useCallback } from "react";
import { IoSearchOutline, IoClose } from "react-icons/io5";
import useProducts from "../../../hooks/queries/useProducts";
import { useDebounce } from "../../../hooks/useDebounce";
import { IProduct } from "../../../types";
import { Link } from "react-router-dom";
import { calculateDiscountedPrice } from "../../../utils/calculateTotal";
import formatPrice from "../../../utils/formatPrice";

interface ISeracgProps {
  value: string;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  setOpenSerach: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
}
const Search: React.FC<ISeracgProps> = ({ setOpenSerach, value, onChange, setSearchTerm }) => {
  const handleClose = useCallback(() => {
    setOpenSerach(false)
    setSearchTerm("")
  }, [setSearchTerm, setOpenSerach]);
  const debounceSerach = useDebounce(value)

  const {products} = useProducts({ query: debounceSerach})


  return (
    <div className="flex items-center gap-4 max-w-4xl mx-auto h-full w-full">
      <div className="flex-1  h-12 relative rounded-md border border-primary bg-gray-50">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Search your product from here..."
          className="w-full h-full border-0 outline-none pl-12 px-4 rounded-md bg-transparent text-sm text-gray-900"
        />
        <button className="absolute left-4 top-1/2 -translate-y-1/2">
          <IoSearchOutline size={22} className="text-gray-700" />
        </button>

       {
        value.length > 0 && products && products.length > 0 &&  <div className="bg-white shadow max-h-[400px] overflow-y-auto w-full left-0 right-0 ">
{
  products.map((product: IProduct, index: number) => {
    const discount = calculateDiscountedPrice(product?.price, product?.discountPrice);
    const formatDicountPrice = formatPrice(discount, product?.currency);
    return <Link onClick={handleClose} key={index} to={`/product/${product?._id}`} className="p-2 flex items-center justify-between cursor-pointer">
      <div className="flex items-center gap-3">
        <img src={product?.images[0].medias[0].url} alt={`product-${product?._id}`} className="w-12 h-12 object-contain rounded-md" />
        <span className="text-sm ">{product?.title?.length > 20 ? product?.title.substring(0, 20) + "...." : product?.title}</span>
      </div>
      <span className="text-primary font-semibold text-sm">{formatDicountPrice}</span>
    </Link>
  })
}
        </div>
       }
      </div>
      <button
        onClick={handleClose}
        className=" w-14 h-12 border border-primary rounded-md flex items-center justify-center"
      >
        <IoClose size={20} className="text-primary" />
      </button>
    </div>
  );
};

export default Search;
