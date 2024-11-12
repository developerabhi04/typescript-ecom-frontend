import { ReactElement, useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar"
import TableHOC from "../../components/admin/TableHOC";
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import { CustomError } from "../../types/api-types";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer-types";
import { SkeletonLoader } from "../../components/Loader";


interface DataType {
    photo: ReactElement;
    name: string;
    price: number;
    stock: ReactElement;
    action: ReactElement;
}

const columns: Column<DataType>[] = [
    {
        Header: "Photo",
        accessor: "photo",
    },
    {
        Header: "Name",
        accessor: "name",
    },
    {
        Header: "Price",
        accessor: "price",
    },
    {
        Header: "Stock",
        accessor: "stock",
    },
    {
        Header: "Action",
        accessor: "action",
    }
]



const Products = () => {

    const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer);

    const { isLoading, isError, error, data } = useAllProductsQuery(user?._id!);

    const [rows, setRows] = useState<DataType[]>([]);


    if (isError) {
        const err = error as CustomError;
        toast.error(err.data.message)
    }


    useEffect(() => {
        if (data) setRows(
            data.products?.map((i) => ({
                photo: <img src={i.photos[0].url} alt="Product" />,
                name: i.name,
                price: i.price,
                stock: (
                    <span style={{ color: i.stock === 0 ? "red" : "green" }}>
                        {i.stock}
                    </span>
                ),  // Conditional color styling for stock
                action: <Link to={`/admin/product/${i._id}`}>Manage</Link>,

            }
            ))
        );
    }, [data])


    const Table = TableHOC<DataType>(
        columns,
        rows,
        "dashboard-product-box",
        "Products",
        rows.length > 6
    )();

    return (
        <div className="admin-container">

            {/* Sidebar */}
            <AdminSidebar />

            {/* main */}
            <main>{isLoading ? <SkeletonLoader length={20} /> : Table}</main>
            <Link to={"/admin/products/new"} className="create-product-btn">
                <FaPlus />
            </Link>
        </div>
    )
}

export default Products;
























// const img = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&w=1000&q=804";

// const img2 = "https://m.media-amazon.com/images/I/514T0SvwkHL._SL1500_.jpg";

// const arr: DataType[] = [

//     {
//         photo: <img src={img} alt="Shoes" />,
//         name: "Puma Shoes Air Jordan Cook Nigga 2023",
//         price: 1000,
//         stock: 4,
//         action: <Link to={"/admin/product/ajkdk"}>Manage</Link>,
//     },
//     {
//         photo: <img src={img2} alt="Shoes" />,
//         name: "Macbook M3 256gb 8gb ram",
//         price: 2000,
//         stock: 10,
//         action: <Link to={"/admin/product/ajkdk"}>Manage</Link>,
//     },
//     {
//         photo: <img src={img2} alt="Shoes" />,
//         name: "Macbook M3 256gb 8gb ram",
//         price: 2000,
//         stock: 10,
//         action: <Link to={"/admin/product/ajkdk"}>Manage</Link>,
//     },
//     {
//         photo: <img src={img} alt="Shoes" />,
//         name: "Puma Shoes Air Jordan Cook Nigga 2023",
//         price: 1000,
//         stock: 4,
//         action: <Link to={"/admin/product/ajkdk"}>Manage</Link>,
//     },


// ];
