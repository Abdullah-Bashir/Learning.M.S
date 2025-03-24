// app/admin/components/Sidebar.js
"use client";
import Link from 'next/link';
import { FiX, FiMenu } from 'react-icons/fi';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
    return (
        <div className={`fixed md:relative w-64 bg-gray-800 min-h-screen p-4 transform transition-all duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-white text-2xl font-bold">Admin Panel</h2>
                <button
                    onClick={onClose}
                    className="text-white md:hidden"
                >
                    <FiX size={24} />
                </button>
            </div>
            <ul className="space-y-4">
                <li>
                    <button
                        onClick={() => {
                            setActiveTab('dashboard');
                            onClose();
                        }}
                        className={`w-full text-left px-4 py-2 rounded transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                        Dashboard
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => {
                            setActiveTab('course');
                            onClose();
                        }}
                        className={`w-full text-left px-4 py-2 rounded transition-all ${activeTab === 'course' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                        Courses
                    </button>
                </li>
            </ul>
        </div>
    );
};