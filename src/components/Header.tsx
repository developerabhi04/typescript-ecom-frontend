import { useState } from "react";
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";


// const user = { _id: "", role: "" };

interface PropsType {
    user: User | null;
}

const Header = ({ user }: PropsType) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { cartItems } = useSelector((state: { cartReducer: CartReducerInitialState }) => state.cartReducer)


    const logoutHandler = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully");
            setIsOpen(false);
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
    }

    return (
        <nav className="header">
            <Link onClick={() => setIsOpen(false)} to={"/"}>
                Home
            </Link>

            <Link onClick={() => setIsOpen(false)} to={"/search"}>
                <FaSearch />
            </Link>

            <Link onClick={() => setIsOpen(false)} to={"/cart"}>
                <FaShoppingBag />
                <span>{cartItems.length}</span>
            </Link>


            {user?._id ? (
                <>
                    <button onClick={() => setIsOpen((prev) => !prev)}>
                        <FaUser />
                    </button>

                    <dialog open={isOpen} >
                        <div>
                            {user.role === "admin" && (
                                <Link to="/admin/dashboard">Admin</Link>
                            )}

                            <Link to="/orders">Orders</Link>
                            <button onClick={logoutHandler}>
                                <FaSignOutAlt />
                            </button>
                        </div>
                    </dialog>
                </>
            ) : (
                <Link to={"/login"}>
                    <FaSignInAlt />
                </Link>
            )

            }
        </nav >
    )
}

export default Header