// src/redux/newsletterSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk — replace the setTimeout with your real API call
export const subscribeNewsletter = createAsyncThunk(
  "newsletter/subscribe",
  async (email, { rejectWithValue }) => {
    try {
      // Replace with: await axios.post('/api/newsletter/subscribe', { email })
      await new Promise((res) => setTimeout(res, 1200));
      return { email };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Subscription failed.");
    }
  }
);

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState: {
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    subscribedEmail: null,
  },
  reducers: {
    resetNewsletter: (state) => {
      state.status = "idle";
      state.error = null;
      state.subscribedEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeNewsletter.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(subscribeNewsletter.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscribedEmail = action.payload.email;
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetNewsletter } = newsletterSlice.actions;
export default newsletterSlice.reducer;