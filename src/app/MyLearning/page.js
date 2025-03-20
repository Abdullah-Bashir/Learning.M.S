"use client"
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Dummy API call simulation
const fetchMyCourses = () =>
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
                    image: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fxwze4a3eok76f6tfe8bw.png",
                },
                {
                    id: 2,
                    title: "Advanced JavaScript Concepts",
                    description:
                        "Master advanced JavaScript concepts like closures, promises, and async/await.",
                    instructor: "Jane Smith",
                    difficulty: "Intermediate",
                    image: "https://miro.medium.com/v2/resize:fit:1400/1*LyZcwuLWv2FArOumCxobpA.png",
                },
                // Add more courses here...
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

// Progress Bar Component
const ProgressBar = ({ progress }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
        <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
        ></div>
    </div>
);

// My Learning Course Card
const MyLearningCourseCard = ({ course }) => (
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

        </div>
    </motion.div>
);

// Skeleton Loader Component
const MyLearningSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="h-36 bg-gray-200"></div>
        <div className="p-4">
            <div className="h-3 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-300 rounded w-5/6 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>

            <div className="mt-4">
                <div className="h-2 bg-gray-300 rounded-full"></div>
                <div className="h-3 bg-gray-300 rounded w-1/4 mt-2"></div>
            </div>
        </div>
    </div>
);


const MyLearningPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [myCourses, setMyCourses] = useState([]);

    useEffect(() => {
        fetchMyCourses().then((data) => {
            setMyCourses(data);
            setIsLoading(false);
        });
    }, []);

    return (
        <section className="py-11 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-6xl mx-auto px-24">
                <h2 className="text-4xl font-extrabold ml-4 mb-8">MY LEARNING</h2>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {isLoading
                        ? [...Array(6)].map((_, index) => <MyLearningSkeleton key={index} />)
                        : myCourses.map((course) => (
                            <MyLearningCourseCard key={course.id} course={course} />
                        ))}
                </motion.div>
            </div>
        </section>
    );
};

export default MyLearningPage;