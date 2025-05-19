
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Loader2, AlertTriangle } from 'lucide-react';
    import PricingCard from '@/components/pricing/PricingCard.jsx';
    import PricingHeader from '@/components/pricing/PricingHeader.jsx';
    import SatisfactionGuarantee from '@/components/pricing/SatisfactionGuarantee.jsx';
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";
    
    const PricingPageLayout = ({
      plans = [],
      isLoadingPage,
      pageError,
      isLoadingPlanAction,
      handleChoosePlan,
      language,
      t,
    }) => {
      if (isLoadingPage) {
        return (
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
      }
    
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-12 md:py-20"
        >
          <PricingHeader t={t} />
    
          {pageError && (
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('pricing.errorTitle')}</AlertTitle>
              <AlertDescription>{pageError}</AlertDescription>
            </Alert>
          )}
    
          {!pageError && plans.length === 0 && !isLoadingPage && (
            <Alert variant="info" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('pricing.noPlansAvailable')}</AlertTitle>
              <AlertDescription>{t('pricing.noPlansAvailableError')}</AlertDescription>
            </Alert>
          )}
          
          {plans.length > 0 && (
            <div className={`grid md:grid-cols-2 ${plans.length === 1 ? 'lg:grid-cols-1 max-w-sm mx-auto' : plans.length === 2 ? 'lg:grid-cols-2 max-w-2xl mx-auto' : 'lg:grid-cols-3'} gap-8 items-stretch`}>
              {plans.map((plan) => (
                <PricingCard 
                  key={plan.id}
                  plan={plan}
                  language={language}
                  onChoosePlan={handleChoosePlan}
                  isLoadingPlanAction={isLoadingPlanAction}
                />
              ))}
            </div>
          )}
    
          <SatisfactionGuarantee t={t} />
        </motion.div>
      );
    };
    
    export default PricingPageLayout;
  