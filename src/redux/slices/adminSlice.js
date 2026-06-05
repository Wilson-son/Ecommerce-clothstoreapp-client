import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {logout} from "./authSlice";
import axios from "axios";

export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/dashboard",
        {
          withCredentials: true, 
        }
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Something went wrong"
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Request failed";
      })

      
      .addCase(logout, (state) => {
        state.data = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export default adminSlice.reducer;