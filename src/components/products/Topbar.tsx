/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import { BsGrid } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import { MdFormatListBulleted } from "react-icons/md";
import { IProduct } from "../../types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ProductState, setSort, setView } from "../../redux/slices/productSlice";
import Filter from "./Filter";
import ReactSelect from "../layout/inputs/ReactSelect";
import { IoMdClose } from "react-icons/io";

interface ITopbarProps {
  products: IProduct[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totals: number
}


const sortOptions = [
  { label: "Name, A to Z", value: "Name, A to Z" },
  { label: "Name, Z to A", value: "Name, Z to A" },
  { label: "Price, low to high", value: "Price, low to high" },
  { label: "Price, high to low", value: "Price, high to low" },
  { label: "Date added, oldest to newest", value: "Date added, oldest to newest" },
  { label: "Date added, newest to oldest", value: "Date added, newest to oldest" }
];
const Topbar: React.FC<ITopbarProps> = ({  setPage, totals }) => {
  const dispatch = useAppDispatch();
  const { view, sort } = useAppSelector(ProductState);
  const [openFilter, setOpenFilter] = useState(false);

  const toggleFilter = useCallback(() => setOpenFilter((prev) => !prev), []);
  return (
    <div className="w-full py-4  flex md:items-center justify-between md:flex-row flex-col gap-6 relative">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button onClick={() => dispatch(setView("grid"))}>
            <BsGrid
              size={22}
              className={`${view === "grid" ? "text-primary" : "text-black"}`}
            />
          </button>
          <button onClick={() => dispatch(setView("list"))}>
            <MdFormatListBulleted
              size={24}
              className={`${view === "list" ? "text-primary" : "text-black"}`}
            />
          </button>
        </div>
        <p>There are totals {totals} products</p>
      </div>

      <div className="flex items-center gap-4">
        <p className="md:block hidden">Sort By: </p>
        <ReactSelect
          onChange={(option: any) => dispatch(setSort(option))}
          value={sort}
          options={sortOptions}
          width="300px"
        />
       
        
        <button
            onClick={toggleFilter}
          className="lg:hidden  border w-10 flex items-center justify-center h-10 rounded-md border-gray-300 cursor-pointer"
        >
          <FaFilter size={18} />
        </button>
      </div>
   
      {openFilter && (
       <div className="fixed inset-0 bg-black/30 z-[1000]">
         <div className="fixed left-0 top-0 bottom-0 h-screen  w-[280px] bg-white shadow-xl border rounded-md overflow-y-auto">
          <Filter setPage={setPage} />
         
        </div>
        <button onClick={toggleFilter} className="absolute top-4 left-[280px] text-white font-semibold cursor-pointer bg-primary flex items-center justify-center h-8 w-8 rounded-full">
          <IoMdClose />
          </button>
       </div>
      )}
    </div>
  );
};

export default Topbar;
