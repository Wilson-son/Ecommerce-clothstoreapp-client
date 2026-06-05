import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { getFilteredProducts } from "../../api/productApi"; // ← from productApi

// ─── Thunk ───────────────────────────────────────────────────────────────────

export const fetchFilteredProducts = createAsyncThunk(
  "shop/fetchFilteredProducts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { selectedCategories, selectedColors, selectedSizes, maxPrice, page } =
        getState().shop;

      const { data } = await getFilteredProducts({
        selectedCategories,
        selectedColors,
        selectedSizes,
        maxPrice,
        page,
      });

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const shopSlice = createSlice({
  name: "shop",
  initialState: {
    filterOpen: true,
    selectedCategories: [],
    selectedColors: [],
    selectedSizes: [],
    maxPrice: 5000,
    page: 1,

    products: [],
    total: 0,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    toggleFilterPanel(state) {
      state.filterOpen = !state.filterOpen;
    },
    toggleCategory(state, { payload }) {
      state.selectedCategories = state.selectedCategories.includes(payload)
        ? state.selectedCategories.filter((v) => v !== payload)
        : [...state.selectedCategories, payload];
      state.page = 1;
    },
    toggleColor(state, { payload }) {
      state.selectedColors = state.selectedColors.includes(payload)
        ? state.selectedColors.filter((v) => v !== payload)
        : [...state.selectedColors, payload];
      state.page = 1;
    },
    toggleSize(state, { payload }) {
      state.selectedSizes = state.selectedSizes.includes(payload)
        ? state.selectedSizes.filter((v) => v !== payload)
        : [...state.selectedSizes, payload];
      state.page = 1;
    },
    setMaxPrice(state, { payload }) {
      state.maxPrice = payload;
      state.page = 1;
    },
    setPage(state, { payload }) {
      state.page = payload;
    },
    clearAllFilters(state) {
      state.selectedCategories = [];
      state.selectedColors = [];
      state.selectedSizes = [];
      state.maxPrice = 5000;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.products   = payload.products ?? payload;
        state.total      = payload.total ?? payload.length;
        state.totalPages = payload.totalPages ?? 1;
      })
      .addCase(fetchFilteredProducts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

// ─── Actions ─────────────────────────────────────────────────────────────────

export const {
  toggleFilterPanel,
  toggleCategory,
  toggleColor,
  toggleSize,
  setMaxPrice,
  setPage,
  clearAllFilters,
} = shopSlice.actions;

export default shopSlice.reducer;

// ─── Selectors ───────────────────────────────────────────────────────────────

export const selectProducts           = (state) => state.shop.products;
export const selectLoading            = (state) => state.shop.loading;
export const selectError              = (state) => state.shop.error;
export const selectTotalPages         = (state) => state.shop.totalPages;
export const selectTotal              = (state) => state.shop.total;
export const selectPage               = (state) => state.shop.page;
export const selectFilterOpen         = (state) => state.shop.filterOpen;
export const selectMaxPrice           = (state) => state.shop.maxPrice;
export const selectSelectedCategories = (state) => state.shop.selectedCategories;
export const selectSelectedColors     = (state) => state.shop.selectedColors;
export const selectSelectedSizes      = (state) => state.shop.selectedSizes;

export const selectHasActiveFilters = createSelector(
  selectSelectedCategories,
  selectSelectedColors,
  selectSelectedSizes,
  (categories, colors, sizes) =>
    categories.length > 0 || colors.length > 0 || sizes.length > 0
);