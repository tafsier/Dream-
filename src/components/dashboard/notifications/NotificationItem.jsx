
import React from 'react';
import { Button } from '@/components/ui/button';

const NotificationItem = ({ notification, onMarkAsRead, language, t, formatDate }) => {
    return (
        <div
            className={`p-4 flex items-start space-x-3 rtl:space-x-reverse transition-colors ${
                notification.is_read ? 'bg-gray-50 dark:bg-slate-800/30' : 'bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700/50'
            }`}
        >
            <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${notification.is_read ? 'bg-gray-300 dark:bg-slate-600' : 'bg-primary dark:bg-green-500'}`}></div>
            <div className="flex-grow">
                <p className={`font-semibold ${notification.is_read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                    {language === 'ar' ? notification.title_ar : notification.title_en}
                </p>
                <p className={`text-sm ${notification.is_read ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {language === 'ar' ? notification.message_ar : notification.message_en}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatDate(notification.created_at)}
                </p>
                {!notification.is_read && (
                    <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto mt-1 text-xs text-primary dark:text-green-400 hover:underline"
                        onClick={() => onMarkAsRead(notification.id)}
                    >
                        {t('notificationsPage.markAsRead')}
                    </Button>
                )}
            </div>
            {notification.link && (
                <Button variant="outline" size="sm" asChild>
                    <a href={notification.link} target="_blank" rel="noopener noreferrer">{t('notificationsPage.viewDetails')}</a>
                </Button>
            )}
        </div>
    );
};

export default NotificationItem;
