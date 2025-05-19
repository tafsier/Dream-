
    import { useState, useCallback, useEffect } from 'react';
    
    export function useProfileFormLogic(profile, user, updateProfile, uploadAvatar, fetchProfile, toast, t) {
      const [editMode, setEditMode] = useState(false);
      const [formFullName, setFormFullName] = useState('');
      const [avatarFile, setAvatarFile] = useState(null);
      const [avatarPreview, setAvatarPreview] = useState('');
      const [isSubmitting, setIsSubmitting] = useState(false);
    
      useEffect(() => {
        if (profile) {
          setFormFullName(profile.full_name || '');
          setAvatarPreview(profile.avatar_url || '');
        } else {
          setFormFullName(user?.email?.split('@')[0] || '');
          setAvatarPreview('');
        }
      }, [profile, user]);
    
      const handleAvatarChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { 
                toast({
                    title: t('profile.avatarSizeErrorTitle'),
                    description: t('profile.avatarSizeErrorDesc'),
                    variant: "destructive",
                });
                e.target.value = null; 
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        } else {
            setAvatarFile(null);
            setAvatarPreview(profile?.avatar_url || '');
        }
      }, [profile?.avatar_url, toast, t]);
    
      const handleSaveProfile = useCallback(async (event) => {
        if(event) event.preventDefault();
        if (!user) {
            toast({ title: t('common.error'), description: t('profile.errorUserNotLoggedIn'), variant: "destructive"});
            return;
        }
        setIsSubmitting(true);
    
        let finalAvatarUrl = profile?.avatar_url;
    
        if (avatarFile) {
          const uploadedUrl = await uploadAvatar(avatarFile);
          if (uploadedUrl) {
            finalAvatarUrl = uploadedUrl;
          } else {
            setIsSubmitting(false);
            return; 
          }
        }
        
        const profileUpdates = { full_name: formFullName };
        if (finalAvatarUrl !== profile?.avatar_url) {
            profileUpdates.avatar_url = finalAvatarUrl;
        }
    
        const success = await updateProfile(profileUpdates);
    
        if (success) {
            setEditMode(false);
            setAvatarFile(null); 
            if (typeof fetchProfile === 'function') {
              await fetchProfile(); 
            }
        }
        setIsSubmitting(false);
      }, [user, profile?.avatar_url, avatarFile, uploadAvatar, updateProfile, formFullName, fetchProfile, toast, t]);
    
      const toggleEditMode = useCallback(() => {
        setEditMode(prev => {
            const newEditMode = !prev;
            if (newEditMode && profile) { 
              setFormFullName(profile.full_name || '');
              setAvatarPreview(profile.avatar_url || '');
              setAvatarFile(null);
            } else if (!newEditMode && profile) {
                
                setFormFullName(profile.full_name || '');
                setAvatarPreview(profile.avatar_url || '');
                setAvatarFile(null);
            }
            return newEditMode;
        });
      }, [profile]);
    
      return {
        editMode,
        setEditMode,
        formFullName,
        setFormFullName,
        avatarFile,
        setAvatarFile,
        avatarPreview,
        setAvatarPreview,
        isSubmitting,
        setIsSubmitting,
        handleAvatarChange,
        handleSaveProfile,
        toggleEditMode
      };
    }
  