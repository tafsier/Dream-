
import React from 'react';
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
    import { AlertCircle } from 'lucide-react';

    const DreamListError = ({ error }) => (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>خطأ في تحميل الرؤى</AlertTitle>
        <AlertDescription>{error || 'حدث خطأ غير معروف أثناء محاولة تحميل قائمة الرؤى.'}</AlertDescription>
      </Alert>
    );

    export default DreamListError;
