import React from "react";
import { FaStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

export default function ProductCard({ product }) {
  return (
    <div className="w-84 h-116 bg-white border border-[#cdeef0] rounded-3xl p-3 shadow-sm hover:shadow-md transition duration-300">
      {/* Image area */}
      <div className=" h-84 bg-[#f0f0f0] rounded-2xl flex items-center justify-center overflow-hidden h-60">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4"
        />
      </div>

      {/* Info + Cart row */}
      <div className="mt-3 px-1 flex items-end justify-between">
        {/* Text info */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">{product.brand}</span>
          <p className="text-sm font-semibold text-gray-800 leading-tight">
            {product.name}
          </p>
          {/* Stars */}
          <div className="flex gap-0.5">
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
          <p className="text-sm font-bold text-gray-800 mt-0.5">
            ₹{product.price}
          </p>
        </div>

        {/* Cart button — bottom right */}
        <button className="flex-shrink-0 bg-[#e8f6ea] border border-[#c8eacb] p-2.5 rounded-full text-[#088178] hover:bg-[#d4f0d8] transition-colors cursor-pointer">
          <FiShoppingCart size={18} />
        </button>
      </div>
    </div>
  );
}