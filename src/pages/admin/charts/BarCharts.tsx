import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar"
import { BarChart } from "../../../components/admin/Chart"
import { RootState } from "../../../redux/store";
import { useBarQuery } from "../../../redux/api/dashboardAPI";
import { Navigate } from "react-router-dom";
import { CustomError } from "../../../types/api-types";
import toast from "react-hot-toast";
import { SkeletonLoader } from "../../../components/Loader";
import { getLastMonths } from "../../../utils/features";



const { last12Months, last6Months } = getLastMonths();

const BarCharts = () => {

    const { user } = useSelector((state: RootState) => state.userReducer)

    const { isLoading, data, isError, error } = useBarQuery(user?._id!);

    const products = data?.charts.products || [];
    const orders = data?.charts.orders || [];
    const users = data?.charts.users || [];

    if (isError) {
        const err = error as CustomError;
        toast.error(err.data.message);
    }


    if (isError) return <Navigate to={"/"} />;


    return (
        <div className="admin-container">
            <AdminSidebar />

            <main className="chart-container">
                <h1>Bar Charts</h1>
                {isLoading ? (
                    <SkeletonLoader />
                ) : (
                    <>
                        <section>
                            <BarChart
                                labels={last6Months}
                                data_1={products}
                                data_2={users}
                                title_1="Products"
                                title_2="Users"
                                bgColor_1={`hsl(260, 50%, 30%)`}
                                bgColor_2={`hsl(360, 90%, 90%)`}
                            />
                            <h2>TOP SELLING PRODUCTS & TOP CUSTOMERS</h2>
                        </section>

                        <section>
                            <BarChart
                                horizontal={true}
                                data_1={orders}
                                data_2={[]}
                                title_1="Products"
                                title_2=""
                                bgColor_1={`hsl(180, 40%, 50%)`}
                                bgColor_2=""
                                labels={last12Months}
                            />
                            <h2>Order Throught The Year</h2>
                        </section>
                    </>
                )}
            </main>
        </div>
    )
}

export default BarCharts