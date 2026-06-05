import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from "react";
import { useDispatch } from "react-redux";


import Navebar from './components/Navebar';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Newsletter from './components/NewsLetter';
import Footer from './components/Footer';

import ProtectedRoute from "./routes/ProtectedRoute";


import { loadUserThunk } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserThunk());
  }, [dispatch]);

  return(
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

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
