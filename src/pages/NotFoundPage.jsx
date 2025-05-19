
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { motion } from 'framer-motion';
    import { AlertTriangle, FolderHeart as HomeIcon } from 'lucide-react';

    function NotFoundPage() {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-6"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.1, duration: 0.5 }}
            className="p-6 bg-red-100 dark:bg-red-900/30 rounded-full mb-8"
          >
            <AlertTriangle className="h-20 w-20 text-red-500 dark:text-red-400" />
          </motion.div>

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold text-gray-800 dark:text-white mb-4"
          >
            404
          </motion.h1>
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6"
          >
            عفواً، الصفحة غير موجودة!
          </motion.h2>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-10"
          >
            يبدو أنك ضللت الطريق. الصفحة التي تبحث عنها إما تم حذفها أو لم تكن موجودة أصلاً.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <Link to="/">
                <HomeIcon className="mr-2 rtl:ml-2 h-5 w-5" />
                العودة إلى الصفحة الرئيسية
              </Link>
            </Button>
          </motion.div>
          <div className="mt-12">
            <img  alt="رسم توضيحي لصفحة غير موجودة" class="max-w-xs md:max-w-sm mx-auto opacity-70" src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b" />
          </div>
        </motion.div>
      );
    }

    export default NotFoundPage;
  