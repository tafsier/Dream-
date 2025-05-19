
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { User, Mail, Save, Loader2, Camera, RotateCcw } from 'lucide-react';
    
    const ProfileForm = ({
      user,
      fullName,
      setFullName,
      isEditing,
      isLoading,
      uploading,
      handleUpdateProfile,
      handleAvatarUpload,
      setIsEditing,
      initialProfile,
      t
    }) => {
    
      const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateProfile();
      };
    
      const handleCancel = () => {
        setIsEditing(false);
        if (initialProfile) {
          setFullName(initialProfile.full_name || '');
          
        }
      };
    
      if (!isEditing) return null;
    
      return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="avatar-upload" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              <Camera className="ml-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              {t('profile.changeAvatar')}
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleAvatarUpload}
              disabled={uploading || isLoading}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 dark:file:bg-emerald-600/20 dark:file:text-emerald-300 dark:hover:file:bg-emerald-600/30 w-full max-w-md dark:bg-slate-700"
            />
            {uploading && <p className="text-sm text-primary dark:text-emerald-400 mt-2 animate-pulse">{t('profile.uploadingAvatar')}</p>}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('profile.avatarMaxSize')}</p>
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <User className="ml-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                {t('profile.fullNameLabel')}
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                className="mt-1 dark:bg-slate-700"
                placeholder={t('profile.fullNamePlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Mail className="ml-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                {t('profile.emailLabel')}
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="mt-1 bg-gray-100 dark:bg-slate-700/50 dark:text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>
    
          <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6 border-t dark:border-slate-700/50">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading} className="dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700">
              <RotateCcw className="ml-2 h-4 w-4" /> {t('profile.cancelButton')}
            </Button>
            <Button type="submit" disabled={isLoading || uploading} className="button-primary-gradient">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('profile.savingButtonLoading')}
                </>
              ) : (
                <>
                  <Save className="ml-2 h-4 w-4" /> {t('profile.saveButton')}
                </>
              )}
            </Button>
          </div>
        </form>
      );
    };
    
    export default ProfileForm;
  