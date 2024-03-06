import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Rating } from "@mui/material";
import { useEffect, useState } from "react";
import { MdStarOutline } from "react-icons/md";
// import { FiEdit } from "react-icons/fi";
import ReactTimeAgo from "react-time-ago";
// import { differenceInMinutes } from "date-fns";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { UserState } from "../../redux/slices/userSlice";
import { ReviewSchema } from "../../schemas";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { handleApiError } from "../../utils/handleApiError";
import {
  addProductReview,
  // deleteProductReview,
  editProductReview,
} from "../../services";
import { IProduct, IReview } from "../../types";
import {
  ReviewState,
  // setDeleteProductReview,
  setEditProductReview,
  setProductReview,
  setReviews,
} from "../../redux/slices/reviewSlice";
import { axiosPrivate } from "../../config/api";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const labels: { [index: string]: string } = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

type Schema = z.infer<typeof ReviewSchema>;

const ProductReview = ({ product }: { product: IProduct }) => {
  const [hover, setHover] = useState(-1);
  const { isAuth, user } = useAppSelector(UserState);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { reviews } = useAppSelector(ReviewState);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<Schema>({
    resolver: zodResolver(ReviewSchema),
  });

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchedReviews = async () => {
      try {
        const response = await axiosPrivate.get(
          `/products/${product?._id}/reviews`,
          { signal }
        );
        const reviews = response.data;
        dispatch(setReviews(reviews));
      } catch (error) {
        let message;

        if (error instanceof AxiosError) {
          message = handleApiError(error);
        } else {
          message = "An unexpected error occurred.";
        }
       console.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchedReviews();

    return () => {
      abortController.abort();
    };
  }, [dispatch, product?._id]);

  const addProductReviewMutation = async (body: Schema) => {
    try {
      const data = await addProductReview(body);
      console.log(data.review);
      
      dispatch(setProductReview(data.review));
      toast.success(data.message);
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

  const editProductReviewMutation = async (
    body: Schema,
    productId: string,
    reviewId: string
  ) => {
    try {
      const review = await editProductReview(
        body,
        productId as string,
        reviewId as string
      );
      dispatch(setEditProductReview(review));
      toast.success("Review updated successfully");
      
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

  const onSubmit = async (values: Schema) => {
    if (!isAuth) {
      toast.error("Please login to submit your review");
      return;
    }
    if (reviewId) {
      await editProductReviewMutation(values, product?._id, reviewId);
    } else {
      const responseBody = {
        ...values,
        productId: product._id,
      };
      await addProductReviewMutation(responseBody);
     
    }
    setValue("message", "");
    setValue("rating", 0);
  };

  const rating = watch("rating");

  const handleEditAddress = (review: IReview) => {
    setReviewId(review._id);
    setValue("message", review.message);
    setValue("rating", review.rating);
  };

  return (
    <>
      <div className="flex lg:flex-row flex-col gap-8">
        <div className="flex gap-4 md:w-[500px] w-full">
          <div className="w-14 h-14 rounded-full ">
            <img
              src={user?.profileImg ? user?.profileImg.url : "/images/user.png"}
              alt="user"
              width={80}
              height={80}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex-1">
            <textarea
              id="message"
              rows={3}
              {...register("message")}
              className={`flex-1 w-full border p-2 ${
                errors.message?.message ? "border-red-600" : "border-gray-300"
              } rounded outline-0 text-sm`}
            ></textarea>

            <div className="flex gap-4 mt-1">
              <p
                className={`text-sm ${
                  errors.rating?.message && "text-red-600"
                }`}
              >
                Review:{" "}
              </p>

              <Controller
                name="rating"
                defaultValue={0}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Rating
                    size="small"
                    name="hover-feedback"
                    value={value}
                    precision={0.5}
                    getLabelText={getLabelText}
                    onChange={(_event, newValue) => {
                      onChange(newValue);
                    }}
                    onChangeActive={(_event, newHover) => {
                      setHover(newHover);
                    }}
                    emptyIcon={
                      <MdStarOutline
                        style={{ opacity: 0.55 }}
                        fontSize="inherit"
                      />
                    }
                  />
                )}
              />
              {rating !== null && (
                <p className="text-sm">
                  {labels[hover !== -1 ? hover : rating]}
                </p>
              )}
            </div>

            <div className="w-1/2 mt-2">
              <button
                onClick={handleSubmit(onSubmit)}
                className="bg-primary text-white text-sm font-medium h-9 cursor-pointer px-8 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 max-h-[400px] flex-1 overflow-y-auto">
          {isLoading ? (
            "Loading..."
          ) : reviews && reviews?.length > 0 ? (
            reviews?.map((review: IReview, index: number) => (
              <Reviews
                key={index}
                review={review}
                productId={product?._id}
                handleEditAddress={handleEditAddress}
                customerId={user?._id || ""}
              />
            ))
          ) : (
            <div className="flex items-center justify-center mt-10 font-semibold text-xl opacity-65">
              No Review Yet
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductReview;

const Reviews = ({
  review,
  // productId,
  // handleEditAddress,
  // customerId,
}: {
  review: IReview;
  productId: string;
  handleEditAddress: (review: IReview) => void;
  customerId: string;
}) => {
  const { customer, message, createdAt, rating, } = review;
  // const dispatch = useAppDispatch();

  // const deleteProductReviewMutation = async () => {
  //   try {
  //    await deleteProductReview(productId, reviewId);
  //     dispatch(setDeleteProductReview(reviewId));
  //     toast.success("Review deleted successfully");
  //   } catch (error) {
  //     let message;

  //     if (error instanceof AxiosError) {
  //       message = handleApiError(error);
  //     } else {
  //       message = "An unexpected error occurred.";
  //     }

  //     toast.error(message);
  //   }
  // };

  // const handleDeleteReview = async () => {
  //   await deleteProductReviewMutation();
  // };

  // const minutesAgo = differenceInMinutes(new Date(), new Date(createdAt));

  
  // const timePassed = minutesAgo >= 5;
  // const canEditDelete = customerId === customer?._id && !timePassed;

  return (
    <div className="flex gap-2 border p-4 rounded">
      <div className="w-12 h-12 rounded-full">
        <img
          src={
            customer?.profileImg?.url ? customer?.profileImg?.url : "/images/user.png"
          }
          alt="user"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <div className="flex-1">
        <div className="flex  justify-between">
          <div className="flex flex-col">
            <p className="font-medium text-sm">{customer?.name}</p>
            <Rating
              size="small"
              name="half-rating-read"
              defaultValue={typeof rating === "number" ? rating : 0}
              precision={0.5}
              readOnly
            />
          </div>

          <p className="text-sm text-gray-500">
            <ReactTimeAgo date={createdAt} locale="en-US" />
          </p>
        </div>

        <div>
          <p className="text-xs mt-2 opacity-80">{message}</p>

          {/* {canEditDelete && (
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => handleEditAddress(review)}>
                <FiEdit className="text-blue-600" />
              </button>

              <button onClick={handleDeleteReview}>
                <MdOutlineDeleteOutline size={20} className="text-primary" />
              </button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};
