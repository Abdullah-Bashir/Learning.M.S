"use client";
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses, getEnrollmentStats } from '@/app/redux/slices/courseSlice';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

ChartJS.register(...registerables);

const Dashboard = () => {
    const dispatch = useDispatch();
    const { courses, enrollmentStats, isLoading } = useSelector((state) => state.course);

    useEffect(() => {
        dispatch(getCourses());
        dispatch(getEnrollmentStats());
    }, [dispatch]);

    // Show loading message if data is not yet available
    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen mt-16 flex items-center justify-center">
                <p className="text-lg text-gray-600">Loading real time information...</p>
            </div>
        );
    }

    // Framer Motion Variants for smooth animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } }
    };

    // Course Category Distribution (Doughnut Chart)
    const categoryData = {
        labels: courses?.map(course => course.category),
        datasets: [{
            data: courses?.map(course => course.enrolledStudents?.length || 0),
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                '#FF9F40', '#EB3B5A', '#2d98da', '#45aaf2', '#a55eea'
            ],
            hoverOffset: 4
        }]
    };

    // Enrollment Trends (Bar Chart)
    const enrollmentOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: 'Monthly Enrollment',
                font: { size: 14 }
            }
        },
        scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Students' } },
            x: { title: { display: true, text: 'Month' } }
        }
    };

    return (
        <motion.div
            className="p-6 bg-gray-50 min-h-screen space-y-6 mt-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1
                className="text-3xl font-extrabold text-gray-800"
                variants={itemVariants}
            >
                Dashboard Overview
            </motion.h1>

            {/* Stats Cards */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={containerVariants}
            >
                {['Courses', 'Students', 'Revenue'].map((stat, idx) => (
                    <motion.div
                        key={stat}
                        variants={itemVariants}
                        className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition-shadow"
                    >
                        <h3 className="text-gray-500 text-xs">{stat}</h3>
                        <p className="text-xl font-semibold mt-1">
                            {idx === 0 ? courses?.length : idx === 1 ?
                                enrollmentStats?.totalStudents : `$${enrollmentStats?.totalRevenue}`}
                        </p>
                        <div className="mt-2 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full" />
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Section */}
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                variants={containerVariants}
            >
                {/* Course Categories (Doughnut Chart) */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition-shadow"
                >
                    <h3 className="text-sm font-medium mb-2">Course Categories</h3>
                    <Doughnut
                        data={categoryData}
                        options={{
                            plugins: {
                                legend: { position: 'right' },
                                tooltip: { enabled: true }
                            },
                            animation: { animateScale: true }
                        }}
                    />
                </motion.div>

                {/* Enrollment Trends (Bar Chart) */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition-shadow"
                >
                    <h3 className="text-sm font-medium mb-2">Enrollment Trends</h3>
                    <Bar
                        data={{
                            labels: enrollmentStats?.monthlyEnrollments?.labels || [],
                            datasets: [{
                                label: 'Enrollments',
                                data: enrollmentStats?.monthlyEnrollments?.data || [],
                                backgroundColor: '#3B82F6',
                                borderRadius: 4
                            }]
                        }}
                        options={enrollmentOptions}
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
