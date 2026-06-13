import React from "react";
import { NavLink, useLocation, useNavigate} from "react-router-dom";
import {  useSelector } from "react-redux";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { FiUser } from "react-icons/fi";
import caralogo from "../assets/caralogo.png";

import Profile from "../pages/Profile"

export default function Navbar() {
  const nav =useNavigate();
 
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isAdmin = location.pathname.startsWith("/admin");
 if (isAdmin) return null;
 const isHome = location.pathname === "/";

 

  // Dynamic pill styles matching the reference image capsule design
  const navLinkClass = ({ isActive }) =>
    `px-6 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
      isActive
        ? "bg-white text-black shadow-sm font-semibold"
        : "text-black/70 hover:text-black hover:bg-white/40"
    }`;

  return (
    <header className="absolute top-0 inset-x-0 z-50 px-6 py-6 md:px-12 flex justify-between items-center">
      {/* Logo Element Capsule */}
      <NavLink
        to="/"
        className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-white/40"
      >
        <img src={caralogo} alt="Logo" className="h-6 w-auto object-contain" />
      </NavLink>

      {/* Central Nav Menu Pills Container */}
      <nav className="hidden md:flex items-center gap-1 bg-white/40 backdrop-blur-md p-1.5 rounded-full shadow-sm border border-white/20">
        <NavLink to="/" className={navLinkClass}>Home</NavLink>
        <NavLink to="/shop" className={navLinkClass}>Collection</NavLink>
        <NavLink to="/whishlist" className={navLinkClass}>Whishlist</NavLink>
        <NavLink to="/blog" className={navLinkClass}>Blog</NavLink>
        <NavLink to="/About" className={navLinkClass}>About</NavLink>
      

        {/* Auth State Dynamic Pill */}
        {user ? (
          <button
           onClick={() => nav("/profile")}
            className="px-6 py-2 rounded-full text-sm font-medium text-rose-700 hover:bg-rose-50/50 transition-all duration-300"
          >
            <FiUser size={16} className="" />
            
          </button>
        ) : (
          <NavLink to="/login" className={navLinkClass}>Login</NavLink>
        )}
      </nav>

      {/* Cart Icon Capsule */}
      <NavLink
        to="/cart"
        className="w-12 h-12 rounded-full bg-[#2B3A2B] text-white flex items-center justify-center hover:bg-[#1E291E] shadow-md transition transform active:scale-95"
      >
        <HiMiniShoppingBag size={18} />
      </NavLink>
    </header>
  );
}