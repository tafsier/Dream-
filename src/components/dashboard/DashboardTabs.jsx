
import React from 'react';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { MessageSquare, UserCircle, Settings as SettingsIcon, Bell } from 'lucide-react';
    import DreamListSection from '@/components/dashboard/DreamListSection';
    import ProfileSection from '@/components/dashboard/ProfileSection';
    import SettingsSection from '@/components/dashboard/SettingsSection';
    import NotificationsSection from '@/components/dashboard/NotificationsSection';

    const TABS_CONFIG = [
      { value: "dreams", icon: MessageSquare, label: "رؤياي", component: <DreamListSection /> },
      { value: "profile", icon: UserCircle, label: "الملف الشخصي", component: <ProfileSection /> },
      { value: "notifications", icon: Bell, label: "الإشعارات", component: <NotificationsSection /> },
      { value: "settings", icon: SettingsIcon, label: "الإعدادات", component: <SettingsSection /> },
    ];

    const DashboardTabsList = () => (
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 mb-8 bg-gray-100 dark:bg-slate-800 p-2 rounded-lg shadow-sm">
        {TABS_CONFIG.map(tab => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value} 
            className="py-2.5 text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-all flex items-center justify-center"
          >
            <tab.icon className="inline-block ml-2 h-5 w-5" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    );
        
    const DashboardTabContent = ({ value, children }) => (
        <TabsContent value={value} className="bg-white dark:bg-slate-800/50 p-0 rounded-lg shadow-sm">
            <div className="p-4 sm:p-6">
                {children}
            </div>
        </TabsContent>
    );

    const DashboardTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full" dir="rtl">
      <DashboardTabList tabs={tabs} />
      {tabs.map(tab => (
        <DashboardTabContent key={tab.value} value={tab.value}>
          {tab.component}
        </DashboardTabContent>
      ))}
    </Tabs>
  );
};
export default DashboardTabs;