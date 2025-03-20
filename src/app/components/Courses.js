import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Dummy API call simulation
const fetchCourses = () =>
    new Promise((resolve) =>
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    title: "Web Development Bootcamp",
                    description:
                        "Complete guide to modern web development with HTML, CSS, JavaScript and React.",
                    instructor: "John Doe",
                    difficulty: "Beginner",
                    price: "$199.99",
                    image: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fxwze4a3eok76f6tfe8bw.png",
                },
            ]);
        }, 2000)
    );

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
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
            />
        </div>

        <div className="p-4">


            <h3 className="text-lg font-semibold mt-2">{course.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>

            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200" />
                    <span>{course.instructor}</span>
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
                <span className="text-lg font-bold text-blue-600">{course.price}</span>
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
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchCourses().then((data) => {
            setCourses(data);
            setIsLoading(false);
        });
    }, []);

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-extrabold text-center mb-10">Popular Courses</h2>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {isLoading
                        ? [...Array(6)].map((_, index) => <CourseSkeleton key={index} />)
                        : courses.map((course) => <CourseCard key={course.id} course={course} />)}
                </motion.div>
            </div>
        </section>
    );
};

export default Courses;
