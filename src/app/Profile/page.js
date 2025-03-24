"use client";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { validateToken } from '../redux/slices/authSlice';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar";  // Add this import
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CameraIcon, CheckCircleIcon } from 'lucide-react';
// Animation variants for course cards
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const EditProfilePage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [enrolledCourses] = useState([
        {
            title: "Introduction to React",
            description:
                "Learn the basics of React development including components, state, and props.",
            instructor: "John Doe",
            difficulty: "Beginner",
            price: 49.99,
            image: "/react-course.jpg",
        },
        {
            title: "Advanced JavaScript",
            description:
                "Deep dive into advanced JavaScript concepts and modern ES6+ features.",
            instructor: "Jane Smith",
            difficulty: "Intermediate",
            price: 59.99,
            image: "/js-course.jpg",
        },
    ]);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                email: user.email || "",
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setPreview(user.avatar?.url || "");
        }
    }, [user]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    // Wrap handleSubmit to control the update state
    const onFormSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match", { position: "top-center" });
            return;
        }
        setIsUpdating(true);
        const formPayload = new FormData();
        if (file) formPayload.append("avatar", file);
        formPayload.append("username", formData.username);
        formPayload.append("email", formData.email);
        formPayload.append("currentPassword", formData.currentPassword);
        formPayload.append("newPassword", formData.newPassword);

        try {
            const response = await axios.put(
                "http://localhost:5000/api/users/update",
                formPayload,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.data.success) {
                dispatch(validateToken());
                toast.success("Profile updated successfully", {
                    position: "top-center",
                });
                setIsOpen(false);
                setFile(null);
                setFormData((prev) => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                }));
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Update failed",
                { position: "top-center" }
            );
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-20">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col items-center gap-8">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                        <AvatarImage src={preview} />
                        <AvatarFallback>
                            {user?.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="text-center">
                        <h1 className="text-3xl font-bold">{user?.username}</h1>
                        <p className="text-gray-600 mt-2">{user?.email}</p>
                    </div>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Edit Profile</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[400px] rounded-lg">
                            <DialogHeader className="border-b pb-3">
                                <DialogTitle className="text-lg font-semibold text-gray-800">
                                    Update Profile
                                </DialogTitle>
                            </DialogHeader>

                            <form onSubmit={onFormSubmit} className="px-4 py-3">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative group">
                                            <Avatar className="w-16 h-16 border-2 border-gray-200">
                                                <AvatarImage src={preview} />
                                                <AvatarFallback className="bg-gray-100 text-gray-600">
                                                    {user?.username?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <Label
                                                htmlFor="avatar"
                                                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            >
                                                <span className="text-white text-sm text-center">
                                                    <CameraIcon className="w-4 h-4 mx-auto mb-1" />
                                                    Change
                                                </span>
                                            </Label>
                                        </div>
                                        <Input
                                            id="avatar"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <div className="flex-1 space-y-2">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Username
                                                </Label>
                                                <Input
                                                    value={formData.username}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            username: e.target.value,
                                                        })
                                                    }
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Email
                                                </Label>
                                                <Input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            email: e.target.value,
                                                        })
                                                    }
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium text-gray-700 border-t pt-4">
                                            Password Change
                                        </h4>
                                        <div className="space-y-2">
                                            <div>
                                                <Label className="text-xs font-medium text-gray-600">
                                                    Current Password
                                                </Label>
                                                <Input
                                                    type="password"
                                                    value={formData.currentPassword}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            currentPassword: e.target.value,
                                                        })
                                                    }
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-xs font-medium text-gray-600">
                                                        New Password
                                                    </Label>
                                                    <Input
                                                        type="password"
                                                        value={formData.newPassword}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                newPassword: e.target.value,
                                                            })
                                                        }
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs font-medium text-gray-600">
                                                        Confirm Password
                                                    </Label>
                                                    <Input
                                                        type="password"
                                                        value={formData.confirmPassword}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                confirmPassword: e.target.value,
                                                            })
                                                        }
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="mt-6">
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-sm font-medium h-9"
                                        disabled={
                                            isUpdating ||
                                            formData.newPassword !== formData.confirmPassword ||
                                            (!file &&
                                                formData.username === user?.username &&
                                                formData.email === user?.email &&
                                                !formData.newPassword)
                                        }
                                    >
                                        {isUpdating ? (
                                            "Saving..."
                                        ) : (
                                            <>
                                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Enrolled Courses Section */}
                <div className="mt-12 w-full">
                    <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                        Enrolled Courses
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {enrolledCourses.map((course, index) => (
                            <CourseCard key={index} course={course} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};






// Course Card Component
const CourseCard = ({ course }) => (
    <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg duration-300 m-2 hover:scale-105 hover:shadow-gray-500 transition-all cursor-pointer"
    >
        <div className="h-24 bg-gray-200 relative">
            <img
                src={course.image || '/default-course.png'}
                alt={course.title}
                className="w-full h-full object-cover"
            />
        </div>
        <div className="p-2">
            <h3 className="text-base font-semibold mt-1">{course.title}</h3>
            <p className="text-gray-600 text-xs line-clamp-2">{course.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-gray-200" />
                    <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span
                        className={`px-1 py-0.5 text-xs font-semibold rounded-full ${course.difficulty === 'Beginner'
                            ? 'bg-green-100 text-green-800'
                            : course.difficulty === 'Intermediate'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {course.difficulty}
                    </span>
                </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-blue-600">
                    {course.price ? `$${course.price}` : 'Free'}
                </span>
                <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition">
                    Enroll Now
                </button>
            </div>
        </div>
    </motion.div>
);

// Skeleton Loading Components
const CourseCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden m-2 animate-pulse">
        <div className="h-24 bg-gray-300" />
        <div className="p-2 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
    </div>
);

const ProfileSkeleton = () => (
    <div className="flex flex-col items-center md:flex-row md:items-start space-y-8 md:space-y-0 md:space-x-8">
        <div className="w-48 h-48 rounded-full bg-gray-300 animate-pulse" />
        <div className="mt-5 space-y-4">
            <div className="h-6 w-64 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-48 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-40 bg-gray-300 rounded animate-pulse"></div>
        </div>
    </div>
);

export default EditProfilePage;