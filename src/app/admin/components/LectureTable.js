'use client';

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLecturesByCourse, updateLecture } from "@/app/redux/slices/lectureSlice";
import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";

function LectureTable({ courseId }) {
    const dispatch = useDispatch();
    const { lectures, isLoading, error } = useSelector((state) => state.lecture);

    // Local state for edit modal
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        isPreviewFree: false,
        video: null,
    });

    // Fetch lectures when courseId changes
    useEffect(() => {
        if (courseId) {
            dispatch(getLecturesByCourse(courseId));
        }
    }, [courseId, dispatch]);

    // When edit is clicked, prefill the form and open the modal
    const handleEditClick = (lecture) => {
        setSelectedLecture(lecture);
        setFormData({
            title: lecture.title,
            description: lecture.description,
            isPreviewFree: lecture.isPreviewFree,
            video: null, // No new file selected by default
        });
        setEditModalOpen(true);
    };

    // Handle file selection for updating video
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, video: file });
            toast.info(`New video selected: ${file.name}`);
        }
    };

    // Handle update submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedLecture) return;

        if (!formData.title || !formData.description) {
            toast.error("Title and Description are required!");
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(
                updateLecture({ lectureId: selectedLecture._id, lectureData: formData })
            ).unwrap();
            toast.success("Lecture updated successfully!");
            setEditModalOpen(false);
        } catch (error) {
            console.error("Error updating lecture:", error);
            toast.error(error || "Failed to update lecture");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="px-4 py-2 md:mx-20 mx-4">
            {isLoading ? (
                <div className="text-center py-4 text-gray-600">Loading lectures...</div>
            ) : error ? (
                <div className="text-center py-4 text-red-600">Error: {error}</div>
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Free Preview
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {lectures && lectures.length > 0 ? (
                                lectures.map((lecture) => (
                                    <tr key={lecture._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                                            {lecture.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                            {lecture.isPreviewFree ? "Yes" : "No"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                            <button
                                                onClick={() => handleEditClick(lecture)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <FiEdit className="mr-1" /> Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-600">
                                        No lectures found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for editing lecture */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-base font-semibold">Edit Lecture</h2>
                            <button
                                onClick={() => !isSubmitting && setEditModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-lg"
                                disabled={isSubmitting}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium mb-1">Title *</label>
                                <input
                                    required
                                    placeholder="Enter title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-500 text-xs disabled:opacity-50"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1">Description *</label>
                                <textarea
                                    required
                                    placeholder="Lecture description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-500 h-24 text-xs disabled:opacity-50"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isPreviewFree}
                                    onChange={(e) =>
                                        setFormData({ ...formData, isPreviewFree: e.target.checked })
                                    }
                                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                                    disabled={isSubmitting}
                                />
                                <label className="text-xs">Free Preview</label>
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1">Video File *</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="video/*"
                                    className="w-full text-xs file:py-1 file:px-2 file:border-0 file:bg-blue-50 file:text-blue-700 rounded disabled:opacity-50"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-1 bg-blue-600 text-xs text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
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
                                            Updating...
                                        </span>
                                    ) : (
                                        "Update"
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

export default LectureTable;
