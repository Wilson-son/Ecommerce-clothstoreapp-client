import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiMiniShoppingBag, HiBars3, HiXMark } from "react-icons/hi2";
import { FiUser } from "react-icons/fi";
import caralogo from "../assets/caralogo.png";

import Profile from "../pages/Profile";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Mobile link style (block, not pill-capsule, since it's a stacked list)
  const mobileNavLinkClass = ({ isActive }) =>
    `block w-full text-center px-6 py-3 rounded-2xl text-base font-medium tracking-wide transition-all duration-300 ${
      isActive
        ? "bg-white text-black shadow-sm font-semibold"
        : "text-black/80 hover:text-black hover:bg-white/40"
    }`;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="absolute top-0 inset-x-0 z-50 px-6 py-6 md:px-12">
      <div className="flex justify-between items-center">
        {/* Logo Element Capsule */}
        <NavLink
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-white/40"
        >
          <img src={caralogo} alt="Logo" className="h-6 w-auto object-contain" />
        </NavLink>

        {/* Central Nav Menu Pills Container (desktop only) */}
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
              <FiUser size={16} />
            </button>
          ) : (
            <NavLink to="/login" className={navLinkClass}>Login</NavLink>
          )}
        </nav>

        {/* Right side: cart + mobile hamburger */}
        <div className="flex items-center gap-3">
          {/* Cart Icon Capsule */}
          <NavLink
            to="/cart"
            onClick={closeMenu}
            className="w-12 h-12 rounded-full bg-[#2B3A2B] text-white flex items-center justify-center hover:bg-[#1E291E] shadow-md transition transform active:scale-95"
          >
            <HiMiniShoppingBag size={18} />
          </NavLink>

          {/* Hamburger toggle - mobile only */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm border border-white/40 transition transform active:scale-95"
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiXMark size={20} /> : <HiBars3 size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 bg-white/70 backdrop-blur-md p-3 rounded-3xl shadow-sm border border-white/30">
          <NavLink to="/" className={mobileNavLinkClass} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/shop" className={mobileNavLinkClass} onClick={closeMenu}>Collection</NavLink>
          <NavLink to="/whishlist" className={mobileNavLinkClass} onClick={closeMenu}>Whishlist</NavLink>
          <NavLink to="/blog" className={mobileNavLinkClass} onClick={closeMenu}>Blog</NavLink>
          <NavLink to="/About" className={mobileNavLinkClass} onClick={closeMenu}>About</NavLink>

          {user ? (
            <button
              onClick={() => {
                nav("/profile");
                closeMenu();
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-base font-medium text-rose-700 hover:bg-rose-50/50 transition-all duration-300"
            >
              <FiUser size={16} />
              <span>Profile</span>
            </button>
          ) : (
            <NavLink to="/login" className={mobileNavLinkClass} onClick={closeMenu}>Login</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}