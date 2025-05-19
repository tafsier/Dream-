
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Inbox, RefreshCw } from 'lucide-react';

const DreamListHeader = ({ isLoading, onRefresh }) => {
  return (
    <CardHeader className="border-b border-gray-200 dark:border-slate-700 pb-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <Inbox className="h-6 w-6 text-primary mr-3" />
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">سجل رؤياي</CardTitle>
        </div>
        <Button onClick={onRefresh} variant="outline" size="sm" className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>
      <CardDescription className="mt-1 text-gray-600 dark:text-gray-400">
        تصفح رؤاك السابقة وتفسيراتها. يمكنك البحث والتصفية والفرز.
      </CardDescription>
    </CardHeader>
  );
};

export default DreamListHeader;
