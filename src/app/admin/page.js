// app/admin/page.js
"use client";
import { useState } from 'react';
import { Sidebar } from './components/Slidebar';
import { Dashboard } from './components/Dashboard';
import { CourseComponent } from './components/CourseComponent';
import { FiSettings, FiX } from 'react-icons/fi'; // Changed from FiMenu to FiSettings

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex mt-16">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 relative">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden fixed bottom-20 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg"
                >
                    {isSidebarOpen ? (
                        <FiX size={24} /> // Close icon when sidebar is open
                    ) : (
                        <FiSettings size={24} /> // Settings icon when closed
                    )}
                </button>

                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 md:hidden z-40"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <div className="p-4">
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'course' && <CourseComponent />}
                </div>
            </div>
        </div>
    );
}