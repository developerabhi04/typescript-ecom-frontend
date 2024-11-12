import { BsSearch } from "react-icons/bs"
import AdminSidebar from "../../components/admin/AdminSidebar"
import { FaRegBell } from "react-icons/fa"
import UserImg from '../../assets/userpic.png'
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi"
import { BarChart, DoughnutChart } from "../../components/admin/Chart"
import { BiMaleFemale } from "react-icons/bi"
import DashboardTable from "../../components/admin/DashboardTable"
import { useStatsQuery } from "../../redux/api/dashboardAPI"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { SkeletonLoader } from "../../components/Loader"
import { Navigate } from "react-router-dom"
import { getLastMonths } from "../../utils/features"


const { last6Months } = getLastMonths();


const Dashboard = () => {

  const { user } = useSelector((state: RootState) => state.userReducer)

  const { isLoading, data, isError } = useStatsQuery(user?._id!)

  const stats = data?.stats!;


  if (isError) return <Navigate to={"/"} />;


  return (
    <div className="admin-container">
      {/* Sidebar */}
      <AdminSidebar />
      {/* main */}
      <main className="dashboard">

        {isLoading ? (
          <SkeletonLoader length={20} />
        ) : (
          <>
            {/* bar */}
            <div className="bar">
              <BsSearch />
              <input type="text" placeholder="Search for data, users, docs" />
              <FaRegBell />
              <img src={user?.photo || UserImg} alt="User" />
            </div>


            {/* section 1*/}
            <section className="widget-container">
              <WidgetItem
                percent={stats.changePercent.revenue}
                amount={true}
                value={stats.count.revenue}
                heading={"Revenue"}
                color={"rgb(0, 115, 255)"}
              />
              <WidgetItem
                percent={stats.changePercent.user}
                // amount={false}
                value={stats.count.user}
                heading={"User"}
                color={"rgb(0, 198, 202)"}
              />
              <WidgetItem
                percent={stats.changePercent.order}
                // amount={true}
                value={stats.count.order}
                heading={"Transactions"}
                color={"rgb(225, 196, 0)"}
              />
              <WidgetItem
                percent={stats.changePercent.product}
                // amount={true}
                value={stats.count.product}
                heading={"Products"}
                color={"rgb(76 0 255)"}
              />

            </section>

            {/* graph 2*/}
            <section className="graph-container">
              <div className="revenue-chart">
                <h2>Revenue & Transaction</h2>
                {/* Graph vertical chart */}
                <BarChart
                  labels={last6Months}
                  data_1={stats.chart.revenue}
                  data_2={stats.chart.order}
                  title_1={"Revenue"}
                  title_2={"Transaction"}
                  bgColor_1={`hsl(260, 50%, 30%)`}
                  bgColor_2={`hsl(360, 90%, 90%)`}
                />
              </div>


              <div className="dashboard-categories">
                <h2>Inventory</h2>
                <div>
                  {stats.categoryCount.map((i) => {
                    const [heading, value] = Object.entries(i)[0];
                    return (
                      <CategoryItem
                        key={heading}
                        value={value}
                        heading={heading}
                        // color={`hsl(169, 100%, 50%)`}
                        color={`hsl(${value * 4}, ${value}%, 50%)`}
                      />
                    )
                  })}
                </div>
              </div>

            </section>



            {/* section 3 */}
            <section className="transaction-container">

              <div className="gender-chart">
                <h2>Gender Ratio</h2>
                {/* Chart */}
                <DoughnutChart
                  labels={["Female", "Male"]}
                  data={[stats.userRatio.female, stats.userRatio.male]}
                  backgroundColor={["hsl(340, 82%, 56%)", "rgba(53, 162, 235, 0.8)"]}
                  cutout={90}
                // legends={ }
                // offset={ }
                />
                <p>
                  <BiMaleFemale />
                </p>
              </div>
              {/* Table------------- */}
              <DashboardTable data={stats.latestTransaction} />
            </section>
          </>
        )}

      </main>
    </div>
  )
}


// ///////////////////////////////////
interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}


const WidgetItem = ({ heading, value, percent, color, amount = false }: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `$${value}` : value}</h4>
      {
        percent > 0 ? (
          <span className="green">
            <HiTrendingUp /> + {`${percent > 10000 ? 9999 : percent}%`}
          </span>
        ) : (
          <span className="red">
            <HiTrendingDown /> - {`${percent < -10000 ? -9999 : percent}%`}
          </span>
        )
      }
    </div>


    <div className="widget-circle"
      style={{
        background: `conic-gradient(${color} ${(Math.abs(percent) / 100) * 360}deg, rgb(255, 255, 255) 0)`,
      }}>

      <span style={{ color }} color={color}>
        {percent > 0 && `${percent > 10000 ? 9999 : percent}%`}
        {percent < 0 && `${percent < -10000 ? -9999 : percent}%`}
      </span>
    </div>


  </article>
)


// ////////////////////////////////////////////

interface CategoryItemsProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemsProps) =>
(

  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div style={{
        backgroundColor: color,
        width: `${value}%`,
      }}>
      </div>
    </div>

    <span>{value}%</span>
  </div>
)



export default Dashboard