import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/course";

// 1️⃣ Create Course
export const createCourse = createAsyncThunk(
    "course/create",
    async (courseData, { rejectWithValue }) => {
        try {
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
    async ({ page = 1, limit = 3, searchTerm = "" }, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL, {
                params: { page, limit, searchTerm },
                withCredentials: true,
            });
            return response.data; // Ensure your backend returns an object with { courses, pagination }
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

// 4️⃣ Get Creator's Courses
export const getCreatorCourses = createAsyncThunk(
    "course/getCreator",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/creator`, {
                withCredentials: true,
            });
            return response.data.courses;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch creator courses"
            );
        }
    }
);

// 5️⃣ Get Course By ID
export const getCourseByID = createAsyncThunk(
    "course/getById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, {
                withCredentials: true,
            });
            return response.data.course;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch course"
            );
        }
    }
);

// 6️⃣ Get Enrollment Stats
export const getEnrollmentStats = createAsyncThunk(
    "course/getEnrollmentStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/stats/enrollments`, {
                withCredentials: true,
            });
            return response.data.stats;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch enrollment stats"
            );
        }
    }
);



const courseSlice = createSlice({
    name: "course",

    initialState: {
        courses: [],
        selectedCourse: null,
        enrollmentStats: {
            totalStudents: 0,
            totalRevenue: 0,
            monthlyEnrollments: {
                labels: [],
                data: [],
            },
        },
        isLoading: false,
        error: null,
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalCourses: 0,
        },
    },

    reducers: {},
    extraReducers: (builder) => {


        // Create Course
        builder
            .addCase(createCourse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses.unshift(action.payload);
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });


        // Get All Courses
        builder
            .addCase(getCourses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses = action.payload.courses;
                state.pagination = {
                    currentPage: action.payload.pagination.currentPage,
                    totalPages: action.payload.pagination.totalPages,
                    totalCourses: action.payload.pagination.totalCourses,
                };
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


        // Get Creator's Courses
        builder
            .addCase(getCreatorCourses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCreatorCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses = action.payload;
            })
            .addCase(getCreatorCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });


        // Get Course By ID
        builder
            .addCase(getCourseByID.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.selectedCourse = null;
            })
            .addCase(getCourseByID.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedCourse = action.payload;
            })
            .addCase(getCourseByID.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.selectedCourse = null;
            });


        // Get Enrollment Stats
        builder
            .addCase(getEnrollmentStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getEnrollmentStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.enrollmentStats = action.payload;
            })
            .addCase(getEnrollmentStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default courseSlice.reducer;