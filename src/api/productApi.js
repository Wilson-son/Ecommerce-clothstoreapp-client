import API from "./authApi";

// ================= PRODUCTS =================

// Home page — fetch all products (no filters)
export const getAllProducts = () => API.get("/products");

// Shop page — fetch with filters + pagination
export const getFilteredProducts = ({
  selectedCategories = [],
  selectedColors = [],
  selectedSizes = [],
  maxPrice = 5000,
  page = 1,
  limit = 8,
}) => {
  const params = new URLSearchParams();

  selectedCategories.forEach((c) => params.append("category", c));
  selectedColors.forEach((c) => params.append("color", c));
  selectedSizes.forEach((s) => params.append("size", s));
  params.set("maxPrice", maxPrice);
  params.set("page", page);
  params.set("limit", limit);

  return API.get(`/products?${params}`);
};

// Single product by ID
export const getProductById = (id) => API.get(`/products/${id}`);