
    import React from 'react';
    import { Navigate, useLocation } from 'react-router-dom';
    import { useAuth } from '@/contexts/AuthContext';
    import { Loader2, AlertCircle } from 'lucide-react';
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
    import { motion } from 'framer-motion';

    function SubmitDreamGuard({ children }) {
      const { user, profile, isLoadingSession, isLoadingProfile, profileError } = useAuth();
      const location = useLocation();

      const isLoading = isLoadingSession || (user && isLoadingProfile && !profile && !profileError);

      if (isLoading) {
        return (
          <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-300">جاري تحميل بيانات المستخدم...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">نرجو الانتظار قليلاً.</p>
          </div>
        );
      }

      if (!user) {
        return <Navigate to="/login" state={{ from: location, message: "يرجى تسجيل الدخول أولاً للوصول إلى هذه الصفحة." }} replace />;
      }

      if (profileError) {
         return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] p-4"
            >
              <Alert variant="destructive" className="max-w-md text-center">
                <AlertCircle className="h-5 w-5 mx-auto mb-2" />
                <AlertTitle className="font-semibold">خطأ في تحميل الملف الشخصي</AlertTitle>
                <AlertDescription>
                  لم نتمكن من تحميل بيانات ملفك الشخصي. قد تكون هناك مشكلة في الشبكة أو الخادم.
                  <br />
                  ({profileError.message || JSON.stringify(profileError)})
                  <br />
                  يرجى محاولة <a href={window.location.href} className="underline hover:text-destructive-foreground/80">تحديث الصفحة</a> أو الاتصال بالدعم.
                </AlertDescription>
              </Alert>
            </motion.div>
          );
      }
      
      // If user is authenticated, profile is loaded (or attempted to load without critical error for guard purpose), render children
      return children;
    }

    export default SubmitDreamGuard;
  