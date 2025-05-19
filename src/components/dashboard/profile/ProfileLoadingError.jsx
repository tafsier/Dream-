
    import React from 'react';
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";
    import { AlertTriangle, Loader2 } from 'lucide-react';
    import { Button } from '@/components/ui/button.jsx';
    
    const ProfileLoadingErrorDisplay = ({ t, type, message, onRetry, profileError, profileExists }) => {
      if (type === "loading") {
        return (
          <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{t('profile.loadingProfile')}</p>
          </div>
        );
      }
    
      if (profileError) {
        return (
          <Alert variant="destructive" className="my-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('profile.profileUpdatedError') || 'خطأ في تحميل الملف الشخصي'}</AlertTitle>
            <AlertDescription>{profileError}</AlertDescription>
            {onRetry && <Button onClick={onRetry} variant="outline" size="sm" className="mt-2">{t('common.retry') || 'إعادة المحاولة'}</Button>}
          </Alert>
        );
      }
    
      if (type === "noData" || !profileExists) {
         return (
          <Alert variant="warning" className="my-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('profile.errorLoadingProfile') || 'الملف الشخصي غير متوفر'}</AlertTitle>
            <AlertDescription>{message || t('common.noDataProfile') || 'لم نتمكن من العثور على بيانات ملفك الشخصي. قد تحتاج إلى تسجيل الدخول مرة أخرى.'}</AlertDescription>
            {onRetry && <Button onClick={onRetry} variant="link" size="sm" className="mt-2">{t('common.retry') || 'إعادة المحاولة'}</Button>}
          </Alert>
        );
      }
      
      return null; 
    };
    
    export default ProfileLoadingErrorDisplay;
  