import { Link } from "react-router-dom"
import AdminSidebar from "../../components/admin/AdminSidebar"
import { SkeletonLoader } from "../../components/Loader"
import { ReactElement, useEffect, useState } from "react";
import { Column } from "react-table";
import TableHOC from "../../components/admin/TableHOC";
import { FaPlus } from "react-icons/fa6";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useAllDiscountsQuery } from "../../redux/api/discountAPI";


interface DataType {
    code: string;
    amount: number;
    _id: string;
    action: ReactElement;
}

const columns: Column<DataType>[] = [
    {
        Header: "Id",
        accessor: "_id",
    },
    {
        Header: "Code",
        accessor: "code",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Action",
        accessor: "action",
    },
];


const CouponDiscount = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);


    // Ensure `user` is not null before using it in the query
    const { data, isLoading } = useAllDiscountsQuery(user ? user._id : "");

    // console.log(data);


    const [rows, setRows] = useState<DataType[]>([]);

    const Table = TableHOC<DataType>(
        columns,
        rows,
        "dashboard-product-box",
        "Discount",
        rows.length > 6
    )();


    useEffect(() => {
        if (data)
            setRows(data.coupons.map((i) => ({
                _id: i._id,
                code: i.code,
                amount: i.amount,
                action: <Link to={`/admin/discount/${i._id}`}>Manage</Link>,
            }))
            );
    }, [data]);


    return (
        <div className="admin-container">
            <AdminSidebar />
            <main>{isLoading ? <SkeletonLoader length={20} /> : Table}</main>
            <Link to="/admin/discount/new" className="create-product-btn">
                <FaPlus />
            </Link>
        </div>
    )
}

export default CouponDiscount