import axios from "axios";
import { message } from "antd";
import { store } from "../features/store";
import {
  startRequest,
  finishRequest,
  setRequestProgress,
  setRequestError,
  clearRequest,
} from "../features/api/apiSlice";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
    "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
    "Client-Id": import.meta.env.VITE_CLIENT_ID,
    "sec-ch-ua":
      '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
  },
  mode: "cors",
  credentials: "omit",
  referrerPolicy: "strict-origin-when-cross-origin",
});

// Add request interceptor for auth token and request tracking
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Generate requestId and track progress if showSpinner is true
    if (config.showSpinner) {
      const requestId = Math.random().toString(36).substring(7);
      config.requestId = requestId;
      store.dispatch(startRequest({ requestId }));

      // Add upload progress tracking
      if (config.onUploadProgress) {
        const originalUploadProgress = config.onUploadProgress;
        config.onUploadProgress = (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          store.dispatch(setRequestProgress({ requestId, progress }));
          originalUploadProgress(progressEvent);
        };
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and response transformation
api.interceptors.response.use(
  (response) => {
    // Clear progress tracking
    if (response.config.requestId) {
      store.dispatch(finishRequest({ requestId: response.config.requestId }));
      store.dispatch(clearRequest({ requestId: response.config.requestId }));
    }

    // Check if response has data and status
    if (response.data) {
      // Format the response to match API structure
      return {
        data: response.data.data,
        status: response.data.status,
        message: response.data.message,
      };
    }

    return response.data;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      const { status, data } = error.response;
      const requestId = error.config.requestId;

      // Handle token expiration
      if (status === 401 && !error.config.url.includes("login")) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject({
          status: 401,
          message: "Sesi anda telah berakhir",
          data: null,
        });
      }

      // Update store with error
      if (requestId) {
        store.dispatch(setRequestError({ requestId, error: data }));
        store.dispatch(clearRequest({ requestId }));
      }

      // Show error message if showError is true
      if (error.config.showError !== false) {
        message.error(data.message || "Terjadi kesalahan");
      }

      return Promise.reject({
        status: status,
        message: data.message || "Terjadi kesalahan",
        data: null,
      });
    } else if (error.request) {
      // Network error
      const errorMessage = "Tidak dapat terhubung ke server";
      const requestId = error.config.requestId;

      if (requestId) {
        store.dispatch(
          setRequestError({ requestId, error: { message: errorMessage } })
        );
        store.dispatch(clearRequest({ requestId }));
      }

      if (error.config.showError !== false) {
        message.error(errorMessage);
      }
      return Promise.reject({
        status: 503,
        message: errorMessage,
        data: null,
      });
    }

    // Other errors
    const errorMessage = "Terjadi kesalahan";
    const requestId = error.config.requestId;

    if (requestId) {
      store.dispatch(
        setRequestError({ requestId, error: { message: errorMessage } })
      );
      store.dispatch(clearRequest({ requestId }));
    }

    if (error.config.showError !== false) {
      message.error(errorMessage);
    }
    return Promise.reject({
      status: 500,
      message: errorMessage,
      data: null,
    });
  }
);

// Helper methods for different request types
export const apiGet = (url, config = {}) => {
  return api.get(url, { showSpinner: true, showError: true, ...config });
};

export const apiPost = (url, data, config = {}) => {
  return api.post(url, data, {
    showSpinner: true,
    showError: true,
    ...config,
    headers: {
      ...config.headers,
      Priority: "u=1, i",
    },
  });
};

export const apiPut = (url, data, config = {}) => {
  return api.put(url, data, { showSpinner: true, showError: true, ...config });
};

export const apiDelete = (url, config = {}) => {
  return api.delete(url, { showSpinner: true, showError: true, ...config });
};

export default api;
