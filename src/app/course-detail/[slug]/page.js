"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getCourseByID } from "@/app/redux/slices/courseSlice";
import { motion } from "framer-motion";
import { FiUser, FiCalendar, FiBookOpen, FiPlay, FiLock } from "react-icons/fi";
import PurchaseCourse from "./components/PurchaseCourse";
import ReactPlayer from "react-player";

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

const customGradient = "bg-gradient-to-br from-[#8B0000] via-[#450a0a] to-black";

function CourseDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { selectedCourse, isLoading, error } = useSelector((state) => state.course);

    useEffect(() => {
        if (slug && /^[0-9a-fA-F]{24}$/.test(slug)) {
            dispatch(getCourseByID(slug));
        } else {
            router.push("/");
        }
    }, [slug, dispatch, router]);


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
                <button
                    onClick={() => router.push("/")}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Return Home
                </button>
            </div>
        );
    }

    if (!selectedCourse) {
        return (
            <div className="text-center py-8">
                <p>Course not found.</p>
                <button
                    onClick={() => router.push("/")}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Browse Courses
                </button>
            </div>
        );
    }

    const firstLectureVideoUrl = selectedCourse.lectures?.[0]?.video?.url;
    const isPurchased = selectedCourse.hasPurchased;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gray-50 mt-16"
        >
            {/* Gradient Header */}
            <div className={`h-[40vh] md:h-[45vh] lg:h-[50vh] ${customGradient} relative text-white`}>
                <div className="max-w-5xl mx-auto px-4 pt-16 md:pt-20 lg:pt-24 pb-12 relative h-full">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8 h-full">
                        {/* Course Image */}
                        <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-sm">
                            <img
                                src={selectedCourse.image?.url || "/placeholder.jpg"}
                                alt={selectedCourse.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>

                        {/* Course Info */}
                        <div className="flex-1 space-y-2 md:space-y-3 lg:space-y-4">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-md">
                                {selectedCourse.title}
                            </h1>

                            <div className="flex items-center gap-3 text-sm md:text-[15px] lg:text-base text-white/90">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={selectedCourse.creator?.avatar?.url || "/default-avatar.png"}
                                        alt={selectedCourse.creator?.username}
                                        className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full border border-white/20"
                                        loading="lazy"
                                    />
                                    <span>Created by {selectedCourse.creator?.username}</span>
                                </div>
                                {isPurchased && (
                                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                                        Enrolled
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3 md:gap-4 text-sm md:text-[15px] lg:text-base">
                                <div className="flex items-center gap-1 bg-white/10 px-3 py-1 md:px-4 md:py-2 rounded-full">
                                    <FiBookOpen className="text-red-300 text-sm md:text-base" />
                                    <span>{selectedCourse.difficulty} Level</span>
                                </div>
                                <div className="flex items-center gap-1 bg-white/10 px-3 py-1 md:px-4 md:py-2 rounded-full">
                                    <FiUser className="text-red-300 text-sm md:text-base" />
                                    <span>{selectedCourse.enrolledStudents?.length || 0} Enrolled</span>
                                </div>
                                <div className="flex items-center gap-1 bg-white/10 px-3 py-1 md:px-4 md:py-2 rounded-full">
                                    <FiCalendar className="text-red-300 text-sm md:text-base" />
                                    <span className="whitespace-nowrap">
                                        {new Date(selectedCourse.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 -mt-24 md:-mt-28 lg:-mt-32 p-4">
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 mb-12">
                    {/* Left Section */}
                    <div className="w-full lg:w-7/12 mt-28 md:mt-32 lg:mt-36">
                        <motion.div variants={itemVariants}>
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">Course Description</h2>
                            <p className="text-gray-700 leading-relaxed text-sm md:text-[15px] lg:text-base">
                                {selectedCourse.description}
                            </p>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-white p-3 md:p-5 lg:p-6 rounded-xl shadow-md mt-4 md:mt-6 lg:mt-14 shadow-red-500"
                        >
                            <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4">Course Content</h2>
                            <div className="space-y-2 md:space-y-3 lg:space-y-4">
                                {selectedCourse.lectures?.map((lecture, index) => (
                                    <div
                                        key={lecture._id}
                                        className={`flex items-center justify-between p-2 md:p-3 lg:p-4 rounded-xl transition-all ${isPurchased
                                            ? "bg-red-50 hover:bg-red-100 cursor-pointer"
                                            : "bg-gray-100 opacity-75"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
                                            <div className={`p-1 md:p-2 rounded-lg ${isPurchased
                                                ? "bg-red-600 text-white"
                                                : "bg-gray-300"
                                                }`}>
                                                {isPurchased ? (
                                                    <FiPlay className="text-xs md:text-sm lg:text-base" />
                                                ) : (
                                                    <FiLock className="text-xs md:text-sm lg:text-base" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-xs md:text-sm lg:text-base">
                                                    Lecture {index + 1}
                                                </h3>
                                                <p className="text-gray-600 text-[10px] md:text-xs lg:text-sm">
                                                    {lecture.title}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] md:text-xs lg:text-sm text-gray-500 ml-2">
                                            {isPurchased ? "20 min" : "Locked"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Section */}
                    <div className="w-full lg:w-5/12 mt-8 md:mt-10 lg:mt-0 lg:ml-32">
                        <motion.div variants={itemVariants} className="space-y-4 md:space-y-6 lg:space-y-8">
                            <div className="relative h-40 md:h-48 lg:aspect-video lg:h-auto rounded-md overflow-hidden shadow-xl md:shadow-2xl">
                                {firstLectureVideoUrl ? (
                                    <ReactPlayer
                                        url={firstLectureVideoUrl}
                                        width="100%"
                                        height="100%"
                                        controls
                                        light={selectedCourse.image?.url || "/placeholder.jpg"}
                                    />
                                ) : (
                                    <img
                                        src={selectedCourse.image?.url || "/placeholder.jpg"}
                                        alt="Course preview"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                )}
                            </div>

                            <div className="bg-white p-4 md:p-5 lg:p-6 rounded-xl shadow-2xl">
                                <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-base md:text-lg lg:text-xl">Price:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl md:text-2xl lg:text-3xl font-bold text-red-600">
                                                ${selectedCourse.price}
                                            </span>
                                            <span className="text-gray-400 line-through text-sm md:text-base lg:text-lg">
                                                $199
                                            </span>
                                        </div>
                                    </div>

                                    {isPurchased ? (
                                        <button
                                            onClick={() => router.push(`/MyLearning`)}
                                            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            Go to Course
                                        </button>
                                    ) : (
                                        <PurchaseCourse
                                            courseId={selectedCourse._id}
                                            coursePrice={selectedCourse.price}
                                        />
                                    )}

                                    {isPurchased && (
                                        <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center">
                                            You're enrolled in this course
                                        </div>
                                    )}

                                    <div className="text-center text-xs md:text-sm lg:text-base text-gray-500 mt-2">
                                        <FiLock className="inline mr-1 sm:mr-2" />
                                        30-Day Money-Back Guarantee
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 md:p-5 lg:p-6 rounded-xl shadow-2xl">
                                <div className="space-y-3 md:space-y-4 lg:space-y-4">
                                    <div className="flex justify-between items-center pb-2 border-b">
                                        <span className="text-gray-600 text-sm md:text-base lg:text-base">Lectures:</span>
                                        <span className="font-medium text-sm md:text-base lg:text-base">
                                            {selectedCourse.lectures?.length || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm md:text-base lg:text-base">Category:</span>
                                        <span className="font-medium text-sm md:text-base lg:text-base">
                                            {selectedCourse.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default CourseDetailPage;