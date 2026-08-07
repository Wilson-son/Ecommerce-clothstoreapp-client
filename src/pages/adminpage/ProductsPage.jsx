import React, { useEffect, useState } from "react";

import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
} from "react-icons/fi";

import { categories } from "./adminData";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../redux/api/productApiSlice";

// ── Price block (shared between table + card view) ──────────────────────────
function PriceBlock({ p }) {
  const hasDiscount = p.discountPrice && Number(p.discountPrice) < Number(p.price);
  if (hasDiscount) {
    return (
      <>
        <div className="font-bold text-teal-700">₹{p.discountPrice}</div>
        <div className="line-through text-xs text-slate-400">₹{p.price}</div>
      </>
    );
  }
  return <div className="font-semibold">₹{p.price}</div>;
}

export default function ProductsPage({ onAddProduct, onEditProduct }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const [deleteProduct] = useDeleteProductMutation();
  const { data, isLoading, error } = useGetProductsQuery({
    search: debouncedSearch,
    category: filterCat,
    limit: 100, 
  });

  const products = data?.products || [];

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(id).unwrap();
      alert("Product deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load products
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 antialiased font-sans text-slate-800">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-md">
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="relative sm:min-w-[180px]">
            <FiFilter
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />

            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-sm appearance-none"
            >
              <option value="All">All Categories</option>

              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <FiChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={onAddProduct}
          className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold w-full sm:w-auto"
        >
          <FiPlus size={16} />
          Add Product
        </button>
      </div>

      {/* Products — empty state */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm text-center py-10 text-slate-400">
          No products found
        </div>
      ) : (
        <>
          {/* ── Mobile card list (below md) ── */}
          <div className="md:hidden bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
            {products.map((p) => (
              <div key={p._id} className="p-4 flex gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  {p.images?.[0]?.url ? (
                    <img
                      src={p.images[0].url}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                      No Pic
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.brand} · {p.category}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => onEditProduct(p)}
                        className="p-2 hover:bg-slate-100 rounded"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 text-[11px] text-slate-500">
                    <span>Sizes: {p.sizes || "-"}</span>
                    <span>Color: {p.color?.name || "-"}</span>
                    <span>Stock: {p.countInStock}</span>
                  </div>

                  <div className="mt-2 text-sm">
                    <PriceBlock p={p} />
                  </div>
                </div>
              </div>
            ))}
          </div>

        
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Item Details</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Variants</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50">
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100">
                            {p.images?.[0]?.url ? (
                              <img
                                src={p.images[0].url}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                                No Pic
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-semibold">{p.name}</p>
                            <p className="text-xs text-slate-500">{p.brand}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">{p.category}</td>

                      {/* Variants */}
                      <td className="px-6 py-4">
                        <div className="text-xs">
                          <p>Sizes: {p.sizes || "-"}</p>
                          <p>Colors: {p.color?.name || "-"}</p>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <PriceBlock p={p} />
                      </td>

                      {/* Stock */}
                      <td className="px-8 py-4">
                        <div className="text-sm text-slate-500 justify-center">
                          {p.countInStock}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => onEditProduct(p)}
                            className="p-2 hover:bg-slate-100 rounded"
                          >
                            <FiEdit2 size={14} />
                          </button>

                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-2 hover:bg-red-50 text-red-500 rounded"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}