
    import React from 'react';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
    
    const ProfileDisplayInfo = ({ user, profile, avatarPreview, formFullName, t }) => {
      
      const getInitials = (name) => {
        if (!name && !user?.email) return "?";
        if (!name) return user.email.charAt(0).toUpperCase();
        const names = name.split(' ');
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
      };
    
      const currentFullName = formFullName || profile?.full_name || t('profile.defaultFullName') || 'مستخدم';
      const currentAvatar = avatarPreview || profile?.avatar_url;
    
      return (
        <div className="flex flex-col items-center space-y-3 py-4">
          <Avatar className="h-28 w-28 border-4 border-primary/30 dark:border-emerald-500/40 shadow-lg">
            <AvatarImage src={currentAvatar || undefined} alt={currentFullName} />
            <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-emerald-500 text-white dark:from-emerald-600 dark:to-teal-700">
              {getInitials(currentFullName)}
            </AvatarFallback>
          </Avatar>
          <p className="text-2xl font-semibold text-gray-800 dark:text-white">{currentFullName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
      );
    };
    
    export default ProfileDisplayInfo;
  