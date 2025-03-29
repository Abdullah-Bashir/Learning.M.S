"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getCourseByID } from "@/app/redux/slices/courseSlice";
import { motion } from "framer-motion";
import { FiUser, FiCalendar, FiStar } from "react-icons/fi";

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function CourseDetailPage() {
    // Extract the course ID (or slug) from URL parameters.
    const { slug } = useParams();
    console.log("Course Slug:", slug);
    const dispatch = useDispatch();

    // Get selected course and loading/error state from Redux.
    const { selectedCourse, isLoading, error } = useSelector((state) => state.course);

    // Fetch course details when the component mounts or slug changes.
    useEffect(() => {
        if (slug) {
            dispatch(getCourseByID(slug));
        }
    }, [slug, dispatch]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 py-8">
                <p>Error: {error}</p>
            </div>
        );
    }

    if (!selectedCourse) {
        return (
            <div className="text-center py-8">
                <p>Course not found.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gray-50 py-10 mt-20"
        >
            <div className="max-w-5xl mx-auto px-4">
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-8">
                    {/* Course Image */}
                    <div className="md:w-1/2">
                        <motion.img
                            variants={itemVariants}
                            src={selectedCourse.image?.url || "/placeholder.jpg"}
                            alt={selectedCourse.title}
                            className="w-full rounded-md shadow-lg object-cover"
                            style={{ maxHeight: "350px", objectFit: "cover" }}
                        />
                    </div>

                    {/* Course Details */}
                    <div className="md:w-1/2">
                        <motion.h1 variants={itemVariants} className="text-4xl font-bold text-gray-800 mb-4">
                            {selectedCourse.title}
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-gray-700 mb-6">
                            {selectedCourse.description}
                        </motion.p>

                        {/* Course Information */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-600">Price:</span>
                                <span className="text-xl text-blue-600 font-bold">${selectedCourse.price}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-600">Difficulty:</span>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {selectedCourse.difficulty}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-600">Category:</span>
                                <span className="text-gray-800">{selectedCourse.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-600">Rating:</span>
                                <span className="flex items-center gap-1 text-yellow-600">
                                    <FiStar />
                                    {selectedCourse.rating.toFixed(1)}
                                </span>
                            </div>
                        </motion.div>

                        {/* Instructor & Creation Info */}
                        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
                            {selectedCourse.creator?.avatar ? (
                                <img
                                    src={selectedCourse.creator.avatar.url}
                                    alt={selectedCourse.creator.username}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200" />
                            )}
                            <div>
                                <p className="text-lg font-medium text-gray-800">
                                    {selectedCourse.creator?.username || "Instructor"}
                                </p>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <FiCalendar />
                                    <span>{new Date(selectedCourse.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Enroll Button */}
                        <motion.button
                            variants={itemVariants}
                            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                        >
                            Enroll Now
                        </motion.button>
                    </div>
                </motion.div>

                {/* Additional Course Info */}
                <motion.div variants={itemVariants} className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="p-4 bg-white rounded-lg shadow">
                            <h3 className="font-semibold text-gray-700 mb-2">Enrolled Students</h3>
                            <p className="text-xl text-blue-600">{selectedCourse.enrolledStudents?.length || 0}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow">
                            <h3 className="font-semibold text-gray-700 mb-2">Lectures</h3>
                            <p className="text-xl text-blue-600">{selectedCourse.lectures?.length || 0}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default CourseDetailPage;
