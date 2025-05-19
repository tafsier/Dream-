
    import React from 'react';
    import { Loader2 } from 'lucide-react';
    
    export const AuthProviderLayout = ({ children, isLoading }) => {
      if (isLoading) {
        return (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-gray-900 dark:to-neutral-900 z-50">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">جاري تحميل بيانات المستخدم...</p>
            <p className="text-md text-gray-500 dark:text-gray-400 mt-2">نرجو الانتظار قليلاً.</p>
          </div>
        );
      }
    
      return <>{children}</>;
    };
  