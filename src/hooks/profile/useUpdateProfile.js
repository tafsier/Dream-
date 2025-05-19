
    import { useCallback } from 'react';
    import { useToast } from "@/components/ui/use-toast";
    import { uploadAvatarToSupabase } from '@/services/profileService';
    
    export function useUpdateProfile(supabase, setProfile, fetchProfileData) {
      const { toast } = useToast();
    
      const updateProfileData = useCallback(async (userId, profileData) => {
        if (!userId || !supabase) {
          toast({ title: 'خطأ', description: 'لا يمكن تحديث الملف الشخصي. المستخدم غير مسجل أو لا يوجد اتصال.', variant: "destructive" });
          return false;
        }
        console.log("[useUpdateProfile:UpdateData] Attempting to update profile with data:", JSON.parse(JSON.stringify(profileData)));
        try {
          const { data, error } = await supabase
            .from('profiles')
            .update({ ...profileData, updated_at: new Date().toISOString() })
            .eq('id', userId)
            .select('id, full_name, email, avatar_url, subscription_type, subscription_start_date, subscription_end_date, remaining_interpretations, character_limit_per_dream, created_at, updated_at, subscription_package_id')
            .single();
    
          if (error) {
            console.error('[useUpdateProfile:UpdateData] Error updating profile:', error);
            toast({ title: 'خطأ في التحديث', description: `فشل تحديث الملف الشخصي: ${error.message}`, variant: "destructive" });
            return false;
          }
          
          console.log('[useUpdateProfile:UpdateData] Profile updated successfully:', JSON.parse(JSON.stringify(data)));
          setProfile(data);
          toast({ title: 'نجاح', description: 'تم تحديث الملف الشخصي بنجاح.', variant: "success" });
          return true;
        } catch (err) {
          console.error('[useUpdateProfile:UpdateData] Unexpected error updating profile:', err);
          toast({ title: 'خطأ غير متوقع', description: 'حدث خطأ غير متوقع أثناء تحديث الملف الشخصي.', variant: "destructive" });
          return false;
        }
      }, [supabase, setProfile, toast]);
    
      const uploadAvatarData = useCallback(async (userId, avatarFile) => {
        if (!userId) {
            console.error("[useUpdateProfile:UploadAvatarData] User ID is missing.");
            toast({ title: 'خطأ', description: 'معرف المستخدم مفقود، لا يمكن رفع الصورة الرمزية.', variant: "destructive" });
            return null;
        }
        const uploadedUrl = await uploadAvatarToSupabase(userId, avatarFile, toast);
        if (uploadedUrl && typeof fetchProfileData === 'function') {
            console.log("[useUpdateProfile:UploadAvatarData] Avatar uploaded, fetching updated profile.");
            
            const user = supabase.auth.user ? supabase.auth.user() : (await supabase.auth.getUser())?.data?.user;

            if (user?.id && user?.email) {
                 await fetchProfileData(user.id, user.email, user);
            } else {
                console.warn("[useUpdateProfile:UploadAvatarData] User object not available to refresh profile after avatar upload.");
            }
        }
        return uploadedUrl;
      }, [supabase, toast, fetchProfileData]);
    
      return { updateProfileData, uploadAvatarData };
    }
  