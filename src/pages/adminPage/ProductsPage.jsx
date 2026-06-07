import React, { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { categories } from "./adminData";
import ProductModal from "./ProductModal";

export default function ProductsPage({ products = [], setProducts }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [modal, setModal] = useState(null); // null | "add" | product

  // 🔒 SAFE FILTERING (prevents crash)
  const filteredProducts = products.filter((p) => {
    const name = p?.name?.toLowerCase() || "";
    const brand = p?.brand?.toLowerCase() || "";
    const query = search.toLowerCase();

    const matchSearch = name.includes(query) || brand.includes(query);
    const matchCat = filterCat === "All" || p.category === filterCat;

    return matchSearch && matchCat;
  });

  // 🔥 FIXED STATE UPDATE (prevents stale state bug)
  const handleSave = (form) => {
    setProducts((prev) => {
      if (modal === "add") {
        return [
          ...prev,
          {
            ...form,
            id: Date.now(),
            price: Number(form.price),
            stock: Number(form.stock),
          },
        ];
      }

      return prev.map((p) =>
        p.id === modal.id
          ? {
              ...p,
              ...form,
              price: Number(form.price),
              stock: Number(form.stock),
            }
          : p
      );
    });

    setModal(null);
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-5">

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">

        <div className="flex gap-3 flex-wrap flex-1">

          {/* Search */}
          <div className="relative min-w-[220px]">
            <FiSearch className="absolute left-3.5 top-3 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full bg-white border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#01796F]"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3.5 top-3 text-gray-400" />
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="bg-white border rounded-xl pl-9 pr-8 py-2.5 text-sm appearance-none"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <FiChevronDown className="absolute right-3 top-3.5 text-gray-400" />
          </div>

        </div>

        <button
          onClick={() => setModal("add")}
          className="bg-[#01796F] text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
        >
          <FiPlus className="inline mr-1" /> Add Product
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border overflow-hidden">

        <table className="w-full text-sm">

          <thead>
            <tr className="bg-[#f8fffe] border-b">
              <th className="text-left px-5 py-3">Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th className="text-right px-5">Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="border-t hover:bg-[#f8fffe]">

                  {/* Product */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        className="w-10 h-10 rounded-xl object-cover"
                        alt=""
                      />
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="text-center">{p.category}</td>

                  {/* Price */}
                  <td className="text-center font-semibold">
                    ₹{Number(p.price || 0).toLocaleString()}
                  </td>

                  {/* Stock */}
                  <td className="text-center">
                    {p.stock === 0 ? "Out" : p.stock}
                  </td>

                  {/* Rating */}
                  <td className="text-center">
                    {"⭐".repeat(p.rating || 0)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 text-right">
                    <button
                      onClick={() => setModal(p)}
                      className="mr-2"
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-500"
                    >
                      <FiTrash2 />
                    </button>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* MODAL */}
      {modal && (
        <ProductModal
          product={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

    </div>
  );
}