import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Loader from './components/Loader';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { userExist, userNotExist } from './redux/reducer/userReducer';
import { getUser } from './redux/api/userAPI';
import { UserReducerInitialState } from './types/reducer-types';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';


const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Login = lazy(() => import("./pages/Login"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Checkout = lazy(() => import("./pages/Checkout"))


// Admin Routes Importing
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Products = lazy(() => import("./pages/admin/Products"));
const Customers = lazy(() => import("./pages/admin/Customers"));
const Transaction = lazy(() => import("./pages/admin/Transaction"));
const CouponDiscount = lazy(() => import("./pages/admin/CouponDiscount"))
const NewProduct = lazy(() => import("./pages/admin/management/NewProduct"));
const NewDiscount = lazy(() => import("./pages/admin/management/NewDiscount"));
const ProductManagement = lazy(() => import("./pages/admin/management/ProductManagement"));
const DiscountManagement = lazy(() => import("./pages/admin/management/DiscountManagement"));
const TransactionManagement = lazy(() => import("./pages/admin/management/TransactionManagement"));

// charts
const BarCharts = lazy(() => import("./pages/admin/charts/BarCharts"));
const PieCharts = lazy(() => import("./pages/admin/charts/PieCharts"));
const LineCharts = lazy(() => import("./pages/admin/charts/LineCharts"));
// apps
const Stopwatch = lazy(() => import("./pages/admin/apps/Stopwatch"));
const Coupon = lazy(() => import("./pages/admin/apps/Coupon"));
const Toss = lazy(() => import("./pages/admin/apps/Toss"));


const App = () => {

  const { user, loading } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer)

  const dispatch = useDispatch();


  useEffect(() => {

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid)
        dispatch(userExist(data.user))

        console.log("Logged In");
      } else {
        dispatch(userNotExist())
        console.log("Not Logged In");
      }
    })

  }, [dispatch])

  return (

    loading ? (<Loader />) : (
      <Router>
        {/* header */}
        < Header user={user} />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/search' element={<Search />} />
            <Route path='/product/:id' element={<ProductDetails />} />
            <Route path='/cart' element={<Cart />} />

            {/* Not Logged In Routes */}
            <Route path='/login' element={<ProtectedRoute isAuthenticated={user ? false : true}><Login /></ProtectedRoute>} />


            {/* Logged in User Routes */}
            <Route element={<ProtectedRoute isAuthenticated={user ? true : false} />}>

              <Route path='/shipping' element={<Shipping />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='/order/:id' element={<OrderDetails />} />
              <Route path='/pay' element={<Checkout />} />
            </Route>


            {/* Admin Routes */}
            <Route element={
              <ProtectedRoute
                isAuthenticated={true}
                adminOnly={true}
                admin={user?.role === "admin" ? true : false}
              />
            }>

              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/customers" element={<Customers />} />
              <Route path="/admin/transaction" element={<Transaction />} />
              <Route path="/admin/discount" element={<CouponDiscount />} />



              {/* Charts */}
              <Route path="/admin/chart/bar" element={<BarCharts />} />
              <Route path="/admin/chart/pie" element={<PieCharts />} />
              <Route path="/admin/chart/line" element={<LineCharts />} />


              {/* Apps */}
              <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
              <Route path="/admin/app/coupon" element={<Coupon />} />
              <Route path="/admin/app/toss" element={<Toss />} />


              {/* management */}
              <Route path="/admin/products/new" element={<NewProduct />} />
              <Route path="/admin/discount/new" element={<NewDiscount />} />
              <Route path="/admin/product/:id" element={<ProductManagement />} />
              <Route path="/admin/discount/:id" element={<DiscountManagement />} />
              <Route path="/admin/transaction/:id" element={<TransactionManagement />} />

            </Route>

            <Route path="*" element={<NotFound />} />

          </Routes>
        </Suspense>
        <Footer />
        <Toaster position="top-center" />
      </Router >
    )
  )
}

export default App