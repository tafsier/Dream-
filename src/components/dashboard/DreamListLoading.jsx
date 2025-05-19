
import React from 'react';
    import { Loader2 } from 'lucide-react';

    const DreamListLoading = () => (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mr-3 text-gray-600 dark:text-gray-300">جارٍ تحميل رؤياك...</p>
      </div>
    );

    export default DreamListLoading;
