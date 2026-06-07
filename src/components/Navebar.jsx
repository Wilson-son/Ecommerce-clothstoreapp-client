import { NavLink } from "react-router-dom";
import React from "react";
import caralogo from "../assets/caralogo.png";
import Login from "../pages/auth/Login";
import { logout } from "../redux/slices/authSlice";

import { useDispatch, useSelector } from "react-redux";

import { HiMiniShoppingBag } from "react-icons/hi2";

export default function Navebar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log("Navbar User:", user);

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <nav className="bg-[#E3E6F3] text-black shadow-md">
      <div className="max-w-7xl ml-[50px] py-4 flex justify-between items-center text-lg">
        <img src={caralogo} alt="Logo" className="h-15 w-30" />
        <ul className="flex gap-6">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-[#01796F] font-semibold" : "text-gray-700"
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive ? "text-[#01796F] font-semibold" : "text-gray-700"
              }
            >
              Shop
            </NavLink>
          </li>

          {user ? (
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-[#01796F]"
            >
              Logout
            </button>
          ) : (
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "text-[#01796F] font-semibold" : "text-gray-700"
                }
              >
                Login
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive ? "text-[#01796F] font-semibold" : "text-gray-700"
              }
            >
              <HiMiniShoppingBag size={22} className=" mt-1 color-[#01796F]" />
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
