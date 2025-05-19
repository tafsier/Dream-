
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/useLanguage';

export const useNotifications = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast({
                title: t('errorToastTitle'),
                description: t('notificationsPage.errorLoading'),
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [user, t, toast]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel(`notifications:user_id=eq.${user.id}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
                (payload) => {
                    fetchNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, fetchNotifications]);

    const handleMarkAsRead = async (id) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', id);
            if (error) throw error;
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error('Error marking notification as read:', error);
            toast({ title: t('errorToastTitle'), description: error.message, variant: 'destructive' });
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false);
            if (error) throw error;
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            toast({ title: t('errorToastTitle'), description: error.message, variant: 'destructive' });
        }
    };
    
    const handleClearAll = async () => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('user_id', user.id);
            if (error) throw error;
            setNotifications([]);
        } catch (error) {
            console.error('Error clearing all notifications:', error);
            toast({ title: t('errorToastTitle'), description: error.message, variant: 'destructive' });
        }
    };

    return {
        notifications,
        loading,
        fetchNotifications,
        handleMarkAsRead,
        handleMarkAllAsRead,
        handleClearAll,
    };
};
