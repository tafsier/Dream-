import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import DreamListSection from '@/components/dashboard/DreamListSection';
import ProfileSection from '@/components/dashboard/ProfileSection';
import SettingsSection from '@/components/dashboard/SettingsSection';
import NotificationsSection from '@/components/dashboard/NotificationsSection';
import { useLanguage } from '@/contexts/useLanguage';
import { useDashboardTabs } from '@/hooks/useDashboardTabs';

const Dashboard = () => {
  const { user, isInitialSessionLoadComplete } = useAuth();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tabsConfig, activeTab, setActiveTab } = useDashboardTabs(t);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabsConfig.find(t => t.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else if (tabsConfig.length > 0) {
      setActiveTab(tabsConfig[0].id);
    }
  }, [searchParams, tabsConfig, setActiveTab]);

  useEffect(() => {
    if (activeTab) {
      setSearchParams({ tab: activeTab }, { replace: true });
    }
  }, [activeTab, setSearchParams]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dreams':
        return <DreamListSection />;
      case 'profile':
        return <ProfileSection />;
      case 'settings':
        return <SettingsSection />;
      case 'notifications':
        return <NotificationsSection />;
      default:
        return <DreamListSection />;
    }
  };

  if (!user?.id || !isInitialSessionLoadComplete) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-700">{t('loading.userData') || 'جارٍ تحميل بيانات المستخدم...'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 py-8">
      <DashboardHeader />
      <DashboardTabs
        tabs={tabsConfig}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default Dashboard;