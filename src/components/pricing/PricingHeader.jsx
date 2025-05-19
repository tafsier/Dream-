
    import React from 'react';
    import { motion } from 'framer-motion';
    
    const PricingHeader = ({ t }) => {
      return (
        <header className="text-center mb-12 md:mb-16">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold mb-4"
          >
            <span className="gradient-text">{t('pricing.headerTitle').split(' ')[0]} {t('pricing.headerTitle').split(' ')[1]}</span> {t('pricing.headerTitle').substring(t('pricing.headerTitle').indexOf(' ', t('pricing.headerTitle').indexOf(' ') + 1) + 1)}
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            {t('pricing.headerSubtitle')}
          </motion.p>
        </header>
      );
    };
    
    export default PricingHeader;
  