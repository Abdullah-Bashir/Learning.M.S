"use client";
import { useState } from "react";
import { Sidebar } from "./components/Slidebar";
import { Dashboard } from "./components/Dashboard";
import { CourseComponent } from "./components/CourseComponent";
import { FiSettings } from "react-icons/fi";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen mt-16">
            {/* Sidebar and Overlay */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 relative">
                {/* Sidebar Toggle Button (Mobile) */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden fixed bottom-20 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg"
                >
                    <FiSettings size={24} />
                </button>

                {/* Page Content */}
                <div className="p-4">
                    {activeTab === "dashboard" && <Dashboard />}
                    {activeTab === "course" && <CourseComponent />}
                </div>
            </div>
        </div>
    );
}
