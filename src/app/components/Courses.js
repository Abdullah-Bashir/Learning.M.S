"use client"
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { getCourses } from "@/app/redux/slices/courseSlice";
import Link from "next/link";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

const CourseCard = ({ course }) => (
    <Link href={`/course-detail/${course._id}`}>
        <motion.div
            variants={cardVariants}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer m-2 hover:scale-105"
        >
            <div className="h-24 bg-gray-200 relative">
                <img
                    src={course.image?.url || course.image || "https://via.placeholder.com/300"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-2">
                <h3 className="text-base font-semibold mt-1">{course.title}</h3>
                <p className="text-gray-600 text-xs line-clamp-2">{course.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <div className="flex items-center gap-1">
                        {course.creator?.avatar ? (
                            <img
                                src={course.creator.avatar.url}
                                alt={course.creator.username}
                                className="w-5 h-5 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-200" />
                        )}
                        <span>{course.creator?.username || "Instructor"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span
                            className={`px-1 py-0.5 font-semibold rounded-full ${course.difficulty === "Beginner"
                                ? "bg-green-100 text-green-800"
                                : course.difficulty === "Intermediate"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                        >
                            {course.difficulty}
                        </span>
                    </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <span className="text-base font-bold text-blue-600">${course.price}</span>
                    <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition">
                        Enroll Now
                    </button>
                </div>
            </div>
        </motion.div>
    </Link>
);

const CourseSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="h-36 bg-gray-200"></div>
        <div className="p-4">
            <div className="h-3 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-300 rounded w-5/6 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            <div className="flex items-center justify-between mt-4">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
                <div className="h-6 bg-gray-300 rounded w-20"></div>
            </div>
        </div>
    </div>
);

const Courses = ({ searchTerm }) => {
    const dispatch = useDispatch();
    const { courses, isLoading, pagination } = useSelector((state) => state.course);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getCourses({ page: currentPage, limit: 3, searchTerm }));
    }, [dispatch, currentPage, searchTerm]);

    const publishedCourses = courses
        .filter(course => course.isPublished)
        .filter(course => {
            const term = searchTerm.toLowerCase();
            return (
                course.title.toLowerCase().includes(term) ||
                course.description.toLowerCase().includes(term) ||
                course.difficulty.toLowerCase().includes(term)
            );
        });

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <section className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-20">

                <h2 className="text-4xl font-extrabold text-center mb-10">
                    Popular Courses
                </h2>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6"
                >
                    {isLoading
                        ? [...Array(6)].map((_, index) => <CourseSkeleton key={index} />)
                        : publishedCourses.map((course) => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                </motion.div>

                {!isLoading && publishedCourses.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No courses found matching your search criteria.
                        </p>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md mr-2"
                    >
                        Prev
                    </button>
                    <span className="self-center text-lg">
                        Page {currentPage} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md ml-2"
                    >
                        Next
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Courses;
