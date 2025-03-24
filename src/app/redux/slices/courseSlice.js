import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL for courses (adjust if needed)
const API_URL = "http://localhost:5000/api/course";

// 1️⃣ Create Course
export const createCourse = createAsyncThunk(
    "course/create",
    async (courseData, { rejectWithValue }) => {
        try {
            // Prepare form data for file uploads if any
            const formData = new FormData();
            for (const key in courseData) {
                formData.append(key, courseData[key]);
            }
            const response = await axios.post(`${API_URL}/create`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data.course;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Course creation failed"
            );
        }
    }
);

// 2️⃣ Get All Courses
export const getCourses = createAsyncThunk(
    "course/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL, { withCredentials: true });
            return response.data.courses;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch courses"
            );
        }
    }
);

// 3️⃣ Update Course
export const updateCourse = createAsyncThunk(
    "course/update",
    async ({ id, courseData }, { rejectWithValue }) => {
        try {
            // Prepare form data in case an image or file is updated
            const formData = new FormData();
            for (const key in courseData) {
                formData.append(key, courseData[key]);
            }
            const response = await axios.put(`${API_URL}/${id}`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data.course;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update course"
            );
        }
    }
);

// Course slice definition
const courseSlice = createSlice({
    name: "course",
    initialState: {
        courses: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        // Add any synchronous reducers if needed.
    },
    extraReducers: (builder) => {
        // Create Course
        builder
            .addCase(createCourse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                // Prepend new course to the list (if you want newest first)
                state.courses.unshift(action.payload);
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Get Courses
        builder
            .addCase(getCourses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses = action.payload;
            })
            .addCase(getCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Update Course
        builder
            .addCase(updateCourse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                // Update the course in the state array
                const index = state.courses.findIndex(
                    (course) => course._id === action.payload._id
                );
                if (index !== -1) {
                    state.courses[index] = action.payload;
                }
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default courseSlice.reducer;
