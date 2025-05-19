
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const NotificationsLoading = ({ t }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b dark:border-slate-700">
        <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">{t('notificationsPage.title')}</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">{t('dashboard.tabNotifications')}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 flex justify-end space-x-2 rtl:space-x-reverse border-b dark:border-slate-700">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="divide-y dark:divide-slate-700 h-[400px] lg:h-[500px] overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-start space-x-3 rtl:space-x-reverse">
              <Skeleton className="mt-1 h-3 w-3 rounded-full flex-shrink-0" />
              <div className="flex-grow space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsLoading;
