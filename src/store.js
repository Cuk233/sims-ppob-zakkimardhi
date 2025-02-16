import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import authReducer from "./features/auth/authSlice";
import apiReducer from "./features/api/apiSlice";

const logger = createLogger({
  collapsed: true,
  timestamp: false,
  diff: true,
  colors: {
    title: () => "#F42619",
    prevState: () => "#9E9E9E",
    action: () => "#03A9F4",
    nextState: () => "#4CAF50",
    error: () => "#F20404",
  },
});

const store = configureStore({
  reducer: {
    auth: authReducer,
    api: apiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
