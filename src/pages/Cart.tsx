import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItems from "../components/CartItems";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import { addToCart, calculatePrice, discountApplied, removeCartItem, saveCoupon } from "../redux/reducer/cartReducer";
import axios from "axios";
import { server } from "../redux/store";


const Cart = () => {
  const dispatch = useDispatch()
  const { cartItems, subtotal, tax, total, shippingCharges, discount } = useSelector((state: { cartReducer: CartReducerInitialState }) => state.cartReducer)


  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidcouponCode, setisValidCouponCode] = useState<boolean>(false);


  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  }

  
  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  }

  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  }


  useEffect(() => {
    const { token, cancel } = axios.CancelToken.source()

    const timeOutID = setTimeout(() => {
      axios.get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
        cancelToken: token,

      }).then((res) => {
        dispatch(discountApplied(res.data.discount));
        dispatch(saveCoupon(couponCode));
        // console.log(res.data);
        setisValidCouponCode(true);
        dispatch(calculatePrice())

      }).catch(() => {
        // console.log(e.response.data);
        dispatch(discountApplied(0))
        setisValidCouponCode(false);
        dispatch(calculatePrice())
      })

    }, 1000)

    return () => {
      clearTimeout(timeOutID)
      cancel();
      setisValidCouponCode(false)
    };
  }, [couponCode, dispatch]);


  useEffect(() => {
    dispatch(calculatePrice())
  }, [cartItems, dispatch])


  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, idx) => (
            <CartItems
              key={idx}
              cartItem={i}
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )
        }
      </main>

      {cartItems.length > 0 ? (
        <aside>
          <p>Subtotal: ₹{subtotal}</p>
          <p>Shipping: ₹{shippingCharges}</p>
          <p>Tax: ₹{tax}</p>
          <p>Discount:<em> - ₹{discount}</em></p>
          <p><b>Total: ₹{total}</b></p>

          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)} />

          {couponCode &&
            (isValidcouponCode ? (
              <span className="green">₹{discount} off using the
                <code>{couponCode}</code>
              </span>
            ) : (
              <span className="red">
                Invalid Coupon code <VscError />
              </span>
            ))
          }


          {
            cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>
          }

        </aside>

      ) : ("")}
    </div>
  )
}

export default Cart;