
    import React from 'react';
    import { motion } from 'framer-motion';
    import { useAuth } from '@/contexts/AuthContext';
    
    const DashboardHeader = () => {
      const { user, profile, isLoading } = useAuth();
      let displayName = 'زائرنا الكريم';
    
      if (!isLoading) {
        if (profile && profile.full_name) {
          displayName = profile.full_name;
        } else if (user && user.email) {
          displayName = user.email.split('@')[0];
        }
      }
    
      return (
        <header className="mb-10 md:mb-12">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white"
          >
            مرحباً {isLoading ? '...' : displayName}، <span className="gradient-text">لوحة التحكم</span>
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300 mt-2"
          >
            قم بإدارة رؤياك، ملفك الشخصي، والإعدادات.
          </motion.p>
        </header>
      );
    };
    
    export default DashboardHeader;
  