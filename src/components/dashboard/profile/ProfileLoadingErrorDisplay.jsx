
    import React from 'react';
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";
    import { AlertTriangle, Loader2, Info } from 'lucide-react';
    import { Button } from '@/components/ui/button.jsx';
    
    const ProfileLoadingErrorDisplay = ({ t, type, message, onRetry, profileError, profileExists }) => {
      if (type === "loading") {
        return (
          <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-transparent">
            <Loader2 className="h-12 w-12 animate-spin text-primary dark:text-emerald-400 mb-4" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{t('profile.loadingProfile')}</p>
          </div>
        );
      }
    
      if (profileError) {
        return (
          <Alert variant="destructive" className="my-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('profile.errorTitle') || 'خطأ'}</AlertTitle>
            <AlertDescription>{profileError}</AlertDescription>
            {onRetry && typeof onRetry === 'function' && <Button onClick={onRetry} variant="outline" size="sm" className="mt-2">{t('common.retry') || 'إعادة المحاولة'}</Button>}
          </Alert>
        );
      }
    
      if (type === "noData" || (!profileExists && type !== "loading" && !profileError) ) {
         return (
          <Alert variant="default" className="my-4 bg-amber-50 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-700 dark:text-amber-300">{t('profile.noProfileDataTitle') || 'الملف الشخصي غير متوفر'}</AlertTitle>
            <AlertDescription className="text-amber-600 dark:text-amber-400">{message || t('profile.noProfileDataDesc') || 'لم نتمكن من العثور على بيانات ملفك الشخصي. قد تحتاج إلى تسجيل الدخول مرة أخرى أو المحاولة لاحقاً.'}</AlertDescription>
            {onRetry && typeof onRetry === 'function' && <Button onClick={onRetry} variant="link" size="sm" className="mt-2 text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200">{t('common.retry') || 'إعادة المحاولة'}</Button>}
          </Alert>
        );
      }
      
      return null; 
    };
    
    export default ProfileLoadingErrorDisplay;
  