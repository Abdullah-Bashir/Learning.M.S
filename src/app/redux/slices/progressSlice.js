import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/progress";

export const getCourseProgress = createAsyncThunk(
    "progress/getCourseProgress",
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${courseId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch progress");
        }
    }
);

export const markLectureCompleted = createAsyncThunk(
    "progress/markLectureCompleted",
    async (lectureId, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/${lectureId}/complete`,
                {},
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to mark completed");
        }
    }
);

const progressSlice = createSlice({

    name: "progress",
    initialState: {
        courseProgress: null,
        isLoading: false,
        error: null,
        courseComplete: false,
    },

    reducers: {
        resetCompletionFlag: (state) => {
            state.courseComplete = false;
        },
    },

    extraReducers: (builder) => {

        builder
            .addCase(getCourseProgress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCourseProgress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courseProgress = action.payload;
                state.courseComplete = action.payload.complete || false;
            })
            .addCase(getCourseProgress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })


            .addCase(markLectureCompleted.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(markLectureCompleted.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courseProgress = action.payload;
                state.courseComplete = action.payload.courseComplete;
            })
            .addCase(markLectureCompleted.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

    },
});

export const { resetCompletionFlag } = progressSlice.actions;
export default progressSlice.reducer;