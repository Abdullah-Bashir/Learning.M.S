import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiBookOpen } from 'react-icons/fi';

const HeroSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
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

    return (
        <section className="min-h-[75vh] bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center px-4 mt-16">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-4xl w-full text-center"
            >
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
                >
                    Learn New Skills With
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-300 mt-2">
                        Expert Courses
                    </span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto"
                >
                    Discover thousands of courses in technology, business, design, and more.
                </motion.p>

                <motion.div variants={itemVariants} className="mb-6">
                    <form className="flex items-center bg-white rounded-lg p-2 shadow-xl max-w-2xl mx-auto border-2 transition-all duration-300"
                        style={{ borderColor: isSearchFocused ? '#9333ea' : '#ffffff' }}>
                        <FiSearch className="text-gray-500 mx-4 text-xl" />
                        <input
                            type="text"
                            placeholder="Search for courses, skills, or instructors..."
                            className="flex-1 outline-none text-gray-700 text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
                        >
                            <FiSearch />
                            Search
                        </button>
                    </form>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <button className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-blue-900 transition-all duration-300 flex items-center gap-2 mx-auto">
                        <FiBookOpen />
                        Explore All Courses
                    </button>
                </motion.div>

                {/* Animated background elements */}
                <motion.div
                    className="absolute top-20 left-20 w-20 h-20 bg-purple-300 rounded-full opacity-10 blur-xl"
                    animate={{
                        y: [0, 20, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-24 h-24 bg-blue-400 rounded-full opacity-10 blur-xl"
                    animate={{
                        y: [0, -20, 0],
                        scale: [1, 0.9, 1]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>
        </section>
    );
};

export default HeroSection;