
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Gift, CalendarDays, Hash, BarChartBig } from 'lucide-react';
import { useLanguage } from '@/contexts/useLanguage';

const SubscriptionDetails = ({ profile, packageDetails, loadingPackage, t, formatDate }) => {
  const { language } = useLanguage();
  const currentPackageName = language === 'ar' ? packageDetails?.name_ar : packageDetails?.name_en;

  const renderPackageDetails = () => {
    if (loadingPackage) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      );
    }

    if (!packageDetails) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400">{t('profile.noSubscriptionPackage')}</p>
          <Button asChild size="sm" className="mt-2 button-primary-gradient">
            <Link to="/pricing">{t('profile.viewPackagesButton')}</Link>
          </Button>
        </div>
      );
    }
    
    const features = language === 'ar' ? packageDetails.features_ar : packageDetails.features_en;

    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Gift className="h-5 w-5 text-primary dark:text-green-400" />
          <p className="text-gray-700 dark:text-gray-200">
            <span className="font-semibold">{t('profile.currentPackageLabel')}:</span> {currentPackageName || t('profile.notAvailable')}
          </p>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <CalendarDays className="h-5 w-5 text-primary dark:text-green-400" />
          <p className="text-gray-700 dark:text-gray-200">
            <span className="font-semibold">{t('profile.subscriptionStartDateLabel')}:</span> {formatDate(profile.subscription_start_date)}
          </p>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <CalendarDays className="h-5 w-5 text-primary dark:text-green-400" />
          <p className="text-gray-700 dark:text-gray-200">
            <span className="font-semibold">{t('profile.subscriptionEndDateLabel')}:</span> {formatDate(profile.subscription_end_date)}
          </p>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Hash className="h-5 w-5 text-primary dark:text-green-400" />
          <p className="text-gray-700 dark:text-gray-200">
            <span className="font-semibold">{t('profile.remainingInterpretationsLabel')}:</span> {profile.remaining_interpretations ?? t('profile.unlimited')}
          </p>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <BarChartBig className="h-5 w-5 text-primary dark:text-green-400" />
          <p className="text-gray-700 dark:text-gray-200">
            <span className="font-semibold">{t('profile.characterLimitPerDreamLabel')}:</span> {profile.character_limit_per_dream ?? t('profile.notApplicable')}
          </p>
        </div>
        {features && features.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mt-3 mb-1">{t('profile.packageFeaturesLabel')}:</h4>
            <ul className="list-disc list-inside space-y-1 pl-5 text-gray-600 dark:text-gray-300">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="pt-4">
            <Button asChild variant="outline" className="dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-700">
                <Link to="/pricing">{t('profile.manageSubscriptionButton')}</Link>
            </Button>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b dark:border-slate-700">
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">{t('profile.subscriptionDetailsTitle')}</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">{t('profile.subscriptionDetailsSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {renderPackageDetails()}
      </CardContent>
    </Card>
  );
};

export default SubscriptionDetails;
