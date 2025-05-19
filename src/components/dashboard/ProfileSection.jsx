
    import React, { useEffect } from 'react';
    import { useAuth } from '@/contexts/AuthContext';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import ProfileHeader from '@/components/dashboard/profile/ProfileHeader';
    import ProfileForm from '@/components/dashboard/profile/ProfileForm';
    import SubscriptionDetails from '@/components/dashboard/profile/SubscriptionDetails';
    import ProfileLoadingErrorDisplay from '@/components/dashboard/profile/ProfileLoadingErrorDisplay';
    import ProfileDisplayInfo from '@/components/dashboard/profile/ProfileDisplayInfo';
    import { useLanguage } from '@/contexts/useLanguage';
    import { useProfileFormLogic } from '@/hooks/useProfileFormLogic';
    
    const ProfileSection = () => {
      const { 
        user, 
        profile, 
        isLoading,
        isLoadingProfile, 
        profileError, 
        fetchProfile,
        updateProfile,
        uploadAvatar,
        isInitialSessionLoadComplete
      } = useAuth();
      const { toast } = useToast();
      const { t } = useLanguage();
    
      const {
        editMode,
        setEditMode,
        formFullName,
        setFormFullName,
        avatarFile,
        setAvatarFile,
        avatarPreview,
        setAvatarPreview,
        isSubmitting,
        handleAvatarChange,
        handleSaveProfile,
        toggleEditMode
      } = useProfileFormLogic(profile, user, updateProfile, uploadAvatar, fetchProfile, toast, t);
    
      useEffect(() => {
        if (profile) {
          setFormFullName(profile.full_name || '');
          setAvatarPreview(profile.avatar_url || '');
        } else if (isInitialSessionLoadComplete && user && !isLoadingProfile && !profileError) {
           console.log("[ProfileSection:Effect] No profile but user exists and session load complete, attempting to fetch profile.");
           if(typeof fetchProfile === 'function') fetchProfile();
        }
      }, [profile, user, isLoadingProfile, profileError, setFormFullName, setAvatarPreview, fetchProfile, isInitialSessionLoadComplete]);
    
      if (isLoading) {
        return <ProfileLoadingErrorDisplay t={t} type="loading" />;
      }
    
      if (profileError && !profile) {
        return <ProfileLoadingErrorDisplay t={t} profileError={t('profile.errorLoadingProfile') + `: ${profileError}`} profileExists={!!profile} onRetry={fetchProfile} />;
      }
      
      if (!profile && !isLoading && isInitialSessionLoadComplete) {
         return <ProfileLoadingErrorDisplay t={t} type="noData" profileExists={false} onRetry={fetchProfile} />;
      }
      
      if (!profile) {
        
        return <ProfileLoadingErrorDisplay t={t} type="noData" message={t('profile.errorLoadingProfileFallback')} profileExists={false} onRetry={fetchProfile} />;
      }
    
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg"
        >
          <ProfileHeader 
            editMode={editMode}
            onToggleEditMode={toggleEditMode}
            t={t}
          />
            
          <ProfileDisplayInfo 
            user={user} 
            profile={profile}
            avatarPreview={editMode ? avatarPreview : profile?.avatar_url} 
            formFullName={editMode ? formFullName : profile?.full_name}
            t={t}
          />
    
          {profileError && editMode && (
             <ProfileLoadingErrorDisplay t={t} profileError={t('profile.profileUpdatedError') + `: ${profileError}`} profileExists={!!profile} />
          )}
    
          <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
            <ProfileForm
              user={user}
              fullName={formFullName}
              setFullName={setFormFullName}
              avatarUrl={avatarPreview}
              isEditing={editMode}
              isLoading={isSubmitting}
              uploading={isSubmitting && !!avatarFile}
              handleUpdateProfile={handleSaveProfile}
              handleAvatarUpload={handleAvatarChange}
              setIsEditing={setEditMode}
              initialProfile={profile}
              t={t}
            />
          </div>
          
          {profile && <SubscriptionDetails profile={profile} t={t} />}
    
        </motion.div>
      );
    };
    
    export default ProfileSection;
  