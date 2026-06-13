import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const stats = [
  { value: "12K+", label: "Happy Customers" },
  { value: "3.5K+", label: "Products Listed" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "6+", label: "Years in Fashion" },
];

const team = [
  {
    name: "Arjun Mehta",
    role: "Founder & CEO",
    initials: "AM",
    bg: "bg-[#d4ede9]",
    text: "text-[#008073]",
    quote: "Fashion is confidence you can wear.",
  },
  {
    name: "Priya Nair",
    role: "Head of Design",
    initials: "PN",
    bg: "bg-[#fde8e4]",
    text: "text-[#c0574a]",
    quote: "Every stitch tells a story.",
  },
  {
    name: "Ravi Krishnan",
    role: "Operations Lead",
    initials: "RK",
    bg: "bg-[#e8eaf6]",
    text: "text-[#4a5ab0]",
    quote: "Reliability is our best product.",
  },
];

const values = [
  {
    icon: "✦",
    title: "Premium Quality",
    desc: "Every product is sourced from verified manufacturers and passes strict quality checks before reaching you.",
  },
  {
    icon: "♻",
    title: "Sustainable Fashion",
    desc: "We partner with eco-conscious brands and use minimal, recyclable packaging on every order.",
  },
  {
    icon: "◎",
    title: "Customer First",
    desc: "From seamless checkout to hassle-free returns, your experience drives every decision we make.",
  },
  {
    icon: "⬡",
    title: "Inclusive Style",
    desc: "Fashion for every body, every age, every occasion. Our catalog spans sizes XS to 5XL.",
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Breadcrumb ── */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 hover:text-gray-700 transition"
          >
            <FiArrowLeft size={12} />
            Home
          </button>
          <span>›</span>
          <span className="text-gray-600">About Us</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="bg-[#f7f9f8] border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12">

          {/* Left text */}
          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#008073] mb-4 block">
              Our Story
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-6">
              Redefining<br />
              <span className="text-[#008073]">everyday</span><br />
              fashion.
            </h1>
            <p className="text-[15px] text-gray-500 leading-relaxed max-w-md mb-8">
              Cara was born in 2018 from a simple belief — that premium style shouldn't cost a fortune. We curate the finest apparel from around the world and bring it directly to your doorstep.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-7 py-3 rounded-full hover:bg-[#008073] transition-colors duration-200"
            >
              Shop the Collection
              <FiArrowRight size={15} />
            </button>
          </div>

          {/* Right: abstract brand block */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-72 h-72">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full bg-[#d4ede9] opacity-40" />
              {/* Inner card */}
              <div className="absolute inset-6 rounded-3xl bg-white shadow-lg flex flex-col items-center justify-center gap-3 p-6">
                <div className="text-5xl font-black text-[#008073] tracking-tighter leading-none">
                  Cara
                </div>
                <div className="w-10 h-0.5 bg-[#008073] rounded" />
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  Premium fashion,<br />curated for you.
                </p>
                <div className="flex gap-2 mt-2">
                  {["#6D1C2A", "#1C2B4A", "#C8A96E", "#9CA3AF"].map((c) => (
                    <div
                      key={c}
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="bg-[#f7f9f8] rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-gray-100"
            >
              <span className="text-4xl font-extrabold text-gray-900 leading-none mb-2">
                {value}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="bg-[#f7f9f8] border-y border-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#008073] block mb-3">
              What We Stand For
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#008073]/20 transition-all duration-200"
              >
                <span className="text-2xl mb-4 block text-[#008073]">{icon}</span>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#008073] block mb-3">
            The People Behind Cara
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900">Meet the Team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map(({ name, role, initials, bg, text, quote }) => (
            <div
              key={name}
              className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
            >
              {/* Avatar area */}
              <div className={`${bg} h-40 flex items-center justify-center`}>
                <div
                  className={`w-20 h-20 rounded-full bg-white flex items-center justify-center text-2xl font-extrabold ${text} shadow-sm`}
                >
                  {initials}
                </div>
              </div>
              {/* Info */}
              <div className="bg-white p-5">
                <p className="text-sm font-bold text-gray-900">{name}</p>
                <p className="text-xs text-[#008073] font-medium mb-3">{role}</p>
                <p className="text-xs text-gray-400 italic leading-relaxed">"{quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission Banner ── */}
      <section className="bg-gray-900 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#008073] block mb-4">
            Our Mission
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-6">
            "Make every person feel <span className="text-[#008073]">effortlessly styled</span> — without compromise."
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xl mx-auto mb-8">
            We believe fashion is a right, not a privilege. From our Chennai roots to customers across India and beyond, Cara is committed to bringing you style that's accessible, sustainable, and always on point.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 bg-[#008073] text-white text-sm font-semibold px-8 py-3 rounded-full hover:bg-[#00665c] transition-colors duration-200"
          >
            Explore Products
            <FiArrowRight size={15} />
          </button>
        </div>
      </section>

    </div>
  );
}