import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { removeFromWishlist } from "../redux/slices/wishlistSlice";

import {createCartItem} from "../utils/createCartItem.js"

import {
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiArrowLeft,
  FiShare2,
  FiCheck,
  FiPackage,
} from "react-icons/fi";

// ── Star Rating 
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "#FBBF24" : "none"}
          stroke="#FBBF24"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ── Placeholder 
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

// ── Wishlist Card 
function WishlistCard({ product, onRemove, onAddToCart, isAdded, isRemoving }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const imgSrc =
    !imgError && product.images?.[0]?.url ? product.images[0].url : PLACEHOLDER;

  const outOfStock = product.inStock === false;
  const discountPct =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100,
        )
      : null;

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group flex flex-col"
      style={{
        opacity: isRemoving ? 0 : 1,
        transform: isRemoving ? "scale(0.93) translateY(6px)" : "scale(1)",
        transition: "opacity 280ms ease, transform 280ms ease",
      }}
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#f9f9f9] overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full  object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {discountPct && !outOfStock && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-500 text-white shadow-sm">
            -{discountPct}%
          </span>
        )}

        {product.badge && !discountPct && (
          <span
            className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm"
            style={{
              background: product.badgeColor || "#EEEDFE",
              color: product.badgeText || "#534AB7",
            }}
          >
            {product.badge}
          </span>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onRemove(product._id)}
            className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
            title="Remove from wishlist"
          >
            <FiTrash2 size={13} />
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: product.name,
                  url: window.location.origin + `/product/${product._id}`,
                });
              } else {
                navigator.clipboard?.writeText(
                  window.location.origin + `/product/${product._id}`,
                );
              }
            }}
            className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors shadow-sm"
            title="Share product"
          >
            <FiShare2 size={13} />
          </button>
        </div>

        {outOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
              <FiPackage size={11} />
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            {product.brand || "Brand"}
          </span>
          <h3
            className="text-sm font-bold text-gray-900 mt-0.5 line-clamp-2 cursor-pointer hover:text-[#088178] transition-colors leading-snug"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <StarRating rating={product.rating || 5} />
            <span className="text-[11px] text-gray-400">
              ({product.reviews || 0})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
          <div className="flex flex-col leading-tight">
            <span className="text-base font-black text-gray-900">
              ₹{product.price?.toLocaleString()}
            </span>
            {discountPct && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={() => !outOfStock && !isAdded && onAddToCart(product)}
            disabled={outOfStock || isAdded}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all duration-300 border select-none"
            style={
              outOfStock
                ? { background: "#f5f5f5", color: "#b5b5b5", borderColor: "transparent", cursor: "not-allowed" }
                : isAdded
                ? { background: "#E6F7F2", color: "#0a6e56", borderColor: "#a3e2cd", cursor: "default" }
                : { background: "#111", color: "#fff", borderColor: "transparent", cursor: "pointer" }
            }
          >
            {outOfStock ? (
              <><FiPackage size={12} /> Sold Out</>
            ) : isAdded ? (
              <><FiCheck size={12} strokeWidth={3} /> Added</>
            ) : (
              <><FiShoppingCart size={12} /> Add</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


export default function Wishlist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || []);

  
  const cartItems = useSelector((state) => state.cart.cartItems);
  const isInCart = (productId) => cartItems.some((item) => item._id === productId);

  const [removingItems, setRemovingItems] = useState({});

 const handleAddToCart = (product) => {
  dispatch(addToCart(createCartItem(product)));
};

  const handleRemove = (id) => {
    setRemovingItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      dispatch(removeFromWishlist(id));
      setRemovingItems((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }, 280);
  };

  const moveAllToCart = () => {
    wishlistItems
      .filter((p) => p.inStock !== false && !isInCart(p._id))
      .forEach((p) => handleAddToCart(p));
  };

  const totalValue = wishlistItems.reduce((sum, p) => sum + (p.price || 0), 0);
  const availableCount = wishlistItems.filter((p) => p.inStock !== false).length;

  //  pendingCount — items available but not yet in cart
  const pendingCount = wishlistItems.filter(
    (p) => p.inStock !== false && !isInCart(p._id),
  ).length;

  //  addedCount — items already in cart
  const addedCount = wishlistItems.filter((p) => isInCart(p._id)).length;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:border-gray-400 transition-colors shadow-sm text-gray-600"
            >
              <FiArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-950 tracking-tight leading-tight flex items-center gap-2">
                My Wishlist
                {wishlistItems.length > 0 && (
                  <span className="text-sm font-bold bg-gray-100 text-gray-500 rounded-full px-2.5 py-0.5">
                    {wishlistItems.length}
                  </span>
                )}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {availableCount} item{availableCount !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>

          {pendingCount > 0 && (
            <button
              onClick={moveAllToCart}
              className="hidden sm:flex items-center gap-2 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-[#088178] transition-colors duration-200 shadow-sm"
            >
              <FiShoppingCart size={13} />
              Add all ({pendingCount}) to cart
            </button>
          )}
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-3xl text-center max-w-sm mx-auto shadow-sm px-8">
            <div className="w-16 h-16 rounded-2xl bg-[#e8f6ea] flex items-center justify-center mb-4 text-[#088178]">
              <FiHeart size={26} className="fill-current" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Your wishlist is empty</h2>
            <p className="text-xs text-gray-400 max-w-xs mt-2 mb-6 leading-relaxed">
              Browse our collections and tap the heart icon on products you love to save them here.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-900 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-[#088178] transition-colors duration-200"
            >
              Start Discovering
            </button>
          </div>
        )}

        {/* Cards Grid */}
        {wishlistItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {wishlistItems.map((product) => (
              <WishlistCard
                key={product._id}
                product={product}
                onRemove={handleRemove}
                onAddToCart={handleAddToCart}
                isAdded={isInCart(product._id)} 
                isRemoving={!!removingItems[product._id]}
              />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        {pendingCount > 0 && (
          <div className="sm:hidden mt-6">
            <button
              onClick={moveAllToCart}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-[#088178] transition-colors shadow-md"
            >
              <FiShoppingCart size={14} />
              Add All ({pendingCount}) to Cart
            </button>
          </div>
        )}

        {/* Summary strip */}
        {wishlistItems.length > 0 && (
          <div className="mt-8 bg-white border border-gray-100 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center flex-wrap gap-x-5 gap-y-1 text-xs font-semibold text-gray-500">
              <span>
                Saved: <span className="text-gray-900 font-bold">{wishlistItems.length}</span>
              </span>
              <span className="hidden sm:inline text-gray-200">|</span>
              <span>
                In stock: <span className="text-green-600 font-bold">{availableCount}</span>
              </span>
              <span className="hidden sm:inline text-gray-200">|</span>
              <span>
                Added to cart:{" "}
                <span className="text-[#088178] font-bold">{addedCount}</span>
              </span>
              <span className="hidden sm:inline text-gray-200">|</span>
              <span>
                Total value:{" "}
                <span className="text-gray-900 font-extrabold">
                  ₹{totalValue.toLocaleString()}
                </span>
              </span>
            </div>
            <button
              onClick={() => navigate("/")}
              className="text-xs font-bold text-[#088178] hover:underline underline-offset-2 flex-shrink-0"
            >
              Continue Shopping →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}