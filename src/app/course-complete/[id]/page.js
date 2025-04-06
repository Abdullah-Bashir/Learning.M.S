"use client";
import React, { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { getCourseByID } from "@/app/redux/slices/courseSlice";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiAward } from "react-icons/fi";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";

const CourseCompletePage = () => {
    const { id: courseId } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const { selectedCourse } = useSelector((state) => state.course);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (courseId && /^[0-9a-fA-F]{24}$/.test(courseId)) {
            dispatch(getCourseByID(courseId));
        }
    }, [courseId, dispatch]);

    // Reference to the certificate element
    const certificateRef = useRef(null);
    // Reference to the container of the certificate
    const containerRef = useRef(null);

    const handleDownloadCertificate = async () => {
        const input = certificateRef.current;
        const container = containerRef.current;
        if (!input || !container) return;

        try {
            // Temporarily make the certificate container fully opaque so it renders properly
            const originalOpacity = container.style.opacity;
            container.style.opacity = "1";

            // Wait a moment for the styles to apply
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Capture the certificate image
            const dataUrl = await domtoimage.toPng(input, { cacheBust: true });

            // Restore original opacity
            container.style.opacity = originalOpacity;

            // Create and download PDF
            const pdf = new jsPDF("landscape", "pt", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("certificate.pdf");
        } catch (error) {
            console.error("Failed to generate certificate:", error);
        }
    };

    if (!selectedCourse) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full"
            >
                <div className="text-5xl text-green-500 mb-4">
                    <FiAward />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Congratulations!
                </h1>
                <p className="text-gray-600 mb-6">
                    You have successfully completed{" "}
                    <span className="font-semibold">{selectedCourse.title}</span> 🎉
                </p>

                <Link href="/">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Back to Dashboard
                    </motion.button>
                </Link>

                <button
                    onClick={handleDownloadCertificate}
                    className="mt-3 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                    Download Certificate
                </button>
            </motion.div>

            {/* Certificate container: rendered but invisible */}
            <div
                ref={containerRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    opacity: 0, // invisible but rendered
                    pointerEvents: "none",
                }}
            >
                <div
                    ref={certificateRef}
                    id="certificate"
                    className="p-10 bg-white w-[800px] h-[600px] border-4 border-dashed border-gray-300 rounded-xl"
                >
                    <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            Certificate of Completion
                        </h2>
                        <p className="text-lg text-gray-600">This is to certify that</p>
                        <h1 className="text-2xl font-bold my-2 text-blue-700">
                            {user?.username || "User Name"}
                        </h1>
                        <p className="text-lg text-gray-600">has successfully completed</p>
                        <h2 className="text-xl font-semibold text-purple-600 my-2">
                            {selectedCourse?.title}
                        </h2>
                        <p className="text-sm text-gray-400 mt-4">
                            Issued on: {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCompletePage;
