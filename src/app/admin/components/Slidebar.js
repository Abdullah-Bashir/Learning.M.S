"use client";
import { FiX } from "react-icons/fi";

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
    return (
        <>
            {/* Sidebar */}
            <div
                className={`fixed top-16 left-0 md:static md:block w-64 bg-gray-800 min-h-[100vh] p-4 transform transition-transform duration-300 z-40 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                {/* Mobile Header */}
                <div className="md:hidden mb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-white text-xl font-semibold">Admin Panel</h2>
                        <button onClick={onClose} className="text-gray-300 hover:text-white">
                            <FiX size={24} />
                        </button>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => {
                                    setActiveTab("dashboard");
                                    onClose();
                                }}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === "dashboard"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-gray-700"
                                    }`}
                            >
                                Dashboard
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    setActiveTab("course");
                                    onClose();
                                }}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === "course"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-gray-700"
                                    }`}
                            >
                                Courses
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    setActiveTab("addAdmin");
                                    onClose();
                                }}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === "addAdmin"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-gray-700"
                                    }`}
                            >
                                Add Admins
                            </button>
                        </li>
                    </ul>
                </nav>


            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 md:hidden z-30"
                    onClick={onClose}
                    style={{ top: '4rem' }}
                />
            )}
        </>
    );
};