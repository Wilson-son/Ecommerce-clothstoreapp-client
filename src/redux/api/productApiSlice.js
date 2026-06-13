import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApiSlice = createApi({
  reducerPath: "productApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),

  tagTypes: ["Product"],

  endpoints: (builder) => ({

    // ── GET ALL PRODUCTS ────────────────────────────────────────────────────
    getProducts: builder.query({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        const { category, brand, size, color, minPrice, maxPrice, sort, search, page, limit } = filters;

        if (category && category !== "All") params.set("category", category);
        if (brand && brand !== "All")       params.set("brand", brand);
        if (size)                           params.set("size", size);
        if (color)                          params.set("color", color);   // "color.name" filter on backend
        if (minPrice)                       params.set("minPrice", minPrice);
        if (maxPrice)                       params.set("maxPrice", maxPrice);
        if (sort)                           params.set("sort", sort);
        if (search)                         params.set("search", search);
        if (page)                           params.set("page", page);
        if (limit)                          params.set("limit", limit);

        return `/products?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map((p) => ({ type: "Product", id: p._id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // ── GET SINGLE PRODUCT ──────────────────────────────────────────────────
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      // backend returns { success, product } — unwrap it
      transformResponse: (res) => res.product ?? res,
      providesTags: (_res, _err, id) => [{ type: "Product", id }],
    }),

    // ── CREATE PRODUCT (ADMIN) ──────────────────────────────────────────────
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // ── UPDATE PRODUCT (ADMIN) ──────────────────────────────────────────────
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    // ── DELETE PRODUCT (ADMIN) ──────────────────────────────────────────────
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // ── UPLOAD IMAGE ────────────────────────────────────────────────────────
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadImageMutation,
} = productApiSlice;