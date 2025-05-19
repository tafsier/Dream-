
import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';

export const useDreamManagement = () => {
  const { user } = useAuth();
  const [dreams, setDreams] = useState([]);
  const [isLoadingDreams, setIsLoadingDreams] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDreamInterpretation, setSelectedDreamInterpretation] = useState(null);
  const { toast } = useToast();
  const fetchControllerRef = useRef(null);
  const realtimeChannelRef = useRef(null);

  const fetchDreams = useCallback(async () => {
    if (!user || !user.id) {
      console.log("[DreamManagement:Fetch] No user or user.id, cannot fetch dreams.");
      setDreams([]);
      setIsLoadingDreams(false);
      return;
    }
    if (!supabase) {
      console.warn("[DreamManagement:Fetch] Supabase client not available. Cannot fetch dreams.");
      setError('Supabase client not available.');
      setIsLoadingDreams(false);
      return;
    }

    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }
    fetchControllerRef.current = new AbortController();
    const { signal } = fetchControllerRef.current;

    setIsLoadingDreams(true);
    setError(null);
    console.log(`[DreamManagement:Fetch] Attempting to fetch dreams for userId: ${user.id}`);
    try {
      const { data, error: fetchError } = await supabase
        .from('dream_interpretations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .abortSignal(signal);

      if (signal.aborted) {
        console.log("[DreamManagement:Fetch] Fetch dreams aborted.");
        return;
      }

      if (fetchError) throw fetchError;
      console.log("[DreamManagement:Fetch] Dreams fetched successfully:", data ? data.length : 0);
      setDreams(data || []);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('[DreamManagement:Fetch] Fetch dreams operation was aborted as expected.');
      } else {
        console.error("Error fetching dreams:", err);
        setError(`فشل تحميل الرؤى: ${err.message}`);
        toast({
          title: 'خطأ',
          description: 'لم نتمكن من استرجاع رؤياك. يرجى المحاولة مرة أخرى.',
          variant: "destructive",
        });
      }
    } finally {
      if (!signal.aborted) {
        setIsLoadingDreams(false);
      }
    }
  }, [user, toast]);

  useEffect(() => {
    if (user && user.id) {
      fetchDreams();
    } else {
      setDreams([]); 
      setIsLoadingDreams(false);
      setError(null);
    }
  }, [user, fetchDreams]);

  useEffect(() => {
    if (!user || !user.id || !supabase) {
      if (realtimeChannelRef.current) {
        console.log("[DreamManagement:Realtime] Removing existing realtime channel due to no user/supabase.");
        supabase.removeChannel(realtimeChannelRef.current);
        realtimeChannelRef.current = null;
      }
      return;
    }

    if (realtimeChannelRef.current) {
        console.log("[DreamManagement:Realtime] Removing existing channel before creating new one.");
        supabase.removeChannel(realtimeChannelRef.current);
    }
    
    console.log(`[DreamManagement:Realtime] Setting up realtime channel for user: ${user.id}`);
    const channelName = `dream_interpretations_user_${user.id}`;
    realtimeChannelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'dream_interpretations',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('[DreamManagement:Realtime] Realtime dream update received:', payload);
          const updatedDream = payload.new;
          setDreams((currentDreams) =>
            currentDreams.map((dream) =>
              dream.id === updatedDream.id ? { ...dream, ...updatedDream } : dream
            )
          );
          
          if (updatedDream.interpretation && updatedDream.status === 'interpreted') {
             toast({
                title: "تم تحديث الرؤيا",
                description: `تفسير رؤياك "${updatedDream.dream_text.substring(0,30)}..." أصبح متاحًا.`,
                variant: "success",
             });
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[DreamManagement:Realtime] Subscribed to ${channelName}`);
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error(`[DreamManagement:Realtime] Realtime subscription error on ${channelName}:`, status, err);
           toast({
            title: "خطأ في الاتصال",
            description: `مشكلة في الاتصال بالخادم لتحديثات الرؤى: ${err?.message || status}. قد تحتاج لتحديث الصفحة لرؤية التغييرات.`,
            variant: "destructive",
          });
        }
      });

    return () => {
      if (realtimeChannelRef.current) {
        console.log(`[DreamManagement:Realtime] Unsubscribing from ${channelName}`);
        supabase.removeChannel(realtimeChannelRef.current);
        realtimeChannelRef.current = null;
      }
    };
  }, [user, toast]);


  const handleDeleteDream = async (dreamId) => {
    if (!user || !user.id || !supabase) {
        toast({ title: 'خطأ', description: 'المستخدم غير مسجل أو لا يوجد اتصال.', variant: "destructive" });
        return;
    }
    setIsLoadingDreams(true);
    try {
      const { error: deleteError } = await supabase
        .from('dream_interpretations')
        .delete()
        .eq('id', dreamId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      
      setDreams(prevDreams => prevDreams.filter(dream => dream.id !== dreamId));
      toast({
        title: 'نجاح',
        description: 'تم حذف الرؤيا بنجاح.',
        variant: "success",
      });
    } catch (err) {
      console.error("Error deleting dream:", err);
      toast({
        title: 'خطأ',
        description: 'لم نتمكن من حذف الرؤيا. يرجى المحاولة مرة أخرى.',
        variant: "destructive",
      });
    } finally {
      setIsLoadingDreams(false);
    }
  };
  
  const handleShowInterpretation = (dream) => {
    setSelectedDreamInterpretation(dream);
  };


  return { 
    dreams, 
    isLoadingDreams, 
    error, 
    selectedDreamInterpretation,
    fetchDreams, 
    handleDeleteDream, 
    handleShowInterpretation,
    setSelectedDreamInterpretation,
    setDreams 
  };
};
