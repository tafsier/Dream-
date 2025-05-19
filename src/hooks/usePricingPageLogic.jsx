
    import { useState, useEffect, useCallback } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useToast } from "@/components/ui/use-toast";
    import { getAllPackagesForDisplay, createVirtualFreePackage } from '@/services/packageService';
    import { loadStripe } from '@stripe/stripe-js';
    import { useAuth } from '@/contexts/AuthContext';
    import { useLanguage } from '@/contexts/useLanguage';
    import { PACKAGE_ICONS, SUBSCRIPTION_TYPES } from '@/lib/constants';
    
    const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "YOUR_STRIPE_PUBLISHABLE_KEY";
    let stripePromise;
    if (STRIPE_PUBLISHABLE_KEY && STRIPE_PUBLISHABLE_KEY !== "YOUR_STRIPE_PUBLISHABLE_KEY") {
      stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
    }
    const areKeysPlaceholders = !STRIPE_PUBLISHABLE_KEY || STRIPE_PUBLISHABLE_KEY === "YOUR_STRIPE_PUBLISHABLE_KEY";
    
    export const planThemes = {
      [SUBSCRIPTION_TYPES.FREE]: {
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/40',
        border: 'border-green-500 dark:border-green-600',
        buttonVariant: 'outline',
        buttonClass: 'border-green-600 text-green-700 hover:bg-green-100 dark:text-green-300 dark:border-green-500 dark:hover:bg-green-800/50',
        textColor: 'text-green-800 dark:text-green-200',
        accentColor: 'text-green-600 dark:text-green-400',
      },
      [SUBSCRIPTION_TYPES.BASIC]: {
        bg: 'bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/30 dark:to-sky-900/40',
        border: 'border-blue-500 dark:border-blue-600',
        buttonVariant: 'default',
        buttonClass: 'bg-blue-500 hover:bg-blue-600 text-white',
        textColor: 'text-blue-800 dark:text-blue-200',
        accentColor: 'text-blue-500 dark:text-blue-400',
      },
      [SUBSCRIPTION_TYPES.PREMIUM]: {
        bg: 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/40',
        border: 'border-purple-500 dark:border-purple-600',
        buttonVariant: 'default',
        buttonClass: 'bg-purple-500 hover:bg-purple-600 text-white',
        textColor: 'text-purple-800 dark:text-purple-200',
        accentColor: 'text-purple-500 dark:text-purple-400',
      },
      [SUBSCRIPTION_TYPES.GOLDEN]: {
        bg: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/40',
        border: 'border-yellow-500 dark:border-yellow-600',
        buttonVariant: 'default',
        buttonClass: 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white shadow-lg',
        textColor: 'text-yellow-800 dark:text-yellow-200',
        accentColor: 'text-yellow-500 dark:text-yellow-400',
      },
      default: { 
        bg: 'bg-gray-100 dark:bg-slate-800',
        border: 'border-gray-300 dark:border-slate-700',
        buttonVariant: 'outline',
        buttonClass: 'border-gray-400 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-slate-700',
        textColor: 'text-gray-800 dark:text-gray-200',
        accentColor: 'text-primary dark:text-primary-dark',
      }
    };
    
    export function usePricingPageLogic() {
      const { user } = useAuth();
      const navigate = useNavigate();
      const { toast } = useToast();
      const { language, t } = useLanguage();
      const [isLoadingPlanAction, setIsLoadingPlanAction] = useState(null);
      const [plans, setPlans] = useState([]);
      const [isLoadingPage, setIsLoadingPage] = useState(true);
      const [pageError, setPageError] = useState(null);
    
      const loadPackagesData = useCallback(async () => {
        setIsLoadingPage(true);
        setPageError(null);
        try {
          const fetchedPlans = await getAllPackagesForDisplay(language); 
          
          if (!fetchedPlans || fetchedPlans.length === 0) {
             setPageError(t('pricing.noPlansAvailableError'));
            setPlans([createVirtualFreePackage(language)]); 
          } else {
            setPlans(fetchedPlans.map((plan, index) => {
              const IconComponent = PACKAGE_ICONS[String(plan.id)] || PACKAGE_ICONS.default;
              const price = plan.price_monthly;
              const name = language === 'ar' ? plan.name_ar : plan.name_en;
              const features = language === 'ar' ? plan.features_ar : plan.features_en;
    
              return {
                ...plan,
                id: String(plan.id),
                name: name || (language === 'ar' ? 'باقة غير مسماة' : 'Unnamed Plan'),
                features: features || [],
                theme: planThemes[String(plan.id)] || planThemes.default,
                icon: <IconComponent className="h-10 w-10 mx-auto mb-4" />,
                delay: (index + 1) * 0.1,
                isPopular: String(plan.id) === SUBSCRIPTION_TYPES.PREMIUM,
                price_display: String(plan.id) === SUBSCRIPTION_TYPES.FREE ? t('pricing.free') : `${Number(price).toFixed(2)} ${t('pricing.currencySymbol')}`,
                duration_text: String(plan.id) === SUBSCRIPTION_TYPES.FREE ? t('pricing.alwaysFree') : (plan.duration_days ? (plan.duration_days === 30 ? t('pricing.perMonth') : (plan.duration_days === 365 ? t('pricing.perYear') : `/ ${plan.duration_days} ${t('pricing.days')}`)) : t('pricing.perMonth')),
              };
            }));
          }
        } catch (error) {
          console.error("Failed to fetch plans:", error);
          const description = error.message.includes("column") && error.message.includes("does not exist")
            ? t('pricing.dbConfigError')
            : t('pricing.fetchError');
          setPageError(description);
          toast({
            title: t('pricing.errorTitle'),
            description: description,
            variant: "destructive",
          });
          setPlans([createVirtualFreePackage(language)]); 
        } finally {
          setIsLoadingPage(false);
        }
      }, [toast, language, t]);
    
      useEffect(() => {
        loadPackagesData();
      }, [loadPackagesData]);
    
      const handleChoosePlan = async (plan) => {
        if (!user && plan.id !== SUBSCRIPTION_TYPES.FREE) {
          toast({
            title: t('auth.loginRequiredTitle'),
            description: t('pricing.loginToChoosePlan'),
            variant: "default",
          });
          navigate('/login', { state: { from: '/pricing' } });
          return;
        }
    
        if (plan.id === SUBSCRIPTION_TYPES.FREE) {
          toast({
            title: plan.name,
            description: t('pricing.freePlanSelectedInfo'),
            variant: "info"
          });
          navigate('/submit-dream');
          return;
        }
        
        if (!plan.stripe_price_id) {
          toast({
            title: t('pricing.comingSoonTitle'),
            description: t('pricing.planComingSoon', { planName: plan.name }),
            variant: "default"
          });
          return;
        }
            
        setIsLoadingPlanAction(plan.stripe_price_id); 
    
        if (areKeysPlaceholders || !stripePromise) {
          console.error("Stripe keys are placeholders or Stripe not loaded. Payment cannot proceed.");
          toast({
            title: t('pricing.stripeErrorTitle'),
            description: t('pricing.stripeConfigError'),
            variant: "destructive",
          });
          setIsLoadingPlanAction(null);
          return;
        }
    
        try {
          const stripe = await stripePromise;
          if (!stripe) {
            throw new Error(t('pricing.stripeLoadError'));
          }
          const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: plan.stripe_price_id, quantity: 1 }],
            mode: 'subscription',
            successUrl: `${window.location.origin}/dashboard?subscription_success=true&plan_id=${plan.id}`,
            cancelUrl: `${window.location.origin}/pricing`,
            customerEmail: user.email,
            locale: language === 'ar' ? 'ar' : 'en',
          });
    
          if (error) {
            throw error;
          }
        } catch (error) {
          console.error("Stripe Checkout Error:", error);
          toast({
            title: t('pricing.paymentErrorTitle'),
            description: error.message || t('pricing.paymentProcessError'),
            variant: "destructive",
          });
        } finally {
          setIsLoadingPlanAction(null);
        }
      };
    
      return {
        plans,
        isLoadingPage,
        pageError,
        isLoadingPlanAction,
        handleChoosePlan,
      };
    }
  