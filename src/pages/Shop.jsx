import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiFilter, FiX, FiChevronDown, FiChevronUp,
  FiArrowRight, FiArrowLeft, FiSearch,
} from "react-icons/fi";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import ProductCard from "../components/ProductCard";
import shopbg from "../assets/shopbg.png";

const ITEMS_PER_PAGE = 12;
const CATEGORIES   = ["All", "T-Shirts", "Shirts", "Pants", "Jackets", "Accessories"];
const BRANDS       = ["All", "Adidas", "Nike", "Puma", "H&M", "Vierdo", "Zara",];
const SIZES        = ["XS", "S", "M", "L", "XL", "XXL"];
const SORT_OPTIONS = [
  { label: "Newest",            value: "newest"     },
  { label: "Price: Low → High", value: "price_asc"  },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Top Rated",         value: "rating"     },
];
const PRICE_PRESETS = [
  { label: "Under ₹500",       min: 0,    max: 500   },
  { label: "₹500 – ₹1,000",   min: 500,  max: 1000  },
  { label: "₹1,000 – ₹2,500", min: 1000, max: 2500  },
  { label: "₹2,500 – ₹5,000", min: 2500, max: 5000  },
  { label: "Above ₹5,000",     min: 5000, max: 99999 },
];

function Section({ title, active, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 last:border-none py-4">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-700">{title}</span>
          {active && <span className="w-1.5 h-1.5 rounded-full bg-[#088178]" />}
        </div>
        {open ? <FiChevronUp size={13} className="text-gray-400" /> : <FiChevronDown size={13} className="text-gray-400" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function FilterPanel({
  category, brand, sizes, pricePreset,
  updateFilter, toggleSize, resetFilters,
  activeCount, onClose,
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button onClick={resetFilters} className="text-xs text-red-400 hover:text-red-600 font-medium">Reset</button>
          )}
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">
            <FiX size={14} />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-2">
        <Section title="Category" active={category !== "All"}>
          <div className="space-y-0.5">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => updateFilter("category", c)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${category === c ? "bg-[#e8f6ea] text-[#088178] font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
                {c}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Brand" active={brand !== "All"}>
          <div className="space-y-0.5">
            {BRANDS.map(b => (
              <button key={b} onClick={() => updateFilter("brand", b)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${brand === b ? "bg-[#e8f6ea] text-[#088178] font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
                {b}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Size" active={sizes.length > 0}>
          <div className="grid grid-cols-3 gap-2">
            {SIZES.map(s => (
              <button key={s} onClick={() => toggleSize(s)}
                className={`h-10 text-xs font-semibold rounded-lg border transition-all ${sizes.includes(s) ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
                {s}
              </button>
            ))}
          </div>
          {sizes.length > 0 && (
            <button onClick={() => updateFilter("size", "")} className="mt-2 text-xs text-[#088178] hover:underline">Clear sizes</button>
          )}
        </Section>

        <Section title="Price" active={!!pricePreset}>
          <div className="space-y-1.5">
            {PRICE_PRESETS.map(p => {
              const isActive = pricePreset?.label === p.label;
              return (
                <button key={p.label}
                  onClick={() => {
                    if (isActive) {
                      updateFilter("minPrice", "");
                      updateFilter("maxPrice", "");
                    } else {
                      updateFilter("minPrice", String(p.min));
                      updateFilter("maxPrice", String(p.max));
                    }
                  }}
                  className={`w-full flex items-center justify-between text-sm px-3 py-2.5 rounded-lg border transition-all ${isActive ? "border-[#088178] bg-[#e8f6ea] text-[#088178] font-semibold" : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300"}`}>
                  <span>{p.label}</span>
                  {isActive && <FiX size={11} />}
                </button>
              );
            })}
          </div>
        </Section>
      </div>
    </div>
  );
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [searchInput,  setSearchInput]  = useState(searchParams.get("search") || "");

  // ── Read all filters FROM the URL ──
  const category = searchParams.get("category") || "All";
  const brand     = searchParams.get("brand")    || "All";
  const sort      = searchParams.get("sort")     || "newest";
  const page      = Number(searchParams.get("page")) || 1;
  const minPrice  = searchParams.get("minPrice") || "";
  const maxPrice  = searchParams.get("maxPrice") || "";
  const search    = searchParams.get("search")   || "";
  const sizeParam = searchParams.get("size")     || "";
  const sizes     = sizeParam ? sizeParam.split(",") : [];

  // Derive pricePreset for UI highlight
  const pricePreset = PRICE_PRESETS.find(
    p => String(p.min) === minPrice && String(p.max) === maxPrice
  ) || null;

  // ── Write filters TO the URL ──
  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "All") next.delete(key);
    else next.set(key, value);
    next.set("page", "1"); // always reset page on filter change
    setSearchParams(next, { replace: true });
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next);
    window.scrollTo({ top: 240, behavior: "smooth" });
  };

  const toggleSize = (s) => {
    const next = sizes.includes(s) ? sizes.filter(x => x !== s) : [...sizes, s];
    updateFilter("size", next.join(","));
  };

  const resetFilters = () => setSearchParams({});

  // ── Debounce search input ──
  useEffect(() => {
    const t = setTimeout(() => updateFilter("search", searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── Active filter count for badge ──
  const activeCount = [
    category !== "All",
    brand !== "All",
    sizes.length > 0,
    !!pricePreset,
  ].filter(Boolean).length;

  // ── RTK Query — pass URL params directly as filters ──
  const { data, isLoading, isFetching } = useGetProductsQuery({
    category,
    brand,
    size:     sizes[0], // backend handles one size at a time
    minPrice,
    maxPrice,
    sort,
    search,
    page,
    limit: ITEMS_PER_PAGE,
  });

  const products   = data?.products   || [];
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.total      || 0;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Hero ── */}
      <div
        className="relative flex flex-col items-center justify-center text-center"
        style={{ backgroundImage: `url(${shopbg})`, backgroundSize: "cover", backgroundPosition: "center", height: "280px" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Season Collection</p>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">#StayHome</h1>
          <p className="text-white/60 text-sm">Up to 70% off — new season styles</p>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 md:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterOpen(o => !o)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 px-4 py-1.5 rounded-full hover:border-gray-900 transition-all"
            >
              <FiFilter size={14} />
              {filterOpen ? "Hide filters" : "Show filters"}
              {activeCount > 0 && (
                <span className="w-5 h-5 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </button>
            <span className="text-xs text-gray-400 hidden sm:block">
              {isFetching ? "Loading..." : `${totalCount} products`}
            </span>
          </div>

          {/* Search */}
          <div className="relative hidden md:block">
            <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="text-xs border border-gray-200 rounded-full pl-8 pr-4 py-1.5 outline-none bg-white text-gray-700 hover:border-gray-900 focus:border-gray-900 transition-all w-48"
            />
            {searchInput && (
              <button onClick={() => { setSearchInput(""); updateFilter("search", ""); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <FiX size={11} />
              </button>
            )}
          </div>

          <select
            value={sort}
            onChange={e => updateFilter("sort", e.target.value)}
            className="text-xs border border-gray-200 rounded-full px-4 py-1.5 outline-none bg-white text-gray-700 hover:border-gray-900 transition-all cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="relative px-4 md:px-8 py-8">

        {/* Filter panel */}
        <div
          className={`absolute top-8 left-4 md:left-8 z-10 transition-all duration-300 ease-in-out ${
            filterOpen ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-4 pointer-events-none"
          }`}
          style={{ width: "240px" }}
        >
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden" style={{ maxHeight: "calc(100vh - 160px)" }}>
            <FilterPanel
              category={category}
              brand={brand}
              sizes={sizes}
              pricePreset={pricePreset}
              updateFilter={updateFilter}
              toggleSize={toggleSize}
              resetFilters={resetFilters}
              activeCount={activeCount}
              onClose={() => setFilterOpen(false)}
            />
          </div>
        </div>

        {/* Grid wrapper — shifts right when filter open */}
        <div
          className="transition-all duration-300 ease-in-out"
          style={{ marginLeft: filterOpen ? "260px" : "0px" }}
        >
          {/* Fetching overlay — keeps old results visible while loading new ones */}
          <div className={`transition-opacity duration-200 ${isFetching && !isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-3xl bg-white border border-gray-100 p-3">
                    <div className="bg-gray-100 rounded-2xl h-52 w-full mb-3" />
                    <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center py-28 text-center gap-4">
                <span className="text-4xl">🛍️</span>
                <p className="text-gray-500 text-sm font-medium">No products match your filters.</p>
                <button onClick={resetFilters} className="text-sm text-[#088178] border border-[#088178] px-5 py-2 rounded-full hover:bg-[#088178] hover:text-white transition-colors font-semibold">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {products.map(product => (
                  <div key={product._id} className="overflow-hidden rounded-3xl">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination — driven by backend totalPages */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 disabled:opacity-30 hover:border-gray-900 transition"
              >
                <FiArrowLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p}
                  onClick={() => goToPage(p)}
                  className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${page === p ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-900"}`}>
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => goToPage(page + 1)}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 disabled:opacity-30 hover:border-gray-900 transition"
              >
                <FiArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}