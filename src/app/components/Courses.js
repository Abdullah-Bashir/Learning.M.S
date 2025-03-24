import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { getCourses } from "@/app/redux/slices/courseSlice";

// Animation variants
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
    <motion.div
        variants={cardVariants}
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg duration-300 m-4 hover:scale-105 hover:shadow-gray-500 transition-all cursor-pointer"
    >
        <div className="h-36 bg-gray-200 relative">
            <img
                src={course.image?.url || course.image || "https://via.placeholder.com/300"}
                alt={course.title}
                className="w-full h-full object-cover"
            />
        </div>

        <div className="p-4">
            <h3 className="text-lg font-semibold mt-2">{course.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>

            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <div className="flex items-center gap-2">
                    {course.creator?.avatar ? (
                        <img
                            src={course.creator.avatar.url}
                            alt={course.creator.username}
                            className="w-6 h-6 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200" />
                    )}
                    <span>{course.creator?.username || "Instructor"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${course.difficulty === "Beginner"
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

            <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">${course.price}</span>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition">
                    Enroll Now
                </button>
            </div>
        </div>
    </motion.div>
);

// Skeleton Loader Component
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

const Courses = () => {
    const dispatch = useDispatch();
    const { courses, isLoading } = useSelector((state) => state.course);

    useEffect(() => {
        dispatch(getCourses());
    }, [dispatch]);

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
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
                        : courses.map((course) => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Courses;
