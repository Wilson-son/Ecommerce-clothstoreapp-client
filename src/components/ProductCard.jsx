import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FiShoppingCart, FiHeart } from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";

import { addToCart } from "../redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/slices/wishlistSlice";

import { createCartItem } from "../utils/createCartItem.js";

import { toast } from "react-toastify";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const handleWishlist = (e) => {
    e.preventDefault();

    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const alreadyInCart = cartItems.some((item) => item._id === product._id);

    if (alreadyInCart) {
      toast.warning("Already added to cart!");
      return;
    }

    dispatch(addToCart(createCartItem(product)));

    toast.success("Product added to cart!");
  };

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="w-full bg-white border border-[#cdeef0] rounded-2xl sm:rounded-3xl p-1.5 sm:p-3 shadow-sm hover:shadow-md transition duration-300">
        {/* Image area — full image visible inside bg, no cropping */}
        <div className="relative w-full h-24 sm:h-56 md:h-72 bg-[#f0f0f0] rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center">
          <img
            src={product.images?.[0]?.url}
            alt={product.name}
            className="w-full h-full object-contain"
          />

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-1 right-1 sm:top-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:border-red-300 transition-all duration-200"
          >
            <FiHeart
              size={12}
              className="sm:hidden"
              style={{
                fill: isWishlisted ? "#ef4444" : "none",
                stroke: isWishlisted ? "#ef4444" : "#9ca3af",
                transition: "all 0.2s",
              }}
            />
            <FiHeart
              size={15}
              className="hidden sm:block"
              style={{
                fill: isWishlisted ? "#ef4444" : "none",
                stroke: isWishlisted ? "#ef4444" : "#9ca3af",
                transition: "all 0.2s",
              }}
            />
          </button>
        </div>

        {/* Info + Cart row */}
        <div className="mt-1.5 sm:mt-4 px-0.5 sm:px-1 pb-0.5 sm:pb-1 flex items-end justify-between gap-1 sm:gap-2">
          {/* Text info */}
          <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
            <span className="text-[9px] sm:text-xs text-gray-400 truncate">
              {product.brand}
            </span>
            <p className="text-[11px] sm:text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
              {product.name}
            </p>
            <div className="hidden sm:flex gap-0.5 mt-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={13}
                  className={
                    star <= product.rating ? "text-yellow-400" : "text-gray-200"
                  }
                />
              ))}
            </div>
            <p className="text-[11px] sm:text-sm font-bold text-gray-800 mt-0.5 sm:mt-1">
              ₹{product.price}
            </p>
          </div>

          {/* Cart button */}
          <button
            onClick={handleAddToCart}
            className="flex-shrink-0 bg-[#e8f6ea] border border-[#c8eacb] p-1.5 sm:p-2.5 rounded-full text-[#088178] hover:bg-[#d4f0d8] transition-colors cursor-pointer"
          >
            <FiShoppingCart size={13} className="sm:hidden" />
            <FiShoppingCart size={18} className="hidden sm:block" />
          </button>
        </div>
      </div>
    </Link>
  );
}