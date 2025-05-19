
import React from 'react';
import { Loader2 } from 'lucide-react';

const DreamListUpdateIndicator = ({ isLoading, hasDreams }) => {
  if (isLoading && hasDreams) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-gray-600 dark:text-gray-400">جاري تحديث القائمة...</p>
      </div>
    );
  }
  return null;
};

export default DreamListUpdateIndicator;
