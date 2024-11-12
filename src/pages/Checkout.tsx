import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { NewOrderRequest } from "../types/api-types";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart } from "../redux/reducer/cartReducer";
import { responseToast } from "../utils/features";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);


const CheckOutForm = () => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch()

    const { user } = useSelector((state: RootState) => state.userReducer);

    const {
        shippingInfo,
        cartItems,
        subtotal,
        tax,
        discount,
        shippingCharges,
        total,
    } = useSelector((state: RootState) => state.cartReducer);


    const [isProcessing, setIsProcessing] = useState<boolean>(false);


    const [newOrder] = useNewOrderMutation()

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        // Check if user and user._id exist
        if (!user || !user._id) {
            toast.error("User not found or invalid. Please log in.");
            setIsProcessing(false);
            return;
        }

        setIsProcessing(true);

        const orderData: NewOrderRequest = {
            shippingInfo,
            orderItems: cartItems,
            subtotal,
            tax,
            discount,
            shippingCharges,
            total,
            user: user._id,
        };


        const { paymentIntent, error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.origin },
            redirect: "if_required",
        })

        if (error) {
            setIsProcessing(false)
            return toast.error(error.message || "Something Went Wrong");
        }

        if (paymentIntent.status === "succeeded") {
            const res = await newOrder(orderData);
            dispatch(resetCart());
            responseToast(res, navigate, "/orders")
        }
        setIsProcessing(false);

    }



    return (
        <div className="checkout-container">
            <form onSubmit={submitHandler}>
                <PaymentElement />
                <button type="submit" disabled={isProcessing}>
                    {isProcessing ? "Processing.." : "Pay"}
                </button>
            </form>
        </div>
    )
}

const Checkout = () => {
    const location = useLocation();

    const clientSecret: string | undefined = location.state;

    if (!clientSecret) return <Navigate to={"/shipping"} />

    return (
        <Elements
            options={{ clientSecret }}
            stripe={stripePromise}>
            <CheckOutForm />
        </Elements>
    )
}

export default Checkout







// const stripePromise = loadStripe('pk_test_51N6bmcSDCZ03mZbwGObbi8m3nklGYDc9FRc9A0zz9in3qfqu4sK3RDXyOgGWSZB7MFROrlnpTGXSQJfAQ97BAxIq00eOkJNS06');


// const CheckOutForm = () => {
//     const navigate = useNavigate();
//     const stripe = useStripe();
//     const elements = useElements();

//     const { user } = useSelector((state: RootState) => state.userReducer);

//     const {
//         shippingInfo,
//         cartItems,
//         subtotal,
//         tax,
//         discount,
//         shippingCharges,
//         total,
//     } = useSelector((state: RootState) => state.cartReducer);


//     const [isProcessing, setIsProcessing] = useState<boolean>(false);


//     const [newOrder] = useNewOrderMutation()

//     const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         if (!stripe || !elements) return;
//         setIsProcessing(true);

//         const orderData: NewOrderRequest = {};


//         const { paymentIntent, error } = await stripe.confirmPayment({
//             elements,
//             confirmParams: { return_url: window.location.origin },
//             redirect: "if_required",
//         })

//         if (error) return toast.error(error.message || "Something Went Wrong");

//         if (paymentIntent.status === "succeeded") {

//             console.log("Placing Order");
//             navigate("/orders");
//         }
//         setIsProcessing(false);

//     }



//     return (
//         <div className="checkout-container">
//             <form onSubmit={submitHandler}>
//                 <PaymentElement />
//                 <button type="submit" disabled={isProcessing}>
//                     {isProcessing ? "Processing.." : "Pay"}
//                 </button>
//             </form>
//         </div>
//     )
// }

// const Checkout = () => {
//     const location = useLocation();

//     const clientSecret: string | undefined = location.state;

//     if (!clientSecret) return <Navigate to={"/shipping"} />

//     return (
//         <Elements
//             options={{ clientSecret }}
//             stripe={stripePromise}>
//             <CheckOutForm />
//         </Elements>
//     )
// }

// export default Checkout