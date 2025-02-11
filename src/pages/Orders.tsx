import { ReactElement, useEffect, useState } from "react";
import TableHOC from "../components/admin/TableHOC";
import { Column } from "react-table";
import { useSelector } from "react-redux";
import { useAllOrdersQuery } from "../redux/api/orderAPI";
import toast from "react-hot-toast";
import { CustomError } from "../types/api-types";
import { SkeletonLoader } from "../components/Loader";
import { RootState } from "../redux/store";


type DataType = {
    _id: string;
    amount: number;
    quantity: number;
    discount?: number;
    status: ReactElement;
    // action: ReactElement;
}

const column: Column<DataType>[] = [
    {
        Header: "ID",
        accessor: "_id",
    },
    {
        Header: "Quantity",
        accessor: "quantity",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Status",
        accessor: "status",
    },
    // {
    //     Header: "Action",
    //     accessor: "action",
    // },
]


const Orders = () => {

    const { user } = useSelector((state: RootState) => state.userReducer);

    const { isLoading, data, isError, error } = useAllOrdersQuery(user?._id ?? "")



    const [rows, setRows] = useState<DataType[]>([]);

    if (isError) {
        const err = error as CustomError;
        toast.error(err.data.message)
    }

    useEffect(() => {
        if (data) setRows(
            data.orders?.map((i) => ({
                _id: i._id,
                quantity: i.orderItems.length,
                amount: i.total,
                status: <span className={i.status === "Processing" ? "red" : i.status === "Shipped" ? "green" : "purple"}>
                    {i.status}</span>,
                // action: <Link to={`/admin/transaction/${i?._id}`}>Manage</Link>,
            }
            ))
        );
    }, [data])



    const Table = TableHOC<DataType>(column, rows, "dashboard-product-box", "Orders", rows.length > 6)();

    return (

        <div className="container">
            <h1>My Orders</h1>
            {isLoading ? <SkeletonLoader length={20} /> : Table}
        </div>
    )
}

export default Orders;