
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useDreamRealtimeUpdates = (userId, setDreams, toast, t) => {
    const [newUpdates, setNewUpdates] = useState(0);

    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel(`dream_interpretations:user_id=eq.${userId}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'dream_interpretations', filter: `user_id=eq.${userId}` },
                (payload) => {
                    console.log('Realtime update received:', payload);
                    setDreams(prevDreams =>
                        prevDreams.map(dream =>
                            dream.id === payload.new.id ? { ...dream, ...payload.new } : dream
                        )
                    );
                    setNewUpdates(prev => prev + 1);
                    toast({
                        title: t('dashboard.dreamUpdatedTitle'),
                        description: `${t('dashboard.dreamUpdatedDesc')} ${payload.new.id} ${t('dashboard.hasBeenUpdated')}`,
                    });
                }
            )
            .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Subscribed to dream updates');
                }
                if (status === 'CHANNEL_ERROR') {
                    console.error('Realtime channel error:', err);
                    toast({
                        title: t('dashboard.realtimeErrorTitle'),
                        description: t('dashboard.realtimeErrorDesc', { message: err?.message || 'Unknown error' }),
                        variant: 'destructive',
                    });
                }
                if (status === 'TIMED_OUT') {
                    console.warn('Realtime subscription timed out.');
                }
                if (status === 'CLOSED') {
                    console.log('Realtime channel closed.');
                }
            });

        return () => {
            supabase.removeChannel(channel);
            console.log('Unsubscribed from dream updates');
        };
    }, [userId, setDreams, toast, t]);

    useEffect(() => {
        if (newUpdates > 0) {
            const timer = setTimeout(() => setNewUpdates(0), 5000); 
            return () => clearTimeout(timer);
        }
    }, [newUpdates]);

    return newUpdates;
};
