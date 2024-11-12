import { Column } from "react-table";
import TableHOC from "./TableHOC"



interface DataType {
    _id: string;
    quantity: number;
    discount: number;
    amount: number;
    status: string;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "Processing":
            return "red";
        case "Shipped":
            return "orange";
        case "Delivered":
            return "green";
        default:
            return "gray";
    }
};

const columns: Column<DataType>[] = [
    {
        Header: "Id",
        accessor: "_id",
    },
    {
        Header: "Quantity",
        accessor: "quantity",
    },
    {
        Header: "Discount",
        accessor: "discount",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
            <span style={{ color: getStatusColor(value) }}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
        ),
    },
];

const DashboardTable = ({ data = [] }: { data: DataType[] }) => {
    return TableHOC<DataType>(
        columns,
        data,
        "transaction-box",
        "Top Transaction"
    )();
};

export default DashboardTable;
