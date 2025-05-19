
    import React from 'react';
    import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Edit3, XCircle } from 'lucide-react';
    
    const ProfileHeader = ({ editMode, onToggleEditMode, t }) => {
      return (
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b dark:border-slate-700">
          <div>
            <CardTitle className="text-2xl text-primary dark:text-emerald-400">{t('profile.title')}</CardTitle>
            <CardDescription>{t('profile.description')}</CardDescription>
          </div>
          <Button onClick={onToggleEditMode} variant={editMode ? "ghost" : "outline"} className="mt-4 sm:mt-0 button-primary-ghost dark:text-slate-200 dark:hover:bg-slate-700">
            {editMode ? (
              <>
                <XCircle className="ml-2 h-5 w-5" /> {t('profile.cancelEdit')}
              </>
            ) : (
              <>
                <Edit3 className="ml-2 h-5 w-5" /> {t('profile.editProfile')}
              </>
            )}
          </Button>
        </CardHeader>
      );
    };
    
    export default ProfileHeader;
  