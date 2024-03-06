import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  ProductState,
  reset,
  setCategory,
  setPrice,
  setResetCategory,
  setResetSize,
  setSearchTerm,
  setSize,
  setType,
} from "../../redux/slices/productSlice";
import React, { useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";

const clothesSizes = [
  "Small",
  "Medium",
  "Large",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
  "6XL",
];
const hairSizes = [
  "10",
  "12",
  "14",
  "16",
  "18",
  "20",
  "22",
  "24",
  "26",
  "28",
  "30",
];

const Filter = ({setPage}: {setPage: React.Dispatch<React.SetStateAction<number>>}) => {
  const dispatch = useAppDispatch();
  const { category, size, type, searchTerm, price } =
    useAppSelector(ProductState);

    useEffect(() => {
      if(type === "Shoes"){
        dispatch(setSize(1))
      }
    }, [dispatch, type])

  const handleSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    val?: string
  ) => {
    if (type === "Shoes") {
      dispatch(setSize(event.target.value));
    } else {
      dispatch(setSize(val));
    }
    setPage(1)
  };

  const handleTypeChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    val: string
  ) => {
    dispatch(setType(val));
    dispatch(setResetSize());
    dispatch(setResetCategory());
  };

  const handleSerachChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
    setPage(1)
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPrice(event.target.value));
    setPage(1)
  };

  const handleCategoryChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    val?: string
  ) => {
    dispatch(setCategory(val));
    setPage(1)
  };

  return (
    <div className="w-full lg:h-auto h-[450px] overflow-y-auto bg-white">
      <div className="py-4 text-center w-full border-b  flex items-center justify-between px-4">
        <p className="font-semibold"> Filter By</p>
        <div
          onClick={() => {
            dispatch(reset());
          }}
          className="border border-gray-300 rounded-md cursor-pointer py-1 px-2"
        >
          <span className="text-sm">Clear All</span>
        </div>
      </div>

      <div className="px-4">
        <div className="border h-10 mt-4 w-full relative rounded-md">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSerachChange}
            placeholder="Search product by name..."
            className="w-full h-full border-0 outline-0 font-medium rounded-md pl-8 text-xs"
          />
          <IoSearchOutline className="absolute top-1/2 left-2 -translate-y-1/2" />
        </div>
      </div>

      <div className="py-4 px-4">
        <Title title="Type" />
        <div className="flex flex-col gap-2 mt-2">
          {["Clothes", "Hair", "Shoes"].map((val: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <input
                id={val}
                type="checkbox"
                checked={type === val}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleTypeChange(event, val)
                }
              />
              <label htmlFor={val} className="text-sm">
                {val}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="py-4 px-4">
       <div className="flex items-center gap-2">
       <Title title="Price" />
       <span className="text-xs">{price}</span>
       </div>
        <div className="relative mt-4">
          <span className="absolute -top-4 left-0 text-sm">1</span>
          <span className="absolute -top-4 right-0 text-sm">20,000</span>
          <input
            id="price"
            type="range"
            min={1}
            max={20000}
            value={price}
            onChange={handlePriceChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      <div className="py-4 px-4">
        <Title title="Size" />

        {type === "Clothes" &&
          clothesSizes.map((val: string, index: number) => (
            <div key={index} className="flex items-center gap-2 my-2">
              <input
                id={val}
                type="checkbox"
                checked={size === val}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleSizeChange(event, val)
                }
              />
              <label htmlFor={val} className="text-sm">
                {val}
              </label>
            </div>
          ))}
        {type === "Hair" &&
          hairSizes.map((val: string, index: number) => (
            <div key={index} className="flex items-center gap-2 my-2">
              <input
                id={val}
                type="checkbox"
                checked={size === val}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleSizeChange(event, val)
                }
              />
              <label htmlFor={val} className="text-sm">
                {val}
              </label>
            </div>
          ))}

        {type === "Shoes" && (
          <div className="relative mt-4">
            <span className="absolute -top-4 left-0 text-sm">1</span>
            <span className="absolute -top-4 right-0 text-sm">14</span>
            <input
              id="price"
              type="range"
              min={1}
              max={14}
              value={size}
              onChange={handleSizeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
      </div>

      <div className="py-4 px-4">
        <Title title="Category" />

        {type === "Clothes" &&
          ["Mens", "Womens", "Boys", "Girls"].map(
            (val: string, index: number) => (
              <div key={index} className="flex items-center gap-2 my-2">
                <input
                  id={val}
                  type="checkbox"
                  checked={category === val}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleCategoryChange(event, val)
                  }
                />
                <label htmlFor={val} className="text-sm">
                  {val}
                </label>
              </div>
            )
          )}
        {type === "Hair" &&
          ["Human Hair", "Straight Hair", "Curly Hair"].map(
            (val: string, index: number) => (
              <div key={index} className="flex items-center gap-2 my-2">
                <input
                  id={val}
                  type="checkbox"
                  checked={category === val}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleCategoryChange(event, val)
                  }
                />
                <label htmlFor={val} className="text-sm">
                  {val}
                </label>
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default Filter;

const Title = ({ title }: { title: string }) => {
  return <h4 className="font-medium">{title}</h4>;
};
