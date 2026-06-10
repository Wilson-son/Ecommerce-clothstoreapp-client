import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import newsletterReducer from "./slices/newsLetterSlice";
import shopReducer from "./slices/shopSlice";

import { productApiSlice } from "./api/productApiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    newsletter: newsletterReducer,
    shop: shopReducer,

    // RTK Query reducer
    [productApiSlice.reducerPath]: productApiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApiSlice.middleware),
});