'use client';

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLecturesByCourse, updateLecture, removeLecture } from "@/app/redux/slices/lectureSlice";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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

    // Handle remove lecture
    const handleRemoveClick = async (lectureId) => {
        if (window.confirm("Are you sure you want to delete this lecture?")) {
            try {
                await dispatch(removeLecture(lectureId)).unwrap();
                toast.success("Lecture removed successfully!");
            } catch (err) {
                toast.error(err || "Failed to remove lecture");
            }
        }
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
                <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-600">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                    Free Preview
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-white uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {lectures && lectures.length > 0 ? (
                                lectures.map((lecture) => (
                                    <tr key={lecture._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                                            {lecture.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                            {lecture.isPreviewFree ? "Yes" : "No"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm space-x-2">
                                            <button
                                                onClick={() => handleEditClick(lecture)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <FiEdit className="mr-1" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleRemoveClick(lecture._id)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                <FiTrash2 className="mr-1" /> Remove
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
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Edit Lecture</h2>
                            <button
                                onClick={() => !isSubmitting && setEditModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                                disabled={isSubmitting}
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Title *</label>
                                <input
                                    required
                                    placeholder="Enter title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 text-sm disabled:opacity-50"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Description *</label>
                                <textarea
                                    required
                                    placeholder="Lecture description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 h-24 text-sm disabled:opacity-50"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Switch
                                    id="free-preview"
                                    checked={formData.isPreviewFree}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, isPreviewFree: checked })
                                    }
                                    disabled={isSubmitting}
                                />
                                <Label htmlFor="free-preview" className="text-sm text-gray-700">
                                    Free Preview
                                </Label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Video File</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="video/*"
                                    className="w-full text-sm file:py-1 file:px-3 file:border-0 file:bg-blue-50 file:text-blue-700 rounded disabled:opacity-50"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-sm text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center">
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
                                        </div>
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
