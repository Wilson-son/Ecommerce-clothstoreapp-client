import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetProductQuery, useGetProductsQuery } from "../redux/api/productApiSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/slices/wishlistSlice";
import { useSelector } from "react-redux";

import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import {
  FiHeart, FiArrowLeft, FiClock, FiPackage,
  FiTruck, FiCalendar, FiMinus, FiPlus, FiShoppingCart,
} from "react-icons/fi";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

// ── Stars ─────────────────────────────────────────────────────────────────────
function RenderStars({ rating, size = 13 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s}>
          {s <= Math.floor(rating) ? (
            <FaStar size={size} className="text-yellow-400" />
          ) : s - rating < 1 && s - rating > 0 ? (
            <FaStarHalfAlt size={size} className="text-yellow-400" />
          ) : (
            <FaRegStar size={size} className="text-gray-300" />
          )}
        </span>
      ))}
    </div>
  );
}

// ── Related product card ──────────────────────────────────────────────────────
function RelatedCard({ product, onClick }) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = !imgError && product.images?.[0]?.url ? product.images[0].url : PLACEHOLDER;

  return (
    <button
      onClick={onClick}
      className="group text-left rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white flex flex-col"
    >
      <div className="w-full aspect-square overflow-hidden bg-gray-50">
        <img src={imgSrc} alt={product.name} onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{product.brand || "Fashion"}</p>
        <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">{product.name}</p>
        {/* color dot from model */}
        {product.color?.name && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0"
              style={{ background: product.color.hex || "#ccc" }} />
            <span className="text-[10px] text-gray-400">{product.color.name}</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <p className="text-sm font-bold text-gray-900">₹{product.price?.toFixed(2)}</p>
          <span className="text-[10px] bg-gray-900 text-white rounded-full px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            View
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Accordion ─────────────────────────────────────────────────────────────────
function AccordionItem({ label, open, onToggle, children }) {
  return (
    <div className="mb-1">
      <button onClick={onToggle} className="w-full flex items-center justify-between py-3">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        <span className="text-gray-400 text-base leading-none select-none">{open ? "−" : "+"}</span>
      </button>
      {open && children}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const dispatch   = useDispatch();

  // ── Current product ───────────────────────────────────────────────────────
  const { data: product, isLoading, error } = useGetProductQuery(id);
  // getProduct already transforms: transformResponse: (res) => res.product ?? res

  // ── Wishlist state ────────────────────────────────────────────────────────
  const wishlistItems = useSelector((s) => s.wishlist?.wishlistItems || []);
  const isWishlisted  = wishlistItems.some((w) => (w._id || w.id) === id);

  // ── Related products: same category, different _id ────────────────────────
  const { data: relatedData } = useGetProductsQuery(
    { category: product?.category, limit: 9 },
    { skip: !product?.category },
  );
  const relatedProducts = (relatedData?.products || [])
    .filter((p) => p._id !== id)
    .slice(0, 8);

  // ── UI state ──────────────────────────────────────────────────────────────
  const sizes     = product?.sizes?.length ? product.sizes : ["S", "M", "L", "XL"];
  const [quantity,      setQuantity]      = useState(1);
  const [selectedSize,  setSelectedSize]  = useState("");
  const [selectedImg,   setSelectedImg]   = useState(0);
  const [openSection,   setOpenSection]   = useState("description");
  const [imgErrors,     setImgErrors]     = useState({});

  const images    = product?.images?.length ? product.images.map((i) => i.url) : [PLACEHOLDER];
  const activeImg = imgErrors[selectedImg] ? PLACEHOLDER : (images[selectedImg] ?? PLACEHOLDER);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({
      _id:      product._id,
      name:     product.name,
      image:    product.images?.[0]?.url || "",
      price:    product.price,
      qty:      quantity,
      size:     selectedSize || sizes[0],
      // color from model — single object { name, hex }
      color:    product.color?.name || "Default",
      colorHex: product.color?.hex  || "#999",
    }));
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist({
        _id:    product._id,
        name:   product.name,
        brand:  product.brand,
        price:  product.price,
        images: product.images,
        color:  product.color,
      }));
    }
  };

  const handleQty    = (d) => setQuantity((q) => Math.max(1, Math.min(99, q + d)));
  const toggleSection = (k) => setOpenSection((p) => (p === k ? null : k));

  // ── Loading / error ───────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
    </div>
  );

  if (error || !product) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-gray-400">
      <p className="text-sm">Product not found.</p>
      <button onClick={() => navigate("/")} className="text-xs underline hover:text-gray-700">Back to Home</button>
    </div>
  );

  // Discount: model stores discountPrice as the lower "sale" price
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <button onClick={() => navigate("/")} className="flex items-center gap-1 hover:text-gray-700 transition">
            <FiArrowLeft size={13} /> Home
          </button>
          <span>›</span>
          <span className="text-gray-400">{product.category}</span>
          <span>›</span>
          <span className="text-gray-600 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* ── Main card ── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* LEFT: Images */}
            <div className="flex flex-col p-4 lg:w-[380px] flex-shrink-0">
              <div className="rounded-xl overflow-hidden bg-gray-50 mb-3 aspect-square w-full">
                <img
                  src={activeImg}
                  alt={product.name}
                  onError={() => setImgErrors((p) => ({ ...p, [selectedImg]: true }))}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.slice(0, 4).map((img, i) => (
                    <button key={i} onClick={() => setSelectedImg(i)}
                      className="flex-1 rounded-lg overflow-hidden"
                      style={{ aspectRatio: "1", border: selectedImg === i ? "2px solid #111" : "2px solid transparent", background: "#f5f5f5" }}>
                      <img src={imgErrors[i] ? PLACEHOLDER : img} alt={`thumb-${i}`}
                        onError={() => setImgErrors((p) => ({ ...p, [i]: true }))}
                        className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Info */}
            <div className="flex-1 px-6 py-6 border-t lg:border-t-0 lg:border-l border-gray-100">

              {/* Brand + name */}
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{product.brand || "Fashion"}</p>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-snug">{product.name}</h1>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{hasDiscount ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm text-gray-400 line-through">₹{product.price.toFixed(2)}</span>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      {discountPct}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Color — single object from model */}
              {product.color?.name && (
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="w-5 h-5 rounded-full border-2 border-gray-900 flex-shrink-0"
                    style={{ background: product.color.hex || "#ccc" }}
                  />
                  <span className="text-sm font-medium text-gray-700">{product.color.name}</span>
                </div>
              )}

              {/* Delivery note */}
              <div className="flex items-center gap-2 text-xs text-gray-500 border border-gray-100 rounded-lg px-3 py-2 w-fit mb-5 bg-gray-50">
                <FiClock size={13} className="text-gray-400" />
                Order in <span className="font-semibold text-gray-700 mx-1">02:30:25</span> for next-day delivery
              </div>

              <div className="border-t border-gray-100 mb-5" />

              {/* Size */}
              <p className="text-sm font-semibold text-gray-700 mb-3">Select Size</p>
              <div className="flex gap-2 mb-5 flex-wrap">
                {sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
                    style={{ background: selectedSize === s ? "#111" : "#f3f4f6", color: selectedSize === s ? "#fff" : "#374151" }}>
                    {s}
                  </button>
                ))}
              </div>

              {/* Quantity */}
              <p className="text-sm font-semibold text-gray-700 mb-3">Quantity</p>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                  <button onClick={() => handleQty(-1)} disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition text-gray-600 disabled:opacity-40">
                    <FiMinus size={13} />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-gray-800">{quantity}</span>
                  <button onClick={() => handleQty(1)} disabled={quantity >= (product.countInStock || 99)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition text-gray-600 disabled:opacity-40">
                    <FiPlus size={13} />
                  </button>
                </div>
                <span className={`text-xs font-medium ${product.countInStock > 0 ? "text-green-600" : "text-red-500"}`}>
                  {product.countInStock > 0 ? `${product.countInStock} in stock` : "Out of stock"}
                </span>
              </div>

              {/* CTA row */}
              <div className="flex gap-3 mb-5">
                <button
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-semibold py-3 rounded-full hover:bg-[#088178] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <FiShoppingCart size={15} />
                  {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                  onClick={handleWishlist}
                  className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition flex-shrink-0"
                >
                  <FiHeart size={16} style={{ fill: isWishlisted ? "#ef4444" : "none", stroke: isWishlisted ? "#ef4444" : "#9ca3af" }} />
                </button>
              </div>

              <div className="border-t border-gray-100 mb-1" />

              <AccordionItem label="Description & Fit" open={openSection === "description"} onToggle={() => toggleSection("description")}>
                <p className="text-xs text-gray-500 leading-relaxed pb-3">
                  {product.description || "No description available."}
                </p>
              </AccordionItem>

              <div className="border-t border-gray-100" />

              <AccordionItem label="Shipping" open={openSection === "shipping"} onToggle={() => toggleSection("shipping")}>
                <div className="grid grid-cols-2 gap-3 pb-4">
                  {[
                    { icon: <FiPackage size={14} />, label: "Discount",           value: hasDiscount ? `${discountPct}% Off` : "No discount" },
                    { icon: <FiPackage size={14} />, label: "Package",            value: "Regular Package" },
                    { icon: <FiTruck size={14} />,   label: "Delivery Time",      value: "3–4 Working Days" },
                    { icon: <FiCalendar size={14} />,label: "Estimated Arrival",  value: "Within 1 week" },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2">
                      <span className="mt-0.5 text-gray-400">{icon}</span>
                      <div>
                        <p className="text-[10px] text-gray-400">{label}</p>
                        <p className="text-xs font-semibold text-gray-700">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* ── Related products (same category) ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">You May Also Like</h2>
              <button
                onClick={() => navigate(`/shop?category=${product.category}`)}
                className="text-xs text-gray-400 hover:text-gray-700 transition underline underline-offset-2"
              >
                View all in {product.category}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <RelatedCard key={p._id} product={p} onClick={() => navigate(`/product/${p._id}`)} />
              ))}
            </div>
          </section>
        )}

        {/* ── Reviews (static until you build a review API) ── */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Ratings & Reviews</h2>
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Score */}
            <div className="flex flex-col items-start gap-2 w-36 flex-shrink-0">
              <div className="flex items-end gap-1">
                <span className="text-6xl font-extrabold text-gray-900 leading-none">
                  {product.rating?.toFixed(1) || "0.0"}
                </span>
                <span className="text-sm text-gray-400 mb-2">/ 5</span>
              </div>
              <RenderStars rating={product.rating || 0} />
              <p className="text-xs text-gray-400">{product.numReviews || 0} reviews</p>
            </div>

            {/* Empty reviews placeholder */}
            {(product.numReviews === 0 || !product.numReviews) && (
              <div className="flex-1 flex items-center justify-center py-10 border border-dashed border-gray-200 rounded-2xl">
                <p className="text-xs text-gray-400">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}