import { CarouselButtonType, MyntraCarousel, Slider, useRating } from "6pp";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeftLong, FaArrowRightLong, FaStar, FaTrash } from "react-icons/fa6";
import { MdReviews } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { SkeletonLoader } from "../components/Loader";
import RatingsComponent from "../components/Ratings";
import { useAllReviewsOfProductsQuery, useDeleteReviewMutation, useNewReviewMutation, useProductDetailsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem, Review } from "../types/types";
import { FaRegStar } from "react-icons/fa";
import { RootState } from "../redux/store";
import { responseToast } from "../utils/features";


const ProductDetails = () => {
    const params = useParams();
    const dispatch = useDispatch()

    const { user } = useSelector((state: RootState) => state.userReducer);


    const { isLoading, isError, data } = useProductDetailsQuery(params.id!);
    const reviewsResponse = useAllReviewsOfProductsQuery(params.id!);
    const [carouselOpen, setCarouselOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const [reviewComment, setReviewComment] = useState("");
    const reviewDialogRef = useRef<HTMLDialogElement>(null);
    const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);


    const [createReview] = useNewReviewMutation();
    const [deleteReview] = useDeleteReviewMutation();


    const increment = () => {
        if (data?.product?.stock === quantity)
            return toast.error(`${data?.product?.stock} available only`);
        setQuantity((prev) => prev + 1);
    };

    const decrement = () => {
        setQuantity((prev) => prev - 1);
    }

    const addToCartHandler = (cartItem: CartItem) => {

        if (cartItem.stock < 1) return toast.error("Out Of Stock");
        dispatch(addToCart(cartItem));
        toast.success("Added to cart");
    }

    if (isError) return <Navigate to={"/404"} />

    const showDialog = () => {
        reviewDialogRef.current?.showModal();
    }

    const { Ratings: RatingsEditable, rating, setRating } = useRating({
        IconFilled: <FaStar />,
        IconOutline: <FaRegStar />,
        value: 0,
        selectable: true,
        styles: {
            fontSize: "1.75rem",
            color: "coral",
            justifyContent: "flex-start",
        },
    });

    const reviewCloseHandler = () => {
        reviewDialogRef.current?.close();
        setRating(0);
        setReviewComment("");
    };


    const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setReviewSubmitLoading(true);
        reviewCloseHandler();

        const res = await createReview({
            comment: reviewComment,
            rating,
            userId: user?._id,
            productId: params.id!,
        });

        setReviewSubmitLoading(false);

        responseToast(res, null, "");

        // API call to submit review
    };

    const handleDeleteReview = async (reviewId: string) => {
        const res = await deleteReview({ reviewId, userId: user?._id });
        responseToast(res, null, "");
    };

    return (
        <div className="product-details">
            {isLoading ? (
                < ProductLoader />
            ) : (
                <main>
                    <section>
                        <Slider
                            showThumbnails
                            showNav={false}
                            onClick={() => setCarouselOpen(true)}
                            images={data?.product?.photos.map((i) => i.url) || []}
                        />
                        {carouselOpen && (
                            <MyntraCarousel
                                NextButton={NextButton}
                                PrevButton={PrevButton}
                                setIsOpen={setCarouselOpen}
                                images={data?.product?.photos.map((i) => i.url) || []}
                            />
                        )}
                    </section>
                    <section>
                        <code>{data?.product.category}</code>
                        <h1>{data?.product.name}</h1>

                        <em style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                            <RatingsComponent value={data?.product?.ratings || 0} />
                            ({data?.product?.numOfReviews} reviews)
                        </em>

                        <h3>${data?.product.price}</h3>

                        <article>
                            <div>
                                <button onClick={decrement}>-</button>
                                <span>{quantity}</span>
                                <button onClick={increment}>+</button>
                            </div>

                            {data?.product && (
                                <button
                                    onClick={() => addToCartHandler({
                                        productId: data.product._id,
                                        name: data.product.name,
                                        price: data.product.price,
                                        stock: data.product.stock,
                                        quantity,
                                        photo: data.product.photos?.[0]?.url || "",
                                    })}
                                >
                                    Add to Cart
                                </button>
                            )}
                        </article>

                        <p>{data?.product.description}</p>


                    </section>
                </main>
            )}

            {/* reviews */}

            <dialog ref={reviewDialogRef} className="review-dialog">
                <button onClick={reviewCloseHandler}>X</button>
                <h2>Write a Review</h2>
                <form onSubmit={submitReview}>
                    <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Review..."
                    ></textarea>
                    <RatingsEditable />
                    <button disabled={reviewSubmitLoading} type="submit">Submit</button>
                </form>
            </dialog>

            <section>
                <article>
                    <h2>Reviews</h2>

                    {reviewsResponse.isLoading ? null : user && (
                        <button onClick={showDialog}>
                            <MdReviews />
                        </button>
                    )}

                </article>

                <div style={{
                    display: "flex",
                    gap: "2rem",
                    overflowX: "auto",
                    padding: "2rem",
                }}
                >

                    {reviewsResponse.isLoading ? (
                        <>
                            <SkeletonLoader width="45rem" length={5} />
                            <SkeletonLoader width="45rem" length={5} />
                            <SkeletonLoader width="45rem" length={5} />
                            <SkeletonLoader width="45rem" length={5} />
                        </>
                    ) : (

                        reviewsResponse.data?.reviews.map((review) => (
                            <ReviewCard
                                handleDeleteReview={handleDeleteReview}
                                userId={user?._id}
                                key={review._id}
                                review={review}
                            />
                        ))
                    )}
                </div>
            </section>

        </div>
    )
}


const ReviewCard = ({ review, userId, handleDeleteReview }: { userId?: string, review: Review, handleDeleteReview: (reviewId: string) => void }) => {
    const userInitial = review.user.name.charAt(0).toUpperCase();
    return (
        <div className="review">
            <RatingsComponent value={review.rating} />
            <p>{review.comment}</p>
            <div>
                {review.user.photo ? (
                    <img src={review.user.photo} alt="User" className="review-user-photo" />
                ) : (
                    <div className="review-user-initial">{userInitial}</div>
                )}
                <small>{review.user.name}</small>
            </div>

            {/* delete */}

            {userId === review.user._id && (
                <button onClick={() => handleDeleteReview(review._id)}>
                    <FaTrash />
                </button>
            )}
        </div>
    )
}





const ProductLoader = () => {
    return (
        <div style={{ display: "flex", gap: "2rem", border: "1px solid #f1f1f1", height: "80vh", }} >
            <section style={{ width: "100%", height: "100%" }}>
                <SkeletonLoader width="100%" containerHeight="100%" height="100%" length={1} />
            </section>

            <section style={{ width: "100%", display: "flex", flexDirection: "column", gap: "4rem", padding: "2rem", }}>
                <SkeletonLoader width="40%" length={3} />
                <SkeletonLoader width="50%" length={4} />
                <SkeletonLoader width="100%" length={2} />
                <SkeletonLoader width="100%" length={10} />
            </section>
        </div>
    );
};

const NextButton: CarouselButtonType = ({ onClick }) => (
    <button onClick={onClick} className="carousel-btn">
        <FaArrowRightLong />
    </button>
);
const PrevButton: CarouselButtonType = ({ onClick }) => (
    <button onClick={onClick} className="carousel-btn">
        <FaArrowLeftLong />
    </button>
);


export default ProductDetails;



{/* <Slider showThumbnails showDots showNav={false} images={data?.product.photos.map((i) => i.url) || []} /> */ }
{/* <StylishCarousel images={data?.product.photos.map((i) => i.url) || []} /> */ }







{/* <section>
    <h2>Reviews</h2>

    {reviewsResponse.isLoading ? (
        <SkeletonLoader width="100%" length={5} />
    ) : (

        reviewsResponse.data?.reviews.map((review) => (
            <div key={review._id} className="review">
                <RatingsComponent value={review.rating} />
                <p>{review.comment}</p>
                <small>{review.user.name}</small>
            </div>
        ))
    )}
</section> */}