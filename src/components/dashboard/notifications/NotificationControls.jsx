
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Trash2 } from 'lucide-react';

const NotificationControls = ({ onMarkAllRead, onClearAll, t, notifications }) => {
    return (
        <div className="p-4 flex justify-end space-x-2 rtl:space-x-reverse border-b dark:border-slate-700">
            <Button variant="outline" size="sm" onClick={onMarkAllRead} disabled={!notifications || notifications.every(n => n.is_read)}>
                <Check className="mr-2 h-4 w-4" /> {t('notificationsPage.markAllAsRead')}
            </Button>
            <Button variant="destructive" size="sm" onClick={onClearAll} disabled={!notifications || notifications.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" /> {t('notificationsPage.clearAll')}
            </Button>
        </div>
    );
};

export default NotificationControls;
