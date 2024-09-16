import userReducer from "./slices/UserSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    user: userReducer, // Add your slices here
  },
});

// Optional: Define types for use with TypeScript
