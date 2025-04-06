import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import courseReducer from "./slices/courseSlice"
import lectureReducer from "./slices/lectureSlice"
import progressReducer from "./slices/progressSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        course: courseReducer,
        lecture: lectureReducer,
        progress: progressReducer

    },
    devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development
});

export default store;
