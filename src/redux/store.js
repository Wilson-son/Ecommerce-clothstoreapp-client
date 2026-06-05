import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import newsletterReducer from "./slices/newsLetterSlice";
import shopReducer from "./slices/shopSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
    admin: adminReducer,
    newsletter: newsletterReducer,
    shop: shopReducer,
    
  },
});