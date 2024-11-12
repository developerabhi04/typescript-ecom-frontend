import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { useDeleteDiscountsMutation, useDiscountsDetailsQuery, useUpdateDiscountsMutation } from "../../../redux/api/discountAPI";
import { responseToast } from "../../../utils/features";
import { SkeletonLoader } from "../../../components/Loader";

const DiscountManagement = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);
    const params = useParams();
    const navigate = useNavigate();

    // Fetch discount details
    const { isLoading, data, isError, error } = useDiscountsDetailsQuery(params.id!);
    console.log(data?.coupon);

    // Initialize form state
    const [codeUpdate, setCodeUpdate] = useState<string>("");
    const [amountUpdate, setAmountUpdate] = useState<number>(0);
    const [btnLoading, setBtnLoading] = useState<boolean>(false);

    const [updateDiscounts] = useUpdateDiscountsMutation();
    const [deleteDiscounts] = useDeleteDiscountsMutation();

    // Update form values when data is fetched
    useEffect(() => {
        if (data && data.coupon) {
            setCodeUpdate(data.coupon.code);
            setAmountUpdate(data.coupon.amount);
        }
    }, [data]);

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBtnLoading(true);

        try {
            const updatedCoupon = {
                code: codeUpdate,
                amount: amountUpdate.toString(), // Ensure the amount is converted to string if required by the backend
            };

            if (user && data?.coupon) {
                const res = await updateDiscounts({
                    couponData: updatedCoupon,
                    userId: user._id,
                    couponId: data.coupon._id,
                });

                // Use responseToast to handle the response
                responseToast(res, navigate, `/admin/discount`);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setBtnLoading(false);
        }
    };


    const deleteHandler = async () => {
        if (user && data?.coupon) {
            const res = await deleteDiscounts({
                userId: user._id,
                couponId: data.coupon._id,
            });

            responseToast(res, navigate, "/admin/discount");
        }
    };


    // Enhanced error handling
    if (isError) {
        console.error("Error fetching coupon details:", error);
        return <p>Error fetching coupon details. Please try again later.</p>;
    }

    return (
        <div className="admin-container">
            <AdminSidebar />
            {isLoading ? (
                <SkeletonLoader />
            ) : (
                <>
                    <main className="management-section">
                        <article>
                            <button className="product-delete-btn" onClick={deleteHandler}>
                                <FaTrash />
                            </button>
                            <form onSubmit={submitHandler}>
                                <h2>Manage Discount</h2>

                                <div>
                                    <label>Coupon Code</label>
                                    <input
                                        type="text"
                                        placeholder="Coupon Code"
                                        value={codeUpdate}
                                        onChange={(e) => setCodeUpdate(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label>Amount</label>
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        value={amountUpdate}
                                        onChange={(e) => setAmountUpdate(Number(e.target.value))}
                                    />
                                </div>

                                <button disabled={btnLoading} type="submit">
                                    {btnLoading ? "Updating..." : "Update"}
                                </button>
                            </form>
                        </article>
                    </main>
                </>
            )}
        </div>
    );
};

export default DiscountManagement;
