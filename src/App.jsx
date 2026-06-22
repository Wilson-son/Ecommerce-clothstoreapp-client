import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Navebar from "./components/Navebar";
import Footer from "./components/Footer";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Admin from "./pages/adminpage/Admin";
import AdminOrders from "./pages/adminpage/AdminOrders";
import SubscriptionPage from "./pages/adminpage/SubscriptionPage";
import AddProduct from "./pages/adminpage/AddProduct";
import EditProduct from "./pages/adminpage/EditProduct";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import { loadUserThunk } from "./redux/slices/authSlice";

import { ToastContainer } from "react-toastify";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserThunk());
  }, [dispatch]);

  return (
    <Router>
      <Navebar />

      <ToastContainer position="bottom-right" autoClose={2000} />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                {" "}
                <Profile />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                {" "}
                <Shop />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/Whishlist"
            element={
              <ProtectedRoute>
                {" "}
                <Wishlist />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                {" "}
                <About />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog"
            element={
              <ProtectedRoute>
                {" "}
                <Blog />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                {" "}
                <Checkout />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                {" "}
                <Orders />{" "}
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />{" "}
            </AdminRoute>
          }
        />
        <Route
          path="/admin/subscriptions"
          element={
            <AdminRoute>
              <SubscriptionPage />{" "}
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <AddProduct />{" "}
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <AdminRoute>
              <EditProduct />{" "}
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

        {/* Pages without footer/navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}
export default App;
