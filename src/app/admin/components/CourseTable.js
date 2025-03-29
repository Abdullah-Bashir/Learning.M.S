"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatorCourses, updateCourse } from "@/app/redux/slices/courseSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit2 as PencilIcon } from "react-icons/fi";
import { IoClose as XMarkIcon } from "react-icons/io5";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const CourseTable = () => {
    const dispatch = useDispatch();
    const { courses, isLoading } = useSelector((state) => state.course);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editCourseData, setEditCourseData] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        dispatch(getCreatorCourses());
    }, [dispatch]);

    const handleEdit = (course) => {
        setEditCourseData({ ...course });
        setIsEditModalOpen(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await dispatch(
                updateCourse({ id: editCourseData._id, courseData: editCourseData })
            ).unwrap();
            toast.success("Course updated successfully!", {
                position: "bottom-right",
                autoClose: 3000,
            });
            setIsEditModalOpen(false);
        } catch (error) {
            toast.error(error || "Error updating course", {
                position: "bottom-right",
                autoClose: 4000,
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleFileChange = (e) => {
        setEditCourseData({
            ...editCourseData,
            image: e.target.files[0],
        });
    };

    return (
        <div className="mt-4 px-2 sm:px-4">
            <ToastContainer />
            <div className="mb-4">
                <h1 className="text-xl font-bold text-gray-900">Course Management</h1>
                <p className="mt-1 text-xs text-gray-600">
                    Manage all courses created by you
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-3 py-2 text-left font-medium text-gray-500">
                                    Course
                                </th>
                                <th scope="col" className="px-2 py-2 text-left font-medium text-gray-500">
                                    Price
                                </th>
                                <th scope="col" className="px-2 py-2 text-left font-medium text-gray-500">
                                    Level
                                </th>
                                <th scope="col" className="px-2 py-2 text-center font-medium text-gray-500">
                                    Status
                                </th>
                                <th scope="col" className="px-2 py-2 text-right font-medium text-gray-500">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {courses.map((course) => (
                                <tr key={course._id} className="hover:bg-gray-50">
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8">
                                                <img
                                                    className="h-8 w-8 rounded"
                                                    src={course.image?.url || '/course-placeholder.jpg'}
                                                    alt={course.title}
                                                />
                                            </div>
                                            <div className="ml-2">
                                                <div className="text-xs font-medium text-gray-900 line-clamp-1">
                                                    {course.title}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
                                        ${course.price}
                                    </td>
                                    <td className="px-2 py-3 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs 
                                            ${course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                                                course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                            {course.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-2 py-3 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs 
                                            ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                            {course.isPublished ? 'Live' : 'Draft'}
                                        </span>
                                    </td>

                                    <td className="px-2 py-3 whitespace-nowrap text-right flex gap-4 justify-end">
                                        <button
                                            onClick={() => handleEdit(course)}
                                            className="text-blue-600 hover:text-blue-900 text-xs flex items-center"
                                        >
                                            <PencilIcon className="h-3 w-3 mr-1" />
                                            Edit
                                        </button>

                                        <Link className="text-purple-600" href={`/admin/${course._id}/lectures`}>
                                            Lectures
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {courses.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center">
                                        <p className="text-sm text-gray-500">No courses found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal for Course Updates */}
            {isEditModalOpen && editCourseData && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-2 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-xs border border-gray-200">
                        <div className="px-3 py-2 border-b flex justify-between items-center">
                            <h3 className="text-sm font-medium">Edit Course</h3>
                            <button
                                onClick={() => !isUpdating && setIsEditModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                                disabled={isUpdating}
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="p-2 space-y-2 text-xs">
                            <div>
                                <label className="block mb-0.5 font-medium">Title</label>
                                <input
                                    required
                                    value={editCourseData.title}
                                    onChange={(e) =>
                                        setEditCourseData({ ...editCourseData, title: e.target.value })
                                    }
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={isUpdating}
                                />
                            </div>

                            <div>
                                <label className="block mb-0.5 font-medium">Description</label>
                                <textarea
                                    required
                                    value={editCourseData.description}
                                    onChange={(e) =>
                                        setEditCourseData({ ...editCourseData, description: e.target.value })
                                    }
                                    className="w-full px-2 py-1 border border-gray-300 rounded h-16 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={isUpdating}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block mb-0.5 font-medium">Price</label>
                                    <input
                                        type="number"
                                        required
                                        value={editCourseData.price}
                                        onChange={(e) =>
                                            setEditCourseData({ ...editCourseData, price: e.target.value })
                                        }
                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={isUpdating}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-0.5 font-medium">Difficulty</label>
                                    <select
                                        required
                                        value={editCourseData.difficulty}
                                        onChange={(e) =>
                                            setEditCourseData({ ...editCourseData, difficulty: e.target.value })
                                        }
                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={isUpdating}
                                    >
                                        <option value="">Select</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-0.5 font-medium">Category</label>
                                <input
                                    required
                                    value={editCourseData.category}
                                    onChange={(e) =>
                                        setEditCourseData({ ...editCourseData, category: e.target.value })
                                    }
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={isUpdating}
                                />
                            </div>

                            <div className="flex items-center gap-1">
                                <Switch
                                    id="publish-switch-edit"
                                    checked={editCourseData.isPublished}
                                    onCheckedChange={(checked) =>
                                        setEditCourseData({ ...editCourseData, isPublished: checked })
                                    }
                                    disabled={isUpdating}
                                />
                                <Label htmlFor="publish-switch-edit" className="text-xs">
                                    Publish
                                </Label>
                            </div>

                            <div>
                                <label className="block mb-0.5 font-medium">Image</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full text-xs file:text-xs file:py-1 file:px-2 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    disabled={isUpdating}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 rounded border border-gray-300"
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-1 bg-blue-600 text-xs text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CourseTable;
