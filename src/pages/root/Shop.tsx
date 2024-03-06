import { useState } from "react";
import Filter from "../../components/products/Filter";
import ListView from "../../components/products/ListView";
import Product from "../../components/products/Product";
import Topbar from "../../components/products/Topbar";
import useProducts from "../../hooks/queries/useProducts";
import { useAppSelector } from "../../redux/hooks";
import { ProductState } from "../../redux/slices/productSlice";
import { IProduct } from "../../types";
import { Pagination } from "@mui/material";
import { useDebounce } from "../../hooks/useDebounce";
import NoData from "../../components/layout/NoData";
import Loading from "../../components/layout/Loading";

const Shop = () => {
  const [limit] = useState(9);
  const [page, setPage] = useState(1);
  const { view, sort, type, size, category, color, price, searchTerm } =
    useAppSelector(ProductState);
    const debouncedSearch = useDebounce(searchTerm);
    const debouncePrice = useDebounce(Number(price))
  const params = {
    page,
    limit,
    category,
    color,
    price: debouncePrice,
    size,
    sort: sort.value,
    type,
    query: debouncedSearch
  };
  const { products, isLoading, totalPages, totals } = useProducts(params);

  return (
    <div className="flex gap-4 container my-10">
      <div className="w-[250px] lg:h-[1100px] rounded-md lg:block hidden">
        <Filter setPage={setPage}  />
      </div>

      <div className="flex-1 mb-40">
        <Topbar products={products} setPage={setPage} totals={totals || 0}  />
        <div className="mb-8">
          {isLoading ? (
            <div className="mt-20">
             <Loading />
            </div>
          ) :  products?.length > 0 ? (
            view === "grid" ? (
              <div className="grid  md:grid-cols-3 min-[476px]:grid-cols-2 grid-cols-1 gap-4">
                {products.map((product: IProduct) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {products.map((product: IProduct) => (
                  <ListView key={product._id} product={product} />
                ))}
              </div>
            )
          ) : (
           <div>
            <NoData />
           </div>
          )}
        </div>
        {!isLoading && <div className="flex items-center justify-center">
            <Pagination
              count={totalPages}
              variant="outlined"
              shape="rounded"
              onChange={(_e, value) => setPage(value)}
              showFirstButton
              showLastButton
              sx={{
                color: "#FF5252",
                "& .MuiPaginationItem-root": {
                  color: "#FF5252",
                  "&:hover": {
                    background: "#FF5252",
                    color: "white",
                  },
                },
                "&:active": {
                  background: "#FF5252",
                  color: "white",
                },
              }}
            />
          </div>}
      </div>
    </div>
  );
};

export default Shop;
