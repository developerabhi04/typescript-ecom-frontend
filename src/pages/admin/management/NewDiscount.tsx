import { useSelector } from 'react-redux';
import AdminSidebar from '../../../components/admin/AdminSidebar'
import { RootState } from '../../../redux/store';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewDiscountMutation } from '../../../redux/api/discountAPI';
import { responseToast } from '../../../utils/features';

const NewDiscount = () => {
    const navigate = useNavigate()
    const { user } = useSelector((state: RootState) => state.userReducer);

    const [newDiscount] = useNewDiscountMutation();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [code, setCode] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!code || !amount) {
                console.log("Please enter both coupon and amount");
                return;
            }

            const res = await newDiscount({ id: user?._id || "", code, amount });
            responseToast(res, navigate, "/admin/discount");

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

//     const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//         if (!code || !amount) {
//             console.error("Coupon code or amount is missing");
//             return;
//         }

//         // Sending JSON instead of FormData
//         const res = await newDiscount({ id: user?._id || "", code, amount });

//         responseToast(res, navigate, "/admin/discount");
//     } catch (error) {
//         console.log(error);
//     } finally {
//         setIsLoading(false);
//     }
// }


    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="management-section">
                <article>
                    <form onSubmit={submitHandler}>
                        <h2>New Coupon</h2>
                        <div>
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Coupon Code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Price</label>
                            <input
                                type="number"
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>

                        <button disabled={isLoading} type="submit">
                            Create
                        </button>
                    </form>
                </article>
            </main>
        </div>
    )
}

export default NewDiscount