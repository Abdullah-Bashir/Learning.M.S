import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL for lecture endpoints
const API_URL = "http://localhost:5000/api/lecture";

// Create Lecture
export const createLecture = createAsyncThunk(
    "lecture/create",
    async ({ courseId, lectureData }, { rejectWithValue }) => {
        try {
            // Use FormData to support file upload (video file)
            const formData = new FormData();
            for (const key in lectureData) {
                formData.append(key, lectureData[key]);
            }
            // POST request without manually setting Content-Type
            const response = await axios.post(`${API_URL}/${courseId}`, formData, {
                withCredentials: true,
            });
            return response.data.lecture;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Lecture creation failed"
            );
        }
    }
);

// Update Lecture (with optional new video file)
export const updateLecture = createAsyncThunk(
    "lecture/update",
    async ({ lectureId, lectureData }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in lectureData) {
                formData.append(key, lectureData[key]);
            }
            // PUT request to /api/lecture/:lectureId
            const response = await axios.put(`${API_URL}/${lectureId}`, formData, {
                withCredentials: true,
            });
            return response.data.lecture;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Lecture update failed"
            );
        }
    }
);

// Get Lectures By Course
export const getLecturesByCourse = createAsyncThunk(
    "lecture/getByCourse",
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/course/${courseId}`, {
                withCredentials: true,
            });
            return response.data; // expects an array of lectures
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch lectures"
            );
        }
    }
);

// Remove Lecture
export const removeLecture = createAsyncThunk(
    "lecture/remove",
    async (lectureId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${lectureId}`, { withCredentials: true });
            // Return the deleted lectureId so we can update the store
            return lectureId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Lecture removal failed"
            );
        }
    }
);

// Lecture slice definition
const lectureSlice = createSlice({
    name: "lecture",
    initialState: {
        lectures: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        // Add any synchronous reducers if needed.
    },
    extraReducers: (builder) => {

        // Create Lecture
        builder
            .addCase(createLecture.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createLecture.fulfilled, (state, action) => {
                state.isLoading = false;
                // Prepend the new lecture (if you want newest first)
                state.lectures.unshift(action.payload);
            })
            .addCase(createLecture.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Update Lecture
        builder
            .addCase(updateLecture.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateLecture.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.lectures.findIndex(
                    (lecture) => lecture._id === action.payload._id
                );
                if (index !== -1) {
                    state.lectures[index] = action.payload;
                }
            })
            .addCase(updateLecture.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Get Lectures By Course
        builder
            .addCase(getLecturesByCourse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getLecturesByCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lectures = action.payload;
            })
            .addCase(getLecturesByCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Remove Lecture
        builder
            .addCase(removeLecture.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeLecture.fulfilled, (state, action) => {
                state.isLoading = false;
                // Filter out the deleted lecture by id
                state.lectures = state.lectures.filter(
                    (lecture) => lecture._id !== action.payload
                );
            })
            .addCase(removeLecture.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default lectureSlice.reducer;
