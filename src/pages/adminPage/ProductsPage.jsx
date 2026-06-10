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
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";



import {
  useGetProductsQuery,
  useDeleteProductMutation,
  
} from "../../redux/api/productApiSlice";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [modal, setModal] = useState(null);

  const { data, isLoading, error } = useGetProductsQuery();

  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.products || [];

  const filteredProducts = products.filter((p) => {
    const name = p?.name?.toLowerCase() || "";
    const brand = p?.brand?.toLowerCase() || "";
    const query = search.toLowerCase();

    const matchSearch = name.includes(query) || brand.includes(query);

    const matchCat = filterCat === "All" || p.category === filterCat;

    return matchSearch && matchCat;
  });

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
    <div className="space-y-6 antialiased font-sans text-slate-800">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
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
          <div className="relative min-w-[180px]">
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
          onClick={() => setModal("add")}
          className="flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          <FiPlus size={16} />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const hasDiscount =
                    p.discountPrice &&
                    Number(p.discountPrice) < Number(p.price);

                  return (
                    <tr key={p._id} className="hover:bg-slate-50">
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-lg overflow-hidden border bg-slate-100">
                            {p.image ? (
                              <img
                                src={p.image}
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

                          <p>Colors: {p.colors || "-"}</p>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        {hasDiscount ? (
                          <>
                            <div className="font-bold text-teal-700">
                              ₹{p.discountPrice}
                            </div>

                            <div className="line-through text-xs text-slate-400">
                              ₹{p.price}
                            </div>
                          </>
                        ) : (
                          <div className="font-semibold">₹{p.price}</div>
                        )}
                      </td>

                      {/* Stock + Rating */}
                      <td className="px-6 py-4">
                        <div>{p.stock} units</div>

                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={11}
                              className={
                                star <= (p.rating || 0)
                                  ? "text-amber-400"
                                  : "text-slate-200"
                              }
                            />
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setModal(p)}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal === "add" && <AddProduct onClose={() => setModal(null)} />}

      {modal && modal !== "add" && (
        <EditProduct product={modal} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
