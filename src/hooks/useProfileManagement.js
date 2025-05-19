
    import { useState, useEffect, useCallback, useRef } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { SUBSCRIPTION_TYPES, DEFAULT_FREE_INTERPRETATIONS, DEFAULT_FREE_CHAR_LIMIT } from '@/lib/constants';
    import { uploadAvatarToSupabase } from '@/services/profileService';
    
    export function useProfileManagement(userId, userEmail, userObject, isSessionLoadComplete) {
      const [profile, setProfileState] = useState(null);
      const [loadingProfile, setLoadingProfile] = useState(true);
      const [profileError, setProfileError] = useState(null);
      const { toast } = useToast();
      const isMountedRef = useRef(true);
      const fetchControllerRef = useRef(null);
    
      const setProfile = useCallback((newProfile) => {
        if (isMountedRef.current) {
          setProfileState(newProfile);
          if (newProfile === null) {
            console.log("[useProfileManagement] Profile explicitly set to null in state.");
          } else {
            console.log("[useProfileManagement] Profile updated in state:", JSON.parse(JSON.stringify(newProfile)));
          }
        }
      }, []);
    
      const fetchProfile = useCallback(async (currentUserIdToFetch, currentUserEmailToFetch, currentUserObjectToFetch) => {
        const actualUserId = currentUserIdToFetch || userId;
        const actualUserEmail = currentUserEmailToFetch || userEmail;
        const actualUserObject = currentUserObjectToFetch || userObject;
    
        if (fetchControllerRef.current) {
          fetchControllerRef.current.abort();
          console.log("[useProfileManagement:Fetch] Aborted previous fetch request.");
        }
        fetchControllerRef.current = new AbortController();
        const { signal } = fetchControllerRef.current;
    
        if (!actualUserId) {
          console.log("[useProfileManagement:Fetch] No userId, cannot fetch profile. Setting profile to null and stopping loading.");
          setProfile(null);
          if (isMountedRef.current) {
            setLoadingProfile(false);
            setProfileError(null);
          }
          return;
        }
    
        if (!supabase) {
          console.warn("[useProfileManagement:Fetch] Supabase client not available. Cannot fetch profile.");
          if (isMountedRef.current) {
            setProfileError("Supabase client not available.");
            setLoadingProfile(false);
          }
          return;
        }
    
        console.log(`[useProfileManagement:Fetch] Attempting to fetch profile for userId: ${actualUserId}`);
        if (isMountedRef.current) {
          setLoadingProfile(true);
          setProfileError(null);
        }
    
        try {
          const { data, error, status } = await supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url, subscription_type, subscription_start_date, subscription_end_date, remaining_interpretations, character_limit_per_dream, created_at, updated_at, subscription_package_id')
            .eq('id', actualUserId)
            .single()
            .abortSignal(signal);
    
          if (signal.aborted) {
            console.log(`[useProfileManagement:Fetch] Fetch aborted for userId: ${actualUserId}`);
            return;
          }
    
          console.log(`[useProfileManagement:Fetch] Supabase response for userId ${actualUserId}:`, { status, data: data ? JSON.parse(JSON.stringify(data)) : null, error });
    
          if (error && error.code !== 'PGRST116') {
            console.error('[useProfileManagement:Fetch] Error fetching profile:', error);
            if (isMountedRef.current) {
              setProfileError(error.message);
              setProfile(null);
            }
          } else if (data) {
            console.log('[useProfileManagement:Fetch] Profile fetched successfully.');
            if (isMountedRef.current) setProfile(data);
          } else {
            console.log(`[useProfileManagement:Fetch] No profile found for userId: ${actualUserId}. Attempting to create one.`);
            if (actualUserEmail) {
              const newProfileData = {
                id: actualUserId,
                email: actualUserEmail,
                full_name: actualUserObject?.user_metadata?.full_name || actualUserEmail.split('@')[0] || 'مستخدم جديد',
                avatar_url: actualUserObject?.user_metadata?.avatar_url || null,
                subscription_type: SUBSCRIPTION_TYPES.FREE,
                subscription_start_date: new Date().toISOString(),
                subscription_end_date: null,
                remaining_interpretations: DEFAULT_FREE_INTERPRETATIONS,
                character_limit_per_dream: DEFAULT_FREE_CHAR_LIMIT,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                subscription_package_id: SUBSCRIPTION_TYPES.FREE,
              };
              console.log('[useProfileManagement:Create] New profile data to be inserted:', JSON.parse(JSON.stringify(newProfileData)));
    
              const { data: createdProfile, error: createError } = await supabase
                .from('profiles')
                .insert(newProfileData)
                .select('id, full_name, email, avatar_url, subscription_type, subscription_start_date, subscription_end_date, remaining_interpretations, character_limit_per_dream, created_at, updated_at, subscription_package_id')
                .single()
                .abortSignal(signal);
              
              if (signal.aborted) {
                console.log(`[useProfileManagement:Create] Create profile aborted for userId: ${actualUserId}`);
                return;
              }
    
              if (createError) {
                console.error('[useProfileManagement:Create] Error creating profile:', createError);
                if (isMountedRef.current) {
                  setProfileError(createError.message);
                  setProfile(null);
                }
              } else {
                console.log('[useProfileManagement:Create] Profile created successfully.');
                if (isMountedRef.current) {
                  setProfile(createdProfile);
                  toast({
                    title: "مرحباً بك!",
                    description: "تم إنشاء ملفك الشخصي بنجاح.",
                    variant: "success"
                  });
                }
              }
            } else {
              console.warn("[useProfileManagement:Create] Cannot create profile: actualUserEmail is not available.");
              if (isMountedRef.current) {
                setProfileError("User email not available to create profile.");
                setProfile(null);
              }
            }
          }
        } catch (err) {
          if (err.name === 'AbortError') {
            console.log('[useProfileManagement:Fetch] Fetch operation was aborted as expected.');
          } else {
            console.error('[useProfileManagement:Fetch] Unexpected error in fetchProfile:', err);
            if (isMountedRef.current) {
              setProfileError('An unexpected error occurred while fetching the profile.');
              setProfile(null);
            }
          }
        } finally {
          if (isMountedRef.current && !signal.aborted) {
            setLoadingProfile(false);
            console.log("[useProfileManagement:Fetch] Finished profile fetch/create attempt. Loading set to false.");
          } else if (signal.aborted) {
             console.log("[useProfileManagement:Fetch] Fetch was aborted, loading state might not be updated by this instance.");
          }
        }
      }, [userId, userEmail, userObject, toast, setProfile]);
    
      const updateProfile = useCallback(async (profileData) => {
        if (!userId || !supabase) {
          toast({ title: 'خطأ', description: 'لا يمكن تحديث الملف الشخصي. المستخدم غير مسجل أو لا يوجد اتصال.', variant: "destructive" });
          return false;
        }
        console.log("[useProfileManagement:Update] Attempting to update profile with data:", JSON.parse(JSON.stringify(profileData)));
        try {
          const { data, error } = await supabase
            .from('profiles')
            .update({ ...profileData, updated_at: new Date().toISOString() })
            .eq('id', userId)
            .select('id, full_name, email, avatar_url, subscription_type, subscription_start_date, subscription_end_date, remaining_interpretations, character_limit_per_dream, created_at, updated_at, subscription_package_id')
            .single();
    
          if (error) {
            console.error('[useProfileManagement:Update] Error updating profile:', error);
            toast({ title: 'خطأ في التحديث', description: `فشل تحديث الملف الشخصي: ${error.message}`, variant: "destructive" });
            return false;
          }
          
          console.log('[useProfileManagement:Update] Profile updated successfully:', JSON.parse(JSON.stringify(data)));
          if (isMountedRef.current) setProfile(data);
          toast({ title: 'نجاح', description: 'تم تحديث الملف الشخصي بنجاح.', variant: "success" });
          return true;
        } catch (err) {
          console.error('[useProfileManagement:Update] Unexpected error updating profile:', err);
          toast({ title: 'خطأ غير متوقع', description: 'حدث خطأ غير متوقع أثناء تحديث الملف الشخصي.', variant: "destructive" });
          return false;
        }
      }, [userId, toast, setProfile]);
    
      const uploadAvatar = useCallback(async (avatarFile) => {
        const uploadedUrl = await uploadAvatarToSupabase(userId, avatarFile, toast);
        if (uploadedUrl) {
           await fetchProfile(userId, userEmail, userObject);
        }
        return uploadedUrl;
      }, [userId, userEmail, userObject, toast, fetchProfile]);
    
    
      useEffect(() => {
        isMountedRef.current = true;
        console.log(`[useProfileManagement:Effect] Running effect. userId: ${userId}, isSessionLoadComplete: ${isSessionLoadComplete}, supabase available: ${!!supabase}, loadingProfile: ${loadingProfile}`);
        
        if (!isSessionLoadComplete) {
          console.log("[useProfileManagement:Effect] Session is not yet complete, deferring profile fetch. Setting loadingProfile to true.");
          if(isMountedRef.current && !loadingProfile) setLoadingProfile(true); 
          return;
        }
    
        if (userId && supabase) {
          console.log(`[useProfileManagement:Effect] Session load complete, calling fetchProfile for userId: ${userId}`);
          fetchProfile(userId, userEmail, userObject);
        } else {
          if (!userId) console.log("[useProfileManagement:Effect] Session load complete, but no userId. Clearing profile and stopping loading.");
          if (!supabase) console.log("[useProfileManagement:Effect] Session load complete, but Supabase not available. Cannot fetch. Stopping loading.");
          setProfile(null);
          if (isMountedRef.current) {
            setLoadingProfile(false); 
            setProfileError(null);
          }
        }
        
        return () => {
          isMountedRef.current = false;
          if (fetchControllerRef.current) {
            fetchControllerRef.current.abort();
            console.log("[useProfileManagement:EffectUnmount] Aborted fetch request on unmount.");
          }
          console.log("[useProfileManagement:Effect] Unmounted.");
        };
      }, [userId, userEmail, userObject, fetchProfile, isSessionLoadComplete]);
    
      return { profile, setProfile, loadingProfile, profileError, fetchProfile, updateProfile, uploadAvatar };
    }
  