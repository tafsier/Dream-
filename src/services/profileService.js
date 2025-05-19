
import { supabase } from '@/lib/supabaseClient';

export const uploadAvatarToSupabase = async (userId, avatarFile, toast) => {
  if (!userId || !supabase) {
    if (toast) toast({ title: 'خطأ', description: 'لا يمكن رفع الصورة. المستخدم غير مسجل أو لا يوجد اتصال.', variant: "destructive" });
    return null;
  }
  if (!avatarFile) return null;

  const fileExt = avatarFile.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;
  console.log(`[ProfileService:UploadAvatar] Attempting to upload avatar: ${filePath}`);

  try {
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile);

    if (uploadError) {
      console.error('[ProfileService:UploadAvatar] Error uploading avatar:', uploadError);
      if (toast) toast({ title: 'خطأ في الرفع', description: `فشل رفع الصورة الرمزية: ${uploadError.message}`, variant: "destructive" });
      return null;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    console.log('[ProfileService:UploadAvatar] Avatar uploaded successfully. Public URL:', data.publicUrl);
    return data.publicUrl;

  } catch (err) {
    console.error('[ProfileService:UploadAvatar] Unexpected error uploading avatar:', err);
    if (toast) toast({ title: 'خطأ غير متوقع', description: 'حدث خطأ غير متوقع أثناء رفع الصورة الرمزية.', variant: "destructive" });
    return null;
  }
};
