"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import CourseTable from "./CourseTable";
import { createCourse } from "@/app/redux/slices/courseSlice";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const CourseComponent = () => {
    const dispatch = useDispatch();
    // Optional: You can use the course state to show a loading indicator if needed.
    const { isLoading } = useSelector((state) => state.course);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        difficulty: "",
        category: "",
        isPublished: false,
        image: null,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Dispatch the createCourse thunk; it expects an object with the course data.
            await dispatch(createCourse(formData)).unwrap();
            toast.success("Course created successfully!", {
                position: "bottom-right",
                autoClose: 3000,
            });
            setIsModalOpen(false);
            setFormData({
                title: "",
                description: "",
                price: "",
                difficulty: "",
                category: "",
                isPublished: false,
                image: null,
            });
        } catch (error) {
            toast.error(error || "Error creating course", {
                position: "bottom-right",
                autoClose: 4000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0],
        });
    };

    return (
        <div className="p-6">
            <ToastContainer />
            <div className="flex justify-between items-center mb-8 md:mx-20 mx-10">
                <h1 className="text-xl md:text-3xl font-bold">Course Management</h1>
                <Button onClick={() => setIsModalOpen(true)} disabled={isSubmitting || isLoading}>
                    {isSubmitting ? "Creating..." : "Create Course"}
                </Button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-3">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-base font-semibold">New Course</h2>
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
                                    <label className="block text-xs font-medium mb-1">
                                        Title *
                                    </label>
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
                                    <label className="block text-xs font-medium mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        required
                                        placeholder="Course description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        className="w-full px-2 py-1 border rounded-md focus:ring-1 focus:ring-blue-500 h-16 text-xs disabled:opacity-50"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Price & Difficulty */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-medium mb-1">
                                            Price *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="$"
                                            value={formData.price}
                                            onChange={(e) =>
                                                setFormData({ ...formData, price: e.target.value })
                                            }
                                            className="w-full px-2 py-1 border rounded-md focus:ring-1 focus:ring-blue-500 text-xs disabled:opacity-50"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium mb-1">
                                            Difficulty *
                                        </label>
                                        <select
                                            required
                                            value={formData.difficulty}
                                            onChange={(e) =>
                                                setFormData({ ...formData, difficulty: e.target.value })
                                            }
                                            className="w-full px-2 py-1 border rounded-md focus:ring-1 focus:ring-blue-500 text-xs disabled:opacity-50"
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-xs font-medium mb-1">
                                        Category *
                                    </label>
                                    <input
                                        required
                                        placeholder="Category"
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData({ ...formData, category: e.target.value })
                                        }
                                        className="w-full px-2 py-1 border rounded-md focus:ring-1 focus:ring-blue-500 text-xs disabled:opacity-50"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Publish Switch */}
                                <div className="flex items-center gap-1">
                                    <Switch
                                        id="publish-switch"
                                        checked={formData.isPublished}
                                        onCheckedChange={(checked) =>
                                            setFormData({
                                                ...formData,
                                                isPublished: checked,
                                            })
                                        }
                                        disabled={isSubmitting}
                                    />
                                    <Label htmlFor="publish-switch" className="text-xs">
                                        Publish now
                                    </Label>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-xs font-medium mb-1">
                                        Image
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*"
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
                                            <svg
                                                className="animate-spin h-4 w-4 mr-2"
                                                viewBox="0 0 24 24"
                                            >
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

            <CourseTable />
        </div>
    );
};

export default CourseComponent;
