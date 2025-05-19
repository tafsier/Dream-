
    import { useCallback, useRef } from 'react';
    import { useToast } from "@/components/ui/use-toast";
    import { SUBSCRIPTION_TYPES, DEFAULT_FREE_INTERPRETATIONS, DEFAULT_FREE_CHAR_LIMIT } from '@/lib/constants';
    
    export function useFetchProfile(supabase, setProfile, setLoadingProfile, setProfileError) {
      const { toast } = useToast();
      const fetchControllerRef = useRef(null);
    
      const fetchProfileData = useCallback(async (currentUserId, currentUserEmail, currentUserObject) => {
        if (fetchControllerRef.current) {
          fetchControllerRef.current.abort();
          console.log("[useFetchProfile:FetchData] Aborted previous fetch request.");
        }
        fetchControllerRef.current = new AbortController();
        const { signal } = fetchControllerRef.current;
    
        if (!currentUserId) {
          console.log("[useFetchProfile:FetchData] No userId, cannot fetch profile. Setting profile to null and stopping loading.");
          setProfile(null);
          setLoadingProfile(false);
          setProfileError(null);
          return;
        }
    
        if (!supabase) {
          console.warn("[useFetchProfile:FetchData] Supabase client not available. Cannot fetch profile.");
          setProfileError("Supabase client not available.");
          setLoadingProfile(false);
          return;
        }
    
        console.log(`[useFetchProfile:FetchData] Attempting to fetch profile for userId: ${currentUserId}`);
        setLoadingProfile(true);
        setProfileError(null);
    
        try {
          const { data, error, status } = await supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url, subscription_type, subscription_start_date, subscription_end_date, remaining_interpretations, character_limit_per_dream, created_at, updated_at, subscription_package_id')
            .eq('id', currentUserId)
            .single()
            .abortSignal(signal);
    
          if (signal.aborted) {
            console.log(`[useFetchProfile:FetchData] Fetch aborted for userId: ${currentUserId}`);
            return;
          }
    
          console.log(`[useFetchProfile:FetchData] Supabase response for userId ${currentUserId}:`, { status, data: data ? JSON.parse(JSON.stringify(data)) : null, error });
    
          if (error && error.code !== 'PGRST116') {
            console.error('[useFetchProfile:FetchData] Error fetching profile:', error);
            setProfileError(error.message);
            setProfile(null);
          } else if (data) {
            console.log('[useFetchProfile:FetchData] Profile fetched successfully.');
            setProfile(data);
          } else {
            console.log(`[useFetchProfile:FetchData] No profile found for userId: ${currentUserId}. Attempting to create one.`);
            if (currentUserEmail) {
              const newProfileData = {
                id: currentUserId,
                email: currentUserEmail,
                full_name: currentUserObject?.user_metadata?.full_name || currentUserEmail.split('@')[0] || 'مستخدم جديد',
                avatar_url: currentUserObject?.user_metadata?.avatar_url || null,
                subscription_type: SUBSCRIPTION_TYPES.FREE,
                subscription_start_date: new Date().toISOString(),
                subscription_end_date: null,
                remaining_interpretations: DEFAULT_FREE_INTERPRETATIONS,
                character_limit_per_dream: DEFAULT_FREE_CHAR_LIMIT,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                subscription_package_id: SUBSCRIPTION_TYPES.FREE,
              };
              console.log('[useFetchProfile:Create] New profile data to be inserted:', JSON.parse(JSON.stringify(newProfileData)));
    
              const { data: createdProfile, error: createError } = await supabase
                .from('profiles')
                .insert(newProfileData)
                .select('id, full_name, email, avatar_url, subscription_type, subscription_start_date, subscription_end_date, remaining_interpretations, character_limit_per_dream, created_at, updated_at, subscription_package_id')
                .single()
                .abortSignal(signal);
              
              if (signal.aborted) {
                console.log(`[useFetchProfile:Create] Create profile aborted for userId: ${currentUserId}`);
                return;
              }
    
              if (createError) {
                console.error('[useFetchProfile:Create] Error creating profile:', createError);
                setProfileError(createError.message);
                setProfile(null);
              } else {
                console.log('[useFetchProfile:Create] Profile created successfully.');
                setProfile(createdProfile);
                toast({
                  title: "مرحباً بك!",
                  description: "تم إنشاء ملفك الشخصي بنجاح.",
                  variant: "success"
                });
              }
            } else {
              console.warn("[useFetchProfile:Create] Cannot create profile: currentUserEmail is not available.");
              setProfileError("User email not available to create profile.");
              setProfile(null);
            }
          }
        } catch (err) {
          if (err.name === 'AbortError') {
            console.log('[useFetchProfile:FetchData] Fetch operation was aborted as expected.');
          } else {
            console.error('[useFetchProfile:FetchData] Unexpected error in fetchProfile:', err);
            setProfileError('An unexpected error occurred while fetching the profile.');
            setProfile(null);
          }
        } finally {
          if (!signal.aborted) {
            setLoadingProfile(false);
            console.log("[useFetchProfile:FetchData] Finished profile fetch/create attempt. Loading set to false.");
          } else {
             console.log("[useFetchProfile:FetchData] Fetch was aborted, setLoadingProfile(false) was likely skipped for this instance.");
          }
        }
      }, [supabase, setProfile, setLoadingProfile, setProfileError, toast]);
    
      return { fetchProfileData };
    }
  