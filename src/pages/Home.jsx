import React, { useMemo } from "react";
import ProductCard from "../components/ProductCard";
import HeroSlider from "../components/HeroSlider";

import { useGetProductsQuery } from "../redux/api/productApiSlice";

import shopnowlogo from "../assets/shopnowlogo.png";
import tralleylogo from "../assets/tralleylogo.png";
import offerbg from "../assets/offerbg.jpg";
import orangegirl from "../assets/orangegirl.png";
import greentshirt from "../assets/greentshirt.jpg";
import girlsfashion from "../assets/girlsfashion.jpg";
import tribe from "../assets/tribe.jpg";
import whitetshirt from "../assets/whitetshirt.jpg";

// ── Shared Tailwind Style Aggregations (Keeps JSX clean) ──
const CARD_BASE =
  "relative flex flex-col justify-end items-start p-8 rounded-2xl overflow-hidden shadow-md group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 min-h-[400px] bg-center bg-cover bg-no-repeat";
const MINI_CARD_BASE =
  "relative flex flex-col justify-center items-start p-8 rounded-xl overflow-hidden shadow-sm h-[320px] bg-center bg-cover bg-no-repeat w-full";
const OVERLAY_GRADIENT = (
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0" />
);

// ── Stable Inline Style Objects ──
const offerBgStyle = { background: `url('${offerbg}') center/cover no-repeat` };
const orangeGirlStyle = { backgroundImage: `url(${orangegirl})` };
const greenTshirtStyle = { backgroundImage: `url(${greentshirt})` };
const girlsFashionStyle = { backgroundImage: `url(${girlsfashion})` };
const tribStyle = { backgroundImage: `url(${tribe})` };
const whiteTshirtStyle = { backgroundImage: `url(${whitetshirt})` };

// ── Skeleton Grid Loader ──
function GridSkeleton() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-4 md:px-8 mt-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse border border-gray-100 rounded-2xl p-4 space-y-4 bg-white shadow-sm"
        >
          <div className="bg-gray-200 rounded-xl h-64 w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { data, isLoading, isError } = useGetProductsQuery();

  const products = useMemo(() => data?.products ?? data ?? [], [data]);
  const featured = useMemo(() => products.slice(0, 8), [products]);
  const newArrivals = useMemo(() => products.slice(8, 16), [products]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900 overflow-x-hidden">
      {/* ── Hero Section ── */}
      <HeroSlider />

      {/* ── Featured Products ── */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Featured Products
          </h2>
          <p className="text-gray-500 mt-2 text-base md:text-lg max-w-md mx-auto">
            Summer Collection New Modern Design
          </p>
        </div>

        {isLoading ? (
          <GridSkeleton />
        ) : isError ? (
          <div className="text-center py-5">
            <p className="text-red-500 font-medium">
              Failed to load featured products.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3  sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 container mx-auto  px-4 md:px-8 mt-10 ">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Mid-Page Mega Offer Banner ── */}
 <section className="container mx-auto md:px-8 my-6">
<div className="rounded-3xl text-center py-10 sm:py-12 shadow-lg bg-gradient-to-r from-[#F4FBF8] to-[#E3F5EE] border border-[#D8ECE4]">
    {/* Content */}
  
          {/* Subtle dimming layer for text contrast */}
          <div className="absolute inset-0 bg-black/40 z-0" />

          <div className="relative z-10 space-y-2.5 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FFB800]">
              Limited Time Offers
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
              Up to 70% Off — All T-Shirts &amp; Accessories
            </h2>
            <div className="pt-2">
              <button className="bg-white text-gray-900 font-bold px-7 py-3 rounded-full shadow-lg hover:bg-gray-100 transition active:scale-95 text-sm">
                Explore Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            New Arrivals
          </h2>
          <p className="text-gray-500 mt-2 text-base md:text-lg max-w-md mx-auto">
            Summer Collection New Modern Design
          </p>
        </div>

        {isLoading ? (
          <GridSkeleton />
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 container mx-auto px-4 md:px-8 mt-10">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Big Promo Dual Banners ── */}
      <section className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className={CARD_BASE} style={orangeGirlStyle}>
            {OVERLAY_GRADIENT}
            <div className="relative z-10 space-y-2 max-w-md">
              <h4 className="text-lg font-semibold text-gray-300">
                Crazy Deals
              </h4>
              <h3 className="text-3xl sm:text-4xl font-black text-white">
                Buy 1 Get 1 Free
              </h3>
              <p className="text-gray-200 text-sm sm:text-base">
                The best classic dress is on sale at Cara. Grab it before stocks
                run dry.
              </p>
              <div className="pt-2">
                <button className="border-2 border-white text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-white hover:text-black transition duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className={CARD_BASE} style={greenTshirtStyle}>
            {OVERLAY_GRADIENT}
            <div className="relative z-10 space-y-2 max-w-md">
              <h4 className="text-lg font-semibold text-gray-300">
                Spring/Summer
              </h4>
              <h3 className="text-3xl sm:text-4xl font-black text-white">
                Upcoming Season
              </h3>
              <p className="text-gray-200 text-sm sm:text-base">
                Discover tailored minimalistic aesthetics for the upcoming
                warmer weather days.
              </p>
              <div className="pt-2">
                <button className="border-2 border-white text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-white hover:text-black transition duration-300">
                  Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Small Editorial Micro Banners ── */}
      <section className="container mx-auto px-4 md:px-8 py-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Micro Card 1 */}
          <div className={MINI_CARD_BASE} style={girlsFashionStyle}>
            {OVERLAY_GRADIENT}
            <div className="relative z-10 space-y-1">
              <h3 className="text-2xl font-black text-white tracking-tight">
                SEASONAL SALE
              </h3>
              <p className="text-emerald-400 font-bold text-sm tracking-wide">
                Winter Collection - 50% OFF
              </p>
            </div>
          </div>

          {/* Micro Card 2 */}
          <div className={MINI_CARD_BASE} style={tribStyle}>
            {OVERLAY_GRADIENT}
            <div className="relative z-10 space-y-1">
              <h3 className="text-2xl font-black text-white tracking-tight">
                FOOTWEAR
              </h3>
              <p className="text-amber-400 font-bold text-sm tracking-wide">
                Spring / Summer 2026
              </p>
            </div>
          </div>

          {/* Micro Card 3 */}
          <div className={MINI_CARD_BASE} style={whiteTshirtStyle}>
            {OVERLAY_GRADIENT}
            <div className="relative z-10 space-y-1">
              <h3 className="text-2xl font-black text-white tracking-tight">
                NEW T-SHIRTS
              </h3>
              <p className="text-rose-400 font-bold text-sm tracking-wide">
                Trendy Minimalist Prints
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
