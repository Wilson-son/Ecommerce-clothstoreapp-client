import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./authSlice";
import axios from "axios";

export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/stats`,
        {
          withCredentials: true,
        }
      );
  
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Something went wrong."
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null; // clear previous error before each new request
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Request failed.";
      })

      // Handles cross-slice reset — logout must remain a plain action (not a thunk)
      .addCase(logout, (state) => {
        state.data = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;