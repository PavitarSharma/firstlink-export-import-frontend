import React, { useState } from "react";
import useProducts from "../../hooks/queries/useProducts";
import { IProduct } from "../../types";
import { Pagination, Rating } from "@mui/material";
import { FiEdit } from "react-icons/fi";
import NoData from "../../components/layout/NoData";
import Loading from "../../components/layout/Loading";
import Search from "../../components/admin/Search";
import { useDebounce } from "../../hooks/useDebounce";
import { format } from "date-fns";
import { BsTrash3 } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const debounceSerach = useDebounce(search);
  const navigate = useNavigate();
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const {
    products,
    isLoading,
    totalPages,
    totals: totalCount,
  } = useProducts({
    page,
    limit,
    query: debounceSerach,
  });

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalCount);
  const calculateIndex = (pageIndex: number, index: number) => {
    return pageIndex * limit + index + 1;
  };

  return (
    <div>
      <Search
        placeholder="Serach..."
        value={search}
        onChange={handleSearchChange}
      />
      <div className="relative overflow-x-auto rounded-lg mt-4">
        {isLoading ? (
          <Loading />
        ) : products && products?.length > 0 ? (
          <>
            <div className="relative overflow-x-auto mt-4 rounded-lg">
              <table className="lg:w-full w-[900px] text-sm bg-white  shadow rounded-lg">
                <thead className="text-xs text-gray-700 uppercase whitespace-nowrap h-14 bg-white border-b">
                  <tr>
                    <th scope="col" className="px-6 py-3 ">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      PROUCT
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      CATEGORY
                    </th>
                    <th scope="col" className="px-6 py-3">
                      STOCK
                    </th>
                    <th scope="col" className="px-6 py-3">
                      PURCHASED
                    </th>
                    <th scope="col" className="px-6 py-3">
                      RATING
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Created On
                    </th>
                    <th scope="col" className="px-6 py-3">
                      LAST UPDATE
                    </th>

                    <th scope="col" className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((row: IProduct, index: number) => (
                    <tr
                      key={index}
                      className="border border-r-0 border-t-0 border-l-0 border-b border-b-gray-200 hover:bg-gray-50 transition duration-300 cursor-pointer "
                    >
                      <td className="px-6 py-3 text-center">
                        {calculateIndex(page - 1, index)}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="flex items-center  gap-2">
                          <img
                            src={row.images[0]?.medias[0].url}
                            alt={row.title}
                            className="w-9 h-9 rounded-full border object-cover"
                          />
                          <span className="font-medium line-clamp-1">
                            {row.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">{row.category}</td>
                      <td className="px-6 py-3 text-center">{row.stock}</td>
                      <td className="px-6 py-3 text-center">{row.purchased}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Rating
                            name="half-rating"
                            defaultValue={row.rating.rate}
                            precision={0.5}
                          />

                          <span className="text-slate-500 text-sm text-center">
                            {row.rating.count}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        {format(row.createdAt, "dd MMM, yyyy")}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        {format(row.updatedAt, "dd MMM, yyyy")}
                      </td>

                      <td className="px-6 py-3">
                        <div className="flex items-center justify-center gap-3">
                          <div
                            onClick={() =>
                              navigate(`/admin/product/edit-product/${row._id}`)
                            }
                          >
                            <FiEdit
                              size={18}
                              className="text-gray-600 cursor-pointer"
                            />
                          </div>
                          <button onClick={() => {}}>
                            <BsTrash3
                              size={16}
                              className="text-red-600 cursor-pointer"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-6 mt-6 flex lg:items-center lg:justify-between lg:flex-row flex-col  gap-6">
              <div className="flex flex-row items-center gap-3">
                <p className="text-gray-400">
                  {" "}
                  Showing {startIndex}-{endIndex} out of {totalCount}
                </p>

                <select
                  value={limit}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                    setLimit(Number(event.target.value))
                  }
                  className="p-2 border-gray-300 border rounded-md"
                >
                  {[10, 15, 20, 25].map((value, index) => (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <Pagination
                showFirstButton
                showLastButton
                count={totalPages}
                onChange={(_e, value) => setPage(value)}
                variant="outlined"
                shape="rounded"
                color="primary"
                page={page}
              />
            </div>
          </>
        ) : (
          <div className="mt-10">
            <NoData />
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
