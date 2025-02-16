import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import authReducer from "./auth/authSlice";
import apiReducer from "./api/apiSlice";

// Configure logger with custom options
const logger = createLogger({
  collapsed: true, // Collapse logs by default
  duration: true, // Print the duration of each action
  timestamp: false, // Don't print timestamps
  colors: {
    title: () => "#F42619", // Red for action title
    prevState: () => "#666", // Gray for previous state
    action: () => "#000", // Black for action
    nextState: () => "#4CAF50", // Green for next state
    error: () => "#F20404", // Red for errors
  },
  // Only log specific actions (optional)
  predicate: (getState, action) => {
    // Log all actions except certain types
    return !action.type.includes("@@redux-form");
  },
});

const middleware = [logger];

export const store = configureStore({
  reducer: {
    auth: authReducer,
    api: apiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
