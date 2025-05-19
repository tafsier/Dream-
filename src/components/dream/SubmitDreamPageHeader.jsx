
import React from 'react';
import { motion } from 'framer-motion';

const SubmitDreamPageHeader = ({ titleGradient, titleMain, subtitle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
        >
            <h1 className="text-4xl sm:text-5xl font-extrabold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-green-500 to-teal-400 dark:from-green-400 dark:via-teal-300 dark:to-sky-400">
                    {titleGradient}
                </span>
                <span className="text-gray-800 dark:text-white"> {titleMain}</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {subtitle}
            </p>
        </motion.div>
    );
};

export default SubmitDreamPageHeader;
