import React from "react";
import { FaTwitter, FaGithub, FaLinkedinIn, FaYoutube, FaApple, FaGooglePlay } from "react-icons/fa";
import caralogo from "../assets/caralogo.png";

import Newsletter from "./Newsletter";




export default function Footer() {
  return (
    <footer className="bg-[#f7f9f8] pt-14 pb-8 px-6 md:px-16 lg:px-24 font-sans text-[#1a1a1a]">

      {/* Top: Logo + Social */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-400/40 pb-8 mb-12">
        <div className="mb-4 sm:mb-0">
          <img src={caralogo} alt="Cara" className="h-9 w-auto" />
        </div>
        <div className="flex gap-3">
          {[
            { icon: <FaTwitter />, label: "Twitter" },
            { icon: <FaGithub />, label: "GitHub" },
            { icon: <FaLinkedinIn />, label: "LinkedIn" },
            { icon: <FaYoutube />, label: "YouTube" },
          ].map(({ icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="w-9 h-9 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-600 hover:text-[#008073] hover:border-[#008073] transition-all shadow-sm text-sm"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-14">

        {/* About */}
        <div className="lg:col-span-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-5">About Us</h3>
          <p className="text-[13.5px] leading-relaxed text-gray-500 mb-5 max-w-sm">
            Cara E-Commerce – Redefining your style with premium apparel, expert curation, and an absolute commitment to fashion excellence.
          </p>
          <div className="space-y-2.5 text-[13.5px]">
            <p className="text-gray-500">
              <strong className="text-gray-800 font-semibold">Address:</strong> 562 Wellington Road, Street 32, San Francisco
            </p>
            <p className="text-gray-500">
              <strong className="text-gray-800 font-semibold">Phone:</strong> +01 2222 365 / (+91) 01 2345 6789
            </p>
            <p className="text-gray-500">
              <strong className="text-gray-800 font-semibold">Hours:</strong> 10:00 - 18:00, Mon - Sat
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-5">Quick Links</h3>
          <ul className="space-y-3 text-[13.5px]">
            {["About Us", "Delivery Information", "Privacy Policy", "Terms and Conditions", "Contact Us"].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-500 hover:text-[#008073] transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* My Account */}
        <div className="lg:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-5">My Account</h3>
          <ul className="space-y-3 text-[13.5px]">
            {["Sign In", "View Cart", "My Wishlist", "Track My Order", "Help"].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-500 hover:text-[#008073] transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter + Payments */}
        <div className="lg:col-span-4">
          
          <Newsletter/>

          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-3">
            Secured Payment Gateways
          </h4>
          <div className="flex gap-1.5 items-center flex-wrap">
            <div className="bg-[#253b4e] text-white text-[10px] font-black italic px-2.5 py-1.5 rounded tracking-tighter select-none">VISA</div>
            <div className="bg-[#253b4e] text-white text-[10px] font-bold px-2.5 py-1.5 rounded tracking-tight select-none">mastercard</div>
            <div className="bg-[#253b4e] text-white text-[10px] font-extrabold italic px-2.5 py-1.5 rounded select-none">PayPal</div>
            <div className="bg-[#253b4e] text-white text-[9px] font-black uppercase px-2.5 py-1.5 rounded tracking-widest select-none">AMEX</div>
            
          </div>
        </div>

      </div>

      {/* Sub-Footer */}
      <div className="border-t border-gray-400/40 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Install App</span>
          <span className="text-xs text-gray-400 hidden lg:inline">From App Store or Google Play</span>
          <div className="flex gap-2">
            <a href="#" className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-md px-3 py-1 hover:border-[#008073] transition-colors shadow-sm">
              <FaApple className="text-gray-800 text-base" />
              <div className="text-left">
                <span className="block text-[8px] text-gray-400 uppercase leading-none">Download on the</span>
                <span className="block text-[10px] font-bold text-gray-800 leading-none">App Store</span>
              </div>
            </a>
            <a href="#" className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-md px-3 py-1 hover:border-[#008073] transition-colors shadow-sm">
              <FaGooglePlay className="text-gray-700 text-xs" />
              <div className="text-left">
                <span className="block text-[8px] text-gray-400 uppercase leading-none">Get it on</span>
                <span className="block text-[10px] font-bold text-gray-800 leading-none">Google Play</span>
              </div>
            </a>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs text-gray-400">
          <p>© Cara 2026. All rights reserved.</p>
          <a href="#" className="hover:text-gray-600 transition-colors">MIT License</a>
        </div>
      </div>

      {/* Back to Top */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-10 h-10 rounded-full bg-[#008073] text-white flex items-center justify-center shadow-lg hover:bg-[#00665c] transition-all text-lg font-bold"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      </div>

    </footer>
  );
}