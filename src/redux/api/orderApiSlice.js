import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApiSlice = createApi({
  reducerPath: "orderApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),

  tagTypes: ["Order"],

  endpoints: (builder) => ({
    // Razorpay
    createRazorpayOrder: builder.mutation({
      query: (data) => ({
        url: "/orders/create-order",
        method: "POST",
        body: data,
      }),
    }),

    verifyPayment: builder.mutation({
      query: (data) => ({
        url: "/orders/verify-payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),

    // User Orders
    getMyOrders: builder.query({
      query: () => ({
        url: "/orders/my-orders",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    // Single Order
    getOrderById: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    // Admin Orders
    getAllOrders: builder.query({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,

  useGetMyOrdersQuery,
  useGetOrderByIdQuery,

  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApiSlice;