
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import DreamListSection from '@/components/dashboard/DreamListSection';
import ProfileSection from '@/components/dashboard/ProfileSection';
import SettingsSection from '@/components/dashboard/SettingsSection';
import NotificationsSection from '@/components/dashboard/NotificationsSection';
import { LayoutDashboard, UserCircle, Settings, Bell } from 'lucide-react';

export const useDashboardTabs = (t) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dreams');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['dreams', 'profile', 'settings', 'notifications'].includes(tab)) {
            setActiveTab(tab);
        } else if (!tab) {
             setActiveTab('dreams'); 
        }
    }, [searchParams]);

    const handleTabChange = (value) => {
        setActiveTab(value);
        setSearchParams({ tab: value });
    };

    const tabsConfig = useMemo(() => [
        { value: "dreams", label: t('dashboard.tabDreams'), icon: LayoutDashboard, component: <DreamListSection /> },
        { value: "profile", label: t('dashboard.tabProfile'), icon: UserCircle, component: <ProfileSection /> },
        { value: "settings", label: t('dashboard.tabSettings'), icon: Settings, component: <SettingsSection /> },
        { value: "notifications", label: t('dashboard.tabNotifications'), icon: Bell, component: <NotificationsSection /> },
    ], [t]);

    return { activeTab, handleTabChange, tabsConfig };
};
