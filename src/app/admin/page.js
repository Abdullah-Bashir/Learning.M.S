"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "./components/Slidebar";
import Dashboard from "./components/Dashboard";
import { CourseComponent } from "./components/CourseComponent";
import { FiSettings } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { validateToken } from "@/app/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [checkingRole, setCheckingRole] = useState(true);

    useEffect(() => {
        const validate = async () => {
            const action = await dispatch(validateToken());
            const user = action.payload?.user;

            if (!user || user.role !== "admin") {
                router.replace("/");
            } else {
                setCheckingRole(false);
            }
        };
        validate();
    }, [dispatch, router]);

    if (checkingRole) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)]">
            {/* Sidebar */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 relative">
                {/* Mobile Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg"
                >
                    <FiSettings size={24} />
                </button>

                {/* Page Content */}
                <div className="p-4 md:p-6 lg:p-8 pt-20 md:pt-6">
                    {activeTab === "dashboard" && <Dashboard />}
                    {activeTab === "course" && <CourseComponent />}
                </div>
            </div>
        </div>
    );
}
