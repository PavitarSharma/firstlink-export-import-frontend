/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { ICartItem, IImage, IProduct, TMedia } from "../../types";
import { axiosInstance } from "../../config/api";
import { AxiosError } from "axios";
import { handleApiError } from "../../utils/handleApiError";
import Lottie from "react-lottie";
import serverErrorAnimation from "../../assets/animations/server-error.json";
import Slider from "react-slick";
import {
  MdChevronLeft,
  MdChevronRight,
  MdShoppingBasket,
} from "react-icons/md";
import formatPrice from "../../utils/formatPrice";
import { Rating } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  CartState,
  addProductsToCart,
  decrementQuantity,
  incrementQuantity,
} from "../../redux/slices/cartSlice";
import { calculateDiscountedPrice } from "../../utils/calculateTotal";
import { UserState } from "../../redux/slices/userSlice";
import toast from "react-hot-toast";
import {
  addToCart,
  addToWishlist,
  decreaseCartQuantity,
  increaseCartQuantity,
} from "../../services";
import {
  addProductToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";
import AddToCart from "../../components/layout/AddToCart";
import { IoIosHeartEmpty } from "react-icons/io";
import { ProductState, setImage } from "../../redux/slices/productSlice";
import ProductReview from "../../components/products/Review";
import { useParams } from "react-router-dom";
import Loading from "../../components/layout/Loading"

const Product = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const [product, setProduct] = useState<IProduct | null>(null);
  const { image } = useAppSelector(ProductState);
  const [tab, setTab] = useState("Description");

  useEffect(() => {

    const fetchData = async () => {
      setError("")
      try {
        const { data } = await axiosInstance.get(`/products/${id}`);

        setProduct(data);
      } catch (error) {
        let message;

        if (error instanceof AxiosError) {
          message = handleApiError(error);
        } else {
          message = "An unexpected error occurred.";
        }
        setError(message);

      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    
  }, [id]);

  useEffect(() => {
    if (product?.images) {
      dispatch(setImage(product.images[0]));
    }
  }, [dispatch, product?.images]);

  const toggleTab = useCallback((val: string) => setTab(val), []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: serverErrorAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };


  return (
    <div className="container my-8">
      {isLoading ? (
        <div className="mt-10">
          <Loading />
        </div>
      ) : !product ? (
        <div>Product Not Found</div>
      ) : error.length > 0 ? (
        <div>
        <Lottie width={400} height={400} options={defaultOptions} />
        <p className="text-center text-xl opacity-70">{error}</p>
      </div>
      ) : (
        <>
          <div className="flex items-start gap-6 lg:flex-row flex-col">
            <div className="lg:w-[450px] w-full mx-auto lg:mt-2 flex items-center justify-center flex-col">
              <ProductImage images={image} />
            </div>

            <div className="flex-1 w-full">
              <ProductView product={product} />
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center gap-6 mb-2">
              {["Description", "Review"].map((val: string) => (
                <button
                  key={val}
                  onClick={() => toggleTab(val)}
                  className={`${
                    val === tab
                      ? "text-primary font-semibold"
                      : "text-gray-800 font-normal"
                  } text-lg`}
                >
                  {val}
                </button>
              ))}
            </div>

            {tab === "Description" && (
              <div className="border border-gray-300 rounded-md p-4">
                <p className="text-sm leading-normal opacity-90 tracking-wide">
                  {product?.description}
                </p>
              </div>
            )}

            {tab === "Review" && (
              <div>
                <ProductReview product={product} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Product;

const ProductImage = ({ images }: { images: TMedia }) => {
  const sliderRef = useRef<Slider | null>(null);
  const [selectImage, setSelectImage] = useState(0);

  const settings = {
    dots: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    swipeToSlide: true,
    adaptiveHeight: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const goNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const goPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleSelectImage = useCallback(
    (index: number) => setSelectImage(index),
    []
  );
  const handleMouseHover = useCallback(
    (index: number) => setSelectImage(index),
    []
  );

  return (
    <>
      <div className="h-[400px] sm:w-[450px] w-full border rounded-md bg-white">
        <img
          src={images?.medias[selectImage]?.url}
          alt={`product.${images?.medias[selectImage]?.id}`}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="sm:w-[450px] w-full mt-4 relative">
        <button
          onClick={goPrev}
          className={`w-6 h-6 rounded-full border border-gray-400/50 bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white hover:border-0 transition text-gray-700 absolute -left-2 top-1/2 -translate-y-1/2 z-10`}
        >
          <MdChevronLeft size={18} />
        </button>
        <button
          onClick={goNext}
          className={`w-6 h-6 rounded-full border border-gray-400/50 bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white hover:border-0 transition text-gray-700 absolute -right-2 top-1/2 -translate-y-1/2 z-10`}
        >
          <MdChevronRight size={18} />
        </button>
        <Slider ref={sliderRef} {...settings}>
          {images?.medias?.map((image: IImage, index: number) => (
            <div
              key={index}
              onMouseEnter={() => handleMouseHover(index)}
              onClick={() => handleSelectImage(index)}
              className="px-2"
            >
              <img
                src={image.url}
                alt={`product-image-${index}`}
                className="rounded cursor-default border object-contain w-full h-[120px] bg-white"
                loading="lazy"
              />
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

const ProductView = ({ product }: { product: IProduct }) => {
  const {
    _id,
    images,
    title,
    price,
    discountPrice,
    currency,
    like,
    stock,
    rating,
  } = product;
  const { isAuth } = useAppSelector(UserState);
  const dispatch = useAppDispatch();
  const { image } = useAppSelector(ProductState);
  const [isLike, setIsLike] = useState(like);
  const { carts } = useAppSelector(CartState);
  const totalQuantityInCart = carts
    .filter((item: ICartItem) => item.product._id === _id)
    .reduce((total, item) => total + item.quantity, 0);
  const toggleSelectSize = useCallback(
    (size: string) => setSelectSize(size),
    []
  );
  
  const [selectSize, setSelectSize] = useState(product?.sizes[0]);
  const discount = calculateDiscountedPrice(price, discountPrice);
  const formatDicountPrice = formatPrice(discount, currency);

  const purchased = product.purchased;
  const remainingStock = stock - purchased;
  const stockPercentage = (remainingStock / stock) * 100;

  const handleAddToWishlist = async () => {
    if (!isAuth) {
      toast.error("Please log in to add products to your wishlist.");
      return;
    } else {
      try {
        const updatedLike = !isLike;
        setIsLike(updatedLike);

        if (updatedLike) {
          const data = await addToWishlist(_id);

          dispatch(addProductToWishlist(data));
          toast.success("Added To Wishlist");
        } else {
          const data = await addToWishlist(_id);
          dispatch(removeFromWishlist(data));
          toast.success("Removed From Wishlist");
          return data;
        }
      } catch (error) {
        let message;

        if (error instanceof AxiosError) {
          message = handleApiError(error);
        } else {
          message = "An unexpected error occurred.";
        }
        toast.error(message);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!isAuth) {
      toast.error("Please log in to add products to your cart.");
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { sizes, images, discountPrice, price, ...updatedProductCart } = {
        ...product,
        size: product.sizes[0],
        image: {
          media: image.medias[0],
          color: image.color,
        },
      };

      const cartProduct = {
        ...updatedProductCart,
        price: discount,
      };

      await addToCart(cartProduct, 1);
      dispatch(addProductsToCart(cartProduct));
      toast.success("Added To Cart");
    } catch (error) {
      let message;

      if (error instanceof AxiosError) {
        message = handleApiError(error);
      } else {
        message = "An unexpected error occurred.";
      }
      toast.error(message);
    }
  };

  const handleincrementQuantity = async () => {
    if (!isAuth) {
      toast.error("Please log in to increase cart quantity.");
      return;
    }
    if (totalQuantityInCart >= stock) {
      toast.error("Insufficient stock");
      return;
    } else {
      try {
        dispatch(incrementQuantity(_id));
        await increaseCartQuantity(_id);
      } catch (error) {
        let message;

        if (error instanceof AxiosError) {
          message = handleApiError(error);
        } else {
          message = "An unexpected error occurred.";
        }
        toast.error(message);
      }
    }
  };

  // Decrement quantity function
  const handleDecrementQuantity = async () => {
    if (!isAuth) {
      toast.error("Please log in to decrease cart quantity.");
      return;
    }
    try {
      dispatch(decrementQuantity(_id));
      await decreaseCartQuantity(_id);
    } catch (error) {
      let message;

      if (error instanceof AxiosError) {
        message = handleApiError(error);
      } else {
        message = "An unexpected error occurred.";
      }
      toast.error(message);
    }
  };

  const hasProductInCart = carts?.some(
    (item: ICartItem) => item.product._id === _id
  );

  const handleSelectImage = (image: TMedia) => {
    dispatch(setImage(image));
  };

  return (
    <>
      <div className="bg-white rounded-md shadow w-full flex flex-col gap-2 p-4 mt-2">
        <div className="flex items-center gap-2">
          <Rating
            name="half-rating"
            size="small"
            defaultValue={rating.rate}
            precision={0.5}
            readOnly
          />
          <span className="text-xs text-gray-500">
            ({product.rating.count}) views
          </span>
        </div>
        <h1 className="font-semibold text-2xl">{title}</h1>

        <div className="w-full h-[1px] bg-gray-300 my-4"></div>

        <div className="flex flex-col gap-2 md:w-1/2 w-full">
          <div className="flex items-center gap-2">
            <h5 className="font-semibold text-sm">Quality:</h5>
            <span className="text-gray-500 text-sm font-normal">
              {product.quality}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <h5 className="font-semibold text-sm">Available In Stock:</h5>
            <span
              className={`${
                stock > 0 ? "text-green-600" : "text-red-600"
              } text-sm font-medium`}
            >
              {stock} items
            </span>
          </div>

          {stock > 0 && (
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-sm">
                Hurry up! only <span className="text-primary">{stock}</span>{" "}
                items left in stock!
              </p>
              <div className="w-full mt-1 bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-green-600 to-green-600 "
                  style={{ width: `${stockPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="mt-2 flex gap-2 items-center">
            <span className="text-2xl font-semibold text-primary">
              {formatDicountPrice}
            </span>
            {discountPrice > 0 && (
              <del className="text-xs opacity-60 italic">
                {formatPrice(price, currency)}
              </del>
            )}
          </div>

          {product?.sizes && product?.sizes?.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2 mt-3">
                Size: {selectSize}
              </p>

              <div className="flex items-center gap-2">
                {product?.sizes.map((val: string, index: number) => (
                  <button
                    onClick={() => toggleSelectSize(val)}
                    key={index}
                    type="button"
                    className={`p-2 rounded text-sm ${
                      selectSize === val
                        ? "bg-primary text-white"
                        : "border border-gray-300 text-black"
                    } hover:bg-primary hover:text-white transition duration-300`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          )}

          {images && images?.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2 mt-3 capitalize">
                Color: {image?.color}
              </p>

              <div className="flex items-center gap-2">
                {images.map((item, index) => {
                  return (
                    <div
                      onClick={() => handleSelectImage(item)}
                      key={index}
                      style={{
                        border: item.color
                          ? `.5px solid ${item.color}`
                          : `.5px solid #99999930`,
                      }}
                      className={`w-10 h-10 rounded-md`}
                    >
                      <img
                        src={item.medias[0].url}
                        alt={item.medias[0].id}
                        className="w-full h-fulll object-contain cursor-pointer rounded-md"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-4 pb-4 mt-4">
            {hasProductInCart ? (
              <AddToCart
                total={totalQuantityInCart}
                increment={handleincrementQuantity}
                decrement={handleDecrementQuantity}
              />
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 p-2 px-4 rounded-full border hover:bg-primary hover:text-white transition duration-300"
              >
                <MdShoppingBasket />
                <span className="text-sm">Cart</span>
              </button>
            )}

            <button
              onClick={handleAddToWishlist}
              className={`flex items-center justify-center gap-2 p-2 px-4 rounded-full border ${
                isAuth && isLike ? "text-primary border-primary" : ""
              } hover:bg-primary hover:text-white transition duration-300`}
            >
              <IoIosHeartEmpty />
              <span className={`text-sm`}>Wishlist</span>
            </button>
          </div>

          <div className="my-2">
            {stock > 0 ? (
              <span className="border border-green-600 rounded text-green-600 bg-green-50 text-sm py-1 px-4">
                In Stock
              </span>
            ) : (
              <span className="border border-red-600 rounded text-red-600 bg-red-50 text-sm py-1 px-4">
                Stock Out
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
