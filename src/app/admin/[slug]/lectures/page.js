'use client';

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { createLecture } from "@/app/redux/slices/lectureSlice"; // adjust the import path as needed
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LectureTable from "../../components/LectureTable";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function LecturesPage() {
    const { slug: courseId } = useParams();
    console.log("Course ID:", courseId);

    const router = useRouter();
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        isPreviewFree: false,
        video: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, video: file });
            toast.info(`Video file selected: ${file.name}`);
        } else {
            toast.warn("No file selected");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.video) {
            toast.error("Please fill in all required fields and select a video file!");
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(createLecture({ courseId, lectureData: formData })).unwrap();
            toast.success("Lecture created successfully!");
            // Reset form and close modal on success
            setFormData({
                title: "",
                description: "",
                isPreviewFree: false,
                video: null,
            });
            setIsModalOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Error creating lecture:", error);
            toast.error(error || "Failed to create lecture");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoBack = () => {
        router.push("/admin");
    };

    return (
        <div className="min-h-screen p-4 mt-24">
            <ToastContainer position="top-right" autoClose={3000} />
            {/* Header */}
            <div className="flex items-center justify-between mb-6 md:mx-20 mx-10">
                <h1 className="text-3xl font-extrabold">Lecture Management</h1>
                <div className="flex space-x-2">
                    <Button onClick={() => setIsModalOpen(true)}>Create Lecture</Button>
                    <Button onClick={handleGoBack}>GO back</Button>
                </div>
            </div>

            <LectureTable courseId={courseId} />

            {/* Modal for creating lecture */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-3">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-base font-semibold">New Lecture</h2>
                            <button
                                onClick={() => !isSubmitting && setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-lg"
                                disabled={isSubmitting}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-2">
                            <div className="space-y-2">
                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-medium mb-1">Title *</label>
                                    <input
                                        required
                                        placeholder="Enter title"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        className="w-full px-2 py-1 border rounded-md focus:ring-1 focus:ring-blue-500 text-xs disabled:opacity-50"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-medium mb-1">Description *</label>
                                    <textarea
                                        required
                                        placeholder="Lecture description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        className="w-full px-2 py-1 border rounded-md focus:ring-1 focus:ring-blue-500 h-16 text-xs disabled:opacity-50"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Free Preview Switch */}
                                <div className="flex items-center gap-1">
                                    <Switch
                                        id="free-preview"
                                        checked={formData.isPreviewFree}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, isPreviewFree: checked })
                                        }
                                        disabled={isSubmitting}
                                    />
                                    <Label htmlFor="free-preview" className="text-xs">
                                        Free Preview
                                    </Label>
                                </div>

                                {/* Video Upload */}
                                <div>
                                    <label className="block text-xs font-medium mb-1">Video File *</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="video/*"
                                        className="w-full text-xs file:text-xs file:py-1 file:px-2 file:border-0 file:bg-blue-50 file:text-blue-700 disabled:opacity-50"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {/* Form Buttons */}
                            <div className="mt-3 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 rounded-md disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-2 py-1 bg-blue-600 text-xs text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Creating...
                                        </span>
                                    ) : (
                                        "Create"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
