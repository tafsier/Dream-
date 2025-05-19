
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { ChevronRight, Palette, BellDot, KeyRound, Languages } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useLanguage } from '@/contexts/useLanguage';
    
    const SettingsSection = () => {
      const { t, language, setLanguage, toggleLanguage } = useLanguage();
    
      const settingsOptions = [
        {
          id: 'language',
          icon: Languages,
          title: t('settings.languagePreference'),
          description: t('settings.selectLanguage'),
          action: () => {
            
            console.log("Language setting clicked. Current:", language);
            
          },
          currentValue: language === 'ar' ? t('settings.arabic') : t('settings.english'),
          component: (
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setLanguage('ar')} className={language === 'ar' ? 'bg-primary/10 text-primary' : ''}>{t('settings.arabic')}</Button>
              <Button variant="outline" onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-primary/10 text-primary' : ''}>{t('settings.english')}</Button>
            </div>
          )
        },
        {
          id: 'theme',
          icon: Palette,
          title: t('settings.themePreference'),
          description: t('settings.systemMode'), 
          action: () => console.log('Theme settings clicked'),
        },
        {
          id: 'notifications',
          icon: BellDot,
          title: t('settings.notifications'),
          description: t('settings.emailNotificationsDesc'),
          action: () => console.log('Notification settings clicked'),
        },
        {
          id: 'password',
          icon: KeyRound,
          title: t('dashboard.settingsChangePasswordTitle'),
          description: t('dashboard.settingsChangePasswordDesc'),
          action: () => console.log('Change password clicked'),
        },
      ];
    
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg"
        >
          <div className="mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {t('settings.title')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('settings.subtitle')}
            </p>
          </div>
    
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {settingsOptions.map((option) => (
              <Card key={option.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 dark:bg-slate-800/50">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-medium text-primary dark:text-green-400">{option.title}</CardTitle>
                    <CardDescription className="text-xs text-gray-500 dark:text-gray-400">{option.description}</CardDescription>
                  </div>
                   <option.icon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                </CardHeader>
                <CardContent>
                  {option.component ? (
                    option.component
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700/50"
                      onClick={option.action}
                    >
                      <span>{option.currentValue || t('dashboard.settingsManageNotificationsButton')}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700 flex justify-end">
            <Button className="button-primary-gradient">
              {t('settings.saveSettingsButton')}
            </Button>
          </div>
        </motion.div>
      );
    };
    
    export default SettingsSection;
  