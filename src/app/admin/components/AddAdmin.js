"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { FiUploadCloud, FiUserPlus } from 'react-icons/fi';

const AddAdmin = () => {
    // State variables remain the same
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const [file, setFile] = useState(null);
    const [bulkResults, setBulkResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bulkLoading, setBulkLoading] = useState(false);
    const [error, setError] = useState('');
    const [bulkError, setBulkError] = useState('');

    // Handler functions remain the same
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/admin/single', formData, { withCredentials: true });
            if (response.data.message) {
                setFormData({ name: '', email: '', password: '' });
                alert('Admin created successfully!');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create admin');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setBulkError('Please select a file first');
            return;
        }
        setBulkLoading(true);
        setBulkError('');
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post('http://localhost:5000/api/admin/bulk', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            setBulkResults(response.data.results);
            setFile(null);
        } catch (err) {
            setBulkError(err.response?.data?.message || 'Bulk upload failed');
        } finally {
            setBulkLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-4 mt-16">

            <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiUserPlus className="text-blue-600 text-xl" />
                Admin Management
            </h1>

            {/* Compact Single Admin Form */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Add Single Admin</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-1.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-1.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-1.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-1.5 px-3 rounded-md text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                    >
                        {loading ? (
                            <span className="animate-spin">🌀</span>
                        ) : (
                            <>
                                <FiUserPlus className="text-sm" />
                                Create Admin
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Compact Bulk Upload Section */}
            <div className="pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Bulk Upload</h2>

                <form onSubmit={handleFileUpload} className="space-y-3">
                    <div className="flex items-center gap-3">
                        <label className="block flex-1">
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="block w-full text-xs text-gray-500
                                    file:mr-2 file:py-1 file:px-3
                                    file:rounded-md file:border-0
                                    file:text-xs file:font-medium
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={bulkLoading || !file}
                            className="bg-green-600 text-white py-1.5 px-4 rounded-md text-sm hover:bg-green-700 flex items-center gap-1 disabled:opacity-50"
                        >
                            {bulkLoading ? (
                                <span className="animate-spin">🌀</span>
                            ) : (
                                <>
                                    <FiUploadCloud className="text-sm" />
                                    Upload
                                </>
                            )}
                        </button>
                    </div>

                    {bulkError && <p className="text-red-500 text-xs">{bulkError}</p>}

                    {file && (
                        <div className="text-xs text-gray-600">
                            Selected: {file.name} ({Math.round(file.size / 1024)}KB)
                        </div>
                    )}

                    {bulkResults.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-1.5">Results:</h3>
                            <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs">
                                {bulkResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 rounded ${result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {result.success || result.error}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </form>


                {/* Compact Template Download */}
                <div className="mt-4 pt-4">
                    <p className="text-xs text-gray-600 mb-1.5">Download template:</p>
                    <a
                        href="/templates/admin-bulk-template.xlsx"
                        download
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-xs"
                    >
                        <FiUploadCloud className="mr-1 text-sm" />
                        Template.xlsx
                    </a>
                </div>

            </div>

        </div>
    );
};

export default AddAdmin;