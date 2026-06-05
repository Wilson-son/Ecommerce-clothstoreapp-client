import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronRight } from "react-icons/fi";
import { AiOutlineFilter } from "react-icons/ai";
import {
  toggleFilterPanel,
  setPage,
  fetchFilteredProducts,
  selectProducts,
  selectLoading,
  selectError,
  selectTotalPages,
  selectTotal,
  selectPage,
  selectFilterOpen,
  selectSelectedCategories,
  selectSelectedColors,
  selectSelectedSizes,
  selectMaxPrice,
} from "../redux/slices/shopSlice";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const dispatch = useDispatch();

  const products   = useSelector(selectProducts);
  const loading    = useSelector(selectLoading);
  const error      = useSelector(selectError);
  const totalPages = useSelector(selectTotalPages);
  const total      = useSelector(selectTotal);
  const page       = useSelector(selectPage);
  const filterOpen = useSelector(selectFilterOpen);

  // useEffect dependencies — re-fetch when any filter/page changes
  const selectedCategories = useSelector(selectSelectedCategories);
  const selectedColors     = useSelector(selectSelectedColors);
  const selectedSizes      = useSelector(selectSelectedSizes);
  const maxPrice           = useSelector(selectMaxPrice);

  useEffect(() => {
    dispatch(fetchFilteredProducts());
  }, [selectedCategories, selectedColors, selectedSizes, maxPrice, page, dispatch]);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Hero Banner */}
      <div
        className="relative w-full h-52 flex flex-col items-center justify-center text-white"
        style={{ background: "linear-gradient(135deg, #0d1b2a 0%, #1a2e44 50%, #0d1b2a 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #c0392b33 0%, transparent 50%), radial-gradient(circle at 80% 50%, #2980b933 0%, transparent 50%)",
          }}
        />
        <h1 className="text-5xl font-bold tracking-tight z-10">#stayhome</h1>
        <p className="text-sm text-gray-300 mt-2 z-10">
          save more with coupons & up to 70% off!
        </p>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">

        {/* Collapsible Filter Sidebar */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            filterOpen ? "w-52 opacity-100" : "w-0 opacity-0"
          }`}
        >
          <FilterSidebar />
        </div>

        {/* Product Area */}
        <div className="flex-1 min-w-0">

          {/* Topbar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => dispatch(toggleFilterPanel())}
              className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#088178] hover:text-[#088178] transition-colors"
            >
              <AiOutlineFilter size={16} />
              {filterOpen ? "Hide Filters" : "Show Filters"}
            </button>
            <span className="text-xs text-gray-400">{total} products</span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center h-60">
              <div className="w-8 h-8 border-4 border-[#088178] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex justify-center items-center h-60 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && products.length === 0 && (
            <div className="flex justify-center items-center h-60 text-gray-400 text-sm">
              No products match your filters.
            </div>
          )}

          {/* Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => dispatch(setPage(p))}
                  className={`w-10 h-10 rounded text-sm font-semibold transition-colors ${
                    page === p
                      ? "bg-[#088178] text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-[#088178] hover:text-[#088178]"
                  }`}
                >
                  {p}
                </button>
              ))}
              {page < totalPages && (
                <button
                  onClick={() => dispatch(setPage(Math.min(page + 1, totalPages)))}
                  className="w-10 h-10 rounded bg-[#088178] text-white flex items-center justify-center hover:bg-[#066b63] transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}