import { createSlice } from "@reduxjs/toolkit";

const saved = localStorage.getItem("cartItems");

const initialState = {
  cartItems: saved ? JSON.parse(saved) : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const newItem = {
        ...item,
        color: typeof item.color === "object" ? item.color.name : item.color,
        colorHex:
          typeof item.colorHex === "object"
            ? item.colorHex.hex
            : item.colorHex,
      };

      const existing = state.cartItems.find(
        (i) =>
          i._id === newItem._id &&
          i.size === newItem.size &&
          i.color === newItem.color
      );

      if (existing) {
        existing.qty += newItem.qty;
      } else {
        state.cartItems.push(newItem);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // ✅ Now matches by _id + size + color so each size is a separate line item
    removeFromCart: (state, action) => {
      const { _id, size, color } = action.payload;
      state.cartItems = state.cartItems.filter(
        (i) => !(i._id === _id && i.size === size && i.color === color)
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },

    increaseQty: (state, action) => {
      const item = state.cartItems.find(
        (i) =>
          i._id === action.payload._id &&
          i.size === action.payload.size &&
          i.color === action.payload.color
      );
      if (item) item.qty += 1;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    decreaseQty: (state, action) => {
      const item = state.cartItems.find(
        (i) =>
          i._id === action.payload._id &&
          i.size === action.payload.size &&
          i.color === action.payload.color
      );
      if (item && item.qty > 1) item.qty -= 1;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQty,
  decreaseQty,
} = cartSlice.actions;

export default cartSlice.reducer;