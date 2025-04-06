"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getCourseByID } from "@/app/redux/slices/courseSlice";
import {
    getCourseProgress,
    markLectureCompleted,
    resetCompletionFlag,
} from "@/app/redux/slices/progressSlice";
import ReactPlayer from "react-player";
import { FiPlay, FiCheck, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const containerVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.2, staggerChildren: 0.05 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 3 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.15 },
    },
};

function CourseContentPage() {
    const { id: courseId } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const [currentVideo, setCurrentVideo] = useState(null);
    const [playerKey, setPlayerKey] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [toastShown, setToastShown] = useState(false);
    const playerRef = useRef(null);

    const { user, isLoading: authLoading } = useSelector((state) => state.auth);
    const { selectedCourse, isLoading: courseLoading } = useSelector(
        (state) => state.course
    );
    const { courseProgress, courseComplete } = useSelector(
        (state) => state.progress
    );

    const isEnrolled = user?.enrolledCourses?.some(
        (course) => course._id === courseId
    );

    const handleLectureSelect = useCallback((lecture) => {
        if (playerRef.current) {
            playerRef.current.getInternalPlayer()?.pause?.();
        }

        setIsPlaying(false);
        setPlayerKey((prev) => prev + 1);
        setCurrentVideo(lecture.video?.url);

        setTimeout(() => {
            setIsPlaying(true);
        }, 100);
    }, []);

    const handleMarkCompleted = useCallback(
        async (lectureId) => {
            try {
                await dispatch(markLectureCompleted(lectureId)).unwrap();
                toast.info("Lecture marked as completed!", {
                    autoClose: 2000,
                    position: "bottom-right",
                });
            } catch (error) {
                toast.error("Failed to mark lecture as completed");
                console.error("Completion error:", error);
            }
        },
        [dispatch]
    );

    useEffect(() => {
        if (courseId && /^[0-9a-fA-F]{24}$/.test(courseId)) {
            dispatch(getCourseByID(courseId));
            dispatch(getCourseProgress(courseId));
        }
    }, [courseId, dispatch]);

    useEffect(() => {
        if (!authLoading && !courseLoading && !isEnrolled) {
            router.push(`/course-detail/${courseId}`);
        }
    }, [authLoading, courseLoading, isEnrolled, courseId, router]);

    useEffect(() => {
        if (courseComplete && !toastShown) {
            toast.success(
                "🎉 Course Completed! Click the button below to get your certificate",
                {
                    autoClose: 5000,
                    position: "top-center",
                }
            );
            setToastShown(true);
            dispatch(resetCompletionFlag());
        }
    }, [courseComplete, dispatch, toastShown]);

    if (authLoading || courseLoading || !selectedCourse) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen mt-16"
        >
            <ToastContainer />
            <div className="max-w-5xl mx-auto px-3 py-4">
                <h1 className="text-xl font-bold mb-4 text-gray-800">
                    {selectedCourse?.title || "Course Content"}
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 relative">
                        <div className="bg-black rounded-md overflow-hidden aspect-video shadow-md">
                            <ReactPlayer
                                key={playerKey}
                                ref={playerRef}
                                url={currentVideo}
                                width="100%"
                                height="100%"
                                controls
                                playing={isPlaying}
                                onReady={() => setIsPlaying(true)}
                                onPlay={() => {
                                    const lecture = selectedCourse?.lectures?.find(
                                        (l) => l.video?.url === currentVideo
                                    );
                                    if (lecture?._id) handleMarkCompleted(lecture._id);
                                }}
                                onPause={() => setIsPlaying(false)}
                                onError={() => setIsPlaying(false)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-base font-semibold mb-2 text-gray-700">
                            Content
                        </h2>

                        {selectedCourse?.lectures?.map((lecture) => {
                            const isCompleted = courseProgress?.lectureProgress?.some(
                                (lp) => lp.lecture?._id === lecture._id && lp.completed
                            );

                            return (
                                <motion.div
                                    key={lecture._id}
                                    variants={itemVariants}
                                    className={`p-2 rounded-sm cursor-pointer transition-all ${currentVideo === lecture.video?.url
                                            ? "bg-blue-50 border-blue-300"
                                            : "bg-white hover:bg-gray-50"
                                        } border-l-[3px] ${isCompleted ? "border-green-300" : "border-gray-200"
                                        } shadow-xs`}
                                    onClick={() => handleLectureSelect(lecture)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <div
                                                className={`w-5 h-5 rounded-full flex items-center justify-center ${isCompleted
                                                        ? "bg-green-50 text-green-400"
                                                        : "bg-blue-50 text-blue-400"
                                                    }`}
                                            >
                                                {isCompleted ? (
                                                    <FiCheck className="w-3.5 h-3.5" />
                                                ) : (
                                                    <FiPlay className="w-3.5 h-3.5" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xs font-medium text-gray-800">
                                                    {lecture.title}
                                                </h3>
                                                {lecture.description && (
                                                    <p className="text-[0.7rem] text-gray-400 mt-0.5">
                                                        {lecture.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {isCompleted && (
                                            <span className="text-[0.65rem] text-green-400 whitespace-nowrap">
                                                ✓
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {courseProgress?.complete && (
                    <div className="mt-4 text-center">
                        <Link href={`/course-complete/${courseId}`}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-green-400 text-white px-3 py-1.5 rounded-sm font-medium hover:bg-green-500 transition-colors flex items-center gap-1 mx-auto text-xs"
                            >
                                Get Certificate
                                <FiArrowRight className="w-3 h-3" />
                            </motion.button>
                        </Link>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default CourseContentPage;
