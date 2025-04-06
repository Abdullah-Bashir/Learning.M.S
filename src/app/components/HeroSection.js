"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiBookOpen } from 'react-icons/fi';

const HeroSection = ({ onSearch }) => {
    const [inputValue, setInputValue] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { delayChildren: 0.3, staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(inputValue);
    };

    return (
        <section className="min-h-[60vh] bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center px-4 mt-16">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-3xl w-full text-center"
            >
                <motion.h1
                    variants={itemVariants}
                    className="text-3xl md:text-4xl font-bold text-white mb-3 leading-snug"
                >
                    Learn New Skills With
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-300 mt-1">
                        Expert Courses
                    </span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-base text-gray-200 mb-6 max-w-xl mx-auto"
                >
                    Discover thousands of courses in technology, business, design, and more.
                </motion.p>

                <motion.div variants={itemVariants} className="mb-5">
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-center bg-white rounded-md p-2 shadow-lg max-w-xl mx-auto border transition-all duration-300"
                        style={{ borderColor: isSearchFocused ? '#9333ea' : '#ffffff' }}
                    >
                        <FiSearch className="text-gray-500 mx-3 text-lg" />
                        <input
                            type="text"
                            placeholder="Search courses or skills..."
                            className="flex-1 outline-none text-gray-700 text-base"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm flex items-center gap-1"
                        >
                            <FiSearch />
                            Search
                        </button>
                    </form>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <button className="bg-transparent border border-white text-white px-4 py-1.5 rounded-md hover:bg-white hover:text-blue-900 text-sm flex items-center gap-1 mx-auto">
                        <FiBookOpen />
                        Explore Courses
                    </button>
                </motion.div>

                {/* Animated background elements */}
                <motion.div
                    className="absolute top-20 left-20 w-16 h-16 bg-purple-300 rounded-full opacity-10 blur-xl"
                    animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-20 h-20 bg-blue-400 rounded-full opacity-10 blur-xl"
                    animate={{ y: [0, -20, 0], scale: [1, 0.95, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>
        </section>
    );
};

export default HeroSection;