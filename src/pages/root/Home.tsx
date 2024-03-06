import Product from "../../components/products/Product";
import useProducts from "../../hooks/queries/useProducts";
import NoData from "../../components/layout/NoData";
import { IProduct } from "../../types";
import { useState } from "react";
import Loading from "../../components/layout/Loading";
import { Link } from "react-router-dom";
import Banner from "../../components/layout/Banner";

const Home = () => {
  const [limit] = useState(20);
  const [page] = useState(1);
  const { products, isLoading } = useProducts({ limit, page });

  return (
    <>
    <Banner />
    <div className="container my-10 ">
      {isLoading ? (
        <div className="mt-20">
          <Loading />
        </div>
      ) : products && products?.length > 0 ? (
        <>
          <div className="grid  xl:grid-cols-4 min-[868px]:grid-cols-3 min-[528px]:grid-cols-2 grid-cols-1 gap-4">
            {products.slice(0, 12).map((product: IProduct) => (
              <div key={product._id} className="px-2">
                <Product product={product} />
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center w-full justify-end">
            <Link to="/shop" className="hover:underline text-primary font-semibold text-lg">View More</Link>
          </div>
        </>
      ) : (
        <div>
          <NoData />
        </div>
      )}
    </div>
    </>
  );
};

export default Home;
