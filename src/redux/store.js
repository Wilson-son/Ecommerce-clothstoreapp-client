import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";


import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice"
import { productApiSlice } from "./api/productApiSlice";
import { newsletterApiSlice } from "./api/newsLetterApiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    

   
    

    // RTK Query reducer
    [productApiSlice.reducerPath]: productApiSlice.reducer,
    [newsletterApiSlice.reducerPath]: newsletterApiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApiSlice.middleware,newsletterApiSlice.middleware),
});