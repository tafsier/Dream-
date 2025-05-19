
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Loader2 } from 'lucide-react';
    import PricingCard from '@/components/pricing/PricingCard';
    import { useLanguage } from '@/contexts/useLanguage';
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
    import { AlertCircle } from "lucide-react";
    
    const PricingPlans = ({
      packages: plansFromHook,
      loading,
      error: pageErrorFromHook,
      onSelectPlan,
      isStripeLoading,
      t
    }) => {
      const { language } = useLanguage();
    
      if (loading) {
        return (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg">{t('pricing.loadingPlans')}</p>
          </div>
        );
      }
    
      if (pageErrorFromHook) {
        return (
           <Alert variant="destructive" className="my-8 max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('pricing.errorTitle')}</AlertTitle>
            <AlertDescription>
              {pageErrorFromHook}
            </AlertDescription>
          </Alert>
        );
      }
    
      if (!plansFromHook || plansFromHook.length === 0) {
        return (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 dark:text-gray-400">{t('pricing.noPlansAvailable')}</p>
          </div>
        );
      }
    
      return (
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className={`grid grid-cols-1 md:grid-cols-2 ${plansFromHook.length === 1 ? 'lg:grid-cols-1 max-w-md mx-auto' : plansFromHook.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-8`}>
              {plansFromHook.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  language={language}
                  onChoosePlan={onSelectPlan}
                  isLoadingPlanAction={isStripeLoading === plan.stripe_price_id}
                />
              ))}
            </div>
            
            {isStripeLoading === 'general' && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
              </div>
            )}
          </div>
        </section>
      );
    };
    
    export default PricingPlans;
  