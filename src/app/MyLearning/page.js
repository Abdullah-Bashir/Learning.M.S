"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

const MyLearningSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md p-4 animate-pulse">
        <div className="h-28 bg-gray-300 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-2/4"></div>
    </div>
);

const MyLearningCourseCard = ({ course }) => {
    const router = useRouter();

    return (
        <motion.div
            variants={cardVariants}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all p-3 cursor-pointer text-sm"
        >
            <img
                src={course.image.url}
                alt={course.title}
                className="rounded-lg h-32 w-full object-cover mb-2"
            />
            <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-1">
                {course.title}
            </h3>
            <p className="text-gray-600 text-sm mb-1 line-clamp-2">
                {course.description}
            </p>

            <div className="text-xs text-gray-500 flex justify-between mb-1">
                <span>{course.category}</span>
                <span className={`px-2 py-0.5 rounded-full 
                    ${course.difficulty === "Beginner" ? "bg-green-100 text-green-800"
                        : course.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"}`}>
                    {course.difficulty}
                </span>
            </div>

            <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    {course.creator?.avatar && (
                        <img
                            src={course.creator.avatar}
                            alt="creator"
                            className="h-5 w-5 rounded-full"
                        />
                    )}
                    <span>{course.creator?.username}</span>
                </div>
                <div>
                    ⭐ {course.rating || "N/A"} | 👥 {course.enrolledStudents?.length || 0}
                </div>
            </div>

            <button
                onClick={() => router.push(`/course/${course._id}`)}
                className="mt-1 w-full bg-blue-600 hover:bg-blue-700 text-white py-1 rounded text-xs font-medium"
            >
                Go to Course
            </button>
        </motion.div>
    );
};

const MyLearningPage = () => {
    const { user, isLoading } = useSelector((state) => state.auth);
    const enrolledCourses = user?.enrolledCourses || [];

    return (
        <section className="px-6 sm:px-10 py-12 mt-16">
            <div className="max-w-5xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6"
                >
                    Hello {user?.name || "User"}, here are your courses:
                </motion.h2>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {isLoading
                        ? [...Array(6)].map((_, i) => <MyLearningSkeleton key={i} />)
                        : enrolledCourses.map((course) => (
                            <MyLearningCourseCard key={course._id} course={course} />
                        ))}
                </motion.div>
            </div>
        </section>
    );
};

export default MyLearningPage;
