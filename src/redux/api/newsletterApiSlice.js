import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const newsletterApiSlice= createApi({
  reducerPath: "newsletterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Newsletter"],
  endpoints: (builder) => ({
    subscribe: builder.mutation({
      query: (email) => ({
        url: "/newsletter",
        method: "POST",
        body: { email },
      }),
      invalidatesTags: ["Newsletter"],
    }),

    getSubscribers: builder.query({
      query: () => "/newsletter",
      providesTags: ["Newsletter"],
    }),

    deleteSubscriber: builder.mutation({
      query: (id) => ({
        url: `/newsletter/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Newsletter"],
    }),
  }),
});

export const {
  useSubscribeMutation,
  useGetSubscribersQuery,
  useDeleteSubscriberMutation,
} = newsletterApiSlice;