import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: {},
  globalLoading: false,
  error: null,
  apiResponse: null,
};

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    startRequest: (state, action) => {
      const { requestId } = action.payload;
      state.requests[requestId] = {
        loading: true,
        error: null,
        progress: 0,
      };
      state.globalLoading = true;
      // Clear previous API response when starting new request
      state.apiResponse = null;
    },
    finishRequest: (state, action) => {
      const { requestId } = action.payload;
      if (state.requests[requestId]) {
        state.requests[requestId].loading = false;
      }
      state.globalLoading = false;
    },
    setRequestProgress: (state, action) => {
      const { requestId, progress } = action.payload;
      if (state.requests[requestId]) {
        state.requests[requestId].progress = progress;
      }
    },
    setRequestError: (state, action) => {
      const { requestId, error } = action.payload;
      if (state.requests[requestId]) {
        state.requests[requestId].loading = false;
        state.requests[requestId].error = error;
      }
      // Store the complete error response
      state.error = error;
      state.apiResponse = {
        status: error.status,
        message: error.message || "Terjadi kesalahan",
        data: error.data,
      };
      state.globalLoading = false;
    },
    setApiResponse: (state, action) => {
      state.apiResponse = action.payload;
    },
    clearRequest: (state, action) => {
      const { requestId } = action.payload;
      delete state.requests[requestId];
      if (Object.keys(state.requests).length === 0) {
        state.globalLoading = false;
      }
    },
    clearError: (state) => {
      state.error = null;
      state.apiResponse = null;
    },
  },
});

export const {
  startRequest,
  finishRequest,
  setRequestProgress,
  setRequestError,
  setApiResponse,
  clearRequest,
  clearError,
} = apiSlice.actions;

export default apiSlice.reducer;
