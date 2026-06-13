import React, { useState, useEffect, useMemo } from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi2";
import { Heart } from "lucide-react";

// Asset Imports
import offerbg from "../assets/offerbg.jpg";
import orangegirl from "../assets/orangegirl.png";
import greentshirt from "../assets/greentshirt.jpg";
import tralleylogo from "../assets/tralleylogo.png";
import bggreenboylogo from "../assets/bggreenboylogo.png";
import redgirl from "../assets/redgirl.png";
import shopbg from "../assets/shopbg.png";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 3 Slide Configurations synced with background images and texts
  const slides = useMemo(
    () => [
      {
        tagline: "SCULPTURAL COATS FOR",
        titleMain: "MODERN SILHOUETTES AND",
        titleHighlight: "EVERYDAY COMFORT",
        bgImage:bggreenboylogo,
        cardTitle: "Designer Overcoat",
        cardDesc:
          "A sculptural tailored coat designed for minimal style, pure comfort, and sharp modern structures.",
        thumbnail: orangegirl,
      },
      {
        tagline: "URBAN UTILITY FOR",
        titleMain: "DISTINCTIVE INTERIORS AND",
        titleHighlight: "UPCOMING SEASON",
        bgImage: shopbg,
        cardTitle: "Minimalist Knitwear",
        cardDesc:
          "Premium lightweight fabric blend rendering a breathable structure for changing weather profiles.",
        thumbnail: tralleylogo,
      },
      {
        tagline: "CASUAL CLASSICS FOR",
        titleMain: "VIBRANT TEXTURES AND",
        titleHighlight: "DYNAMIC STYLING",
        bgImage: redgirl,
        cardTitle: "Summer Essentials",
        cardDesc:
          "Crisp cuts celebrating individual expression without sacrificing basic daily convenience.",
        thumbnail: orangegirl,
      },
    ],
    [],
  );

  // Automatic slide timing configuration loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#F3F3F3]">
      {/* ── BACKGROUND HERO IMAGES SLIDER ── */}
        {/* BACKGROUND SLIDER */}
  <div className="absolute inset-0 z-0  ">
    {slides.map((slide, index) => (
      <div
        key={index}
        className={`absolute inset-0 bg-[position:center_20%] bg-cover bg-no-repeat transition-all duration-1000 ease-in-out transform ${
          index === currentSlide
            ? "opacity-100 scale-100"
            : "opacity-0 scale-105 pointer-events-none"
        }`}
        style={{ backgroundImage: `url(${slide.bgImage})`,filter: "brightness(1.2)", }}
      />
    ))}

    {/* OPTIONAL: very light overlay (NO BLUR) */}
    <div className="absolute inset-0 bg-black/10" />
  </div>

      {/* ── HERO TEXT LAYER & GRAPHICS ARRANGEMENT ── */}
      <main className="relative z-10 w-full h-full flex flex-col justify-between pt-40 pb-16 px-6 md:px-16 lg:px-24 select-none">
        {/* Big Layout Typography Content blocks */}
        <div className="max-w-5xl space-y-1 mt-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.08]">
            {slides[currentSlide].tagline} <br />
            <span className="text-black/40 font-normal">
              {slides[currentSlide].titleMain}
            </span>{" "}
            <br />
            {slides[currentSlide].titleHighlight}
          </h1>
        </div>

        {/* Layout Lower Interactive Row */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          {/* Glassmorphic Floating Product Showcase Card */}
          <div className="w-full max-w-md bg-black/10 backdrop-blur-xl p-4 rounded-[2rem] border border-white/30 shadow-xl flex gap-5 items-center">
            <div className="w-24 h-24 rounded-2xl bg-white/80 border border-white/20 overflow-hidden p-2 flex-shrink-0 flex items-center justify-center">
              <img
                src={slides[currentSlide].thumbnail}
                alt="Product feature"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="space-y-2 text-white">
              <h3 className="font-bold text-gray-900 text-base tracking-wide leading-tight">
                {slides[currentSlide].cardTitle}
              </h3>
              <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
                {slides[currentSlide].cardDesc}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button className="bg-white text-black font-semibold text-xs px-6 py-2.5 rounded-full shadow hover:bg-gray-100 transition active:scale-95">
                  Shop Now
                </button>
                <button className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow transition hover:bg-gray-50 active:scale-95">
                  <Heart size={14} className="text-gray-900" />
                </button>
              </div>
            </div>
          </div>

          {/* Core Central Dynamic Layout Arrow Navigation Toggles */}
          <div className="flex items-center gap-3 md:absolute md:left-1/2 md:-translate-x-1/2 bottom-16">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white text-black border border-gray-200/50 shadow flex items-center justify-center hover:bg-gray-50 transition active:scale-90"
            >
              <HiArrowLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white text-black border border-gray-200/50 shadow flex items-center justify-center hover:bg-gray-50 transition active:scale-90"
            >
              <HiArrowRight size={18} />
            </button>
          </div>
        </div>
      </main>

      {/* ── VERTICAL RIGHT EDGE ACTIVE DOT INDICATORS ── */}
      <div className="absolute right-6 bottom-16 z-20 flex flex-col gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`transition-all duration-300 rounded-full w-2.5 ${
              i === currentSlide
                ? "h-6 bg-black"
                : "h-2.5 bg-black/30 hover:bg-black/60"
            }`}
            aria-label={`Show slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
