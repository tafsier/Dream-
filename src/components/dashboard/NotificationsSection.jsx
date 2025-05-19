
    import React, { useEffect, useState, useCallback } from 'react';
    import { useAuth } from '@/contexts/AuthContext';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { BellRing, CheckCheck, Trash2, RefreshCw } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useNotifications } from '@/hooks/useNotifications';
    import NotificationItem from '@/components/dashboard/notifications/NotificationItem';
    import NotificationControls from '@/components/dashboard/notifications/NotificationControls';
    import NotificationsLoading from '@/components/dashboard/notifications/NotificationsLoading';
    import { useLanguage } from '@/contexts/useLanguage';
    
    const NotificationsSection = () => {
      const { user } = useAuth();
      const { toast } = useToast();
      const { t } = useLanguage();
    
      const {
        notifications,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
      } = useNotifications(user?.id, toast, t);
    
      useEffect(() => {
        if (user?.id) {
          fetchNotifications();
        }
      }, [user?.id, fetchNotifications]);
    
      const handleRefresh = useCallback(() => {
        fetchNotifications(true);
      }, [fetchNotifications]);
    
      if (loading && notifications.length === 0) {
        return <NotificationsLoading t={t} />;
      }
    
      if (error) {
        return (
          <div className="text-center py-10 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg shadow-md">
            <BellRing className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">{t('errorToastTitle')}</h3>
            <p className="text-red-600 dark:text-red-400">{t('notificationsPage.errorLoading')}</p>
            <Button onClick={handleRefresh} variant="outline" className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('dashboard.dreamRefreshAriaLabel')}
            </Button>
          </div>
        );
      }
    
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-0">
              {t('notificationsPage.title')}
            </h2>
            <NotificationControls
              onMarkAllRead={markAllAsRead}
              onClearAll={clearAllNotifications}
              onRefresh={handleRefresh}
              t={t}
              hasUnread={notifications.some(n => !n.is_read)}
              hasNotifications={notifications.length > 0}
            />
          </div>
    
          {notifications.length === 0 ? (
            <div className="text-center py-10">
              <BellRing className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">{t('notificationsPage.noNotifications')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={() => markAsRead(notification.id)}
                    t={t}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      );
    };
    
    export default NotificationsSection;
  