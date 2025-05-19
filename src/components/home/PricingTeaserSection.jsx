
    import React, { useState, useEffect, useCallback } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { useNavigate } from 'react-router-dom';
    import { Loader2 } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { useLanguage } from '@/contexts/useLanguage';
    import { useAuth } from '@/contexts/AuthContext';
    import { getFeaturedPackages } from '@/services/packageService';
    import { PACKAGE_ICONS, SUBSCRIPTION_TYPES } from '@/lib/constants';
    import { planThemes } from '@/hooks/usePricingPageLogic'; 
    import { loadStripe } from '@stripe/stripe-js';
    
    const PricingTeaserCard = ({ plan, language, onChoosePlan, isLoading }) => {
      const IconComponent = PACKAGE_ICONS[String(plan.id)] || PACKAGE_ICONS.default;
      const theme = planThemes[String(plan.id)] || planThemes.default;
      const name = language === 'ar' ? plan.name_ar : plan.name_en;
      const features = language === 'ar' ? plan.features_ar : plan.features_en;
      const price_display = String(plan.id) === SUBSCRIPTION_TYPES.FREE ? 'مجاناً' : `${Number(plan.price_monthly).toFixed(2)} د.ك`;
      const duration_text = String(plan.id) === SUBSCRIPTION_TYPES.FREE ? 'دائماً' : (plan.duration_days ? (plan.duration_days === 30 ? '/ شهر' : (plan.duration_days === 365 ? '/ سنة' : `/ ${plan.duration_days} يوم`)) : '/ شهر');
    
      return (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: plan.delay }}
          className={`relative flex flex-col p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl border-2 ${theme.bg} ${theme.border}`}
        >
          {plan.isPopular && (
            <div className={`absolute -top-3.5 right-1/2 transform translate-x-1/2 px-4 py-1 text-xs font-semibold text-white rounded-full shadow-md ${theme.accentColor === 'text-purple-500 dark:text-purple-400' ? 'bg-purple-500' : 'bg-primary'}`}>
              الأكثر شيوعًا
            </div>
          )}
          <div className={`mb-5 text-center pt-4 ${theme.accentColor}`}>
            <IconComponent className="h-12 w-12 mx-auto" />
          </div>
          <h3 className={`text-2xl font-semibold text-center mb-2 ${theme.textColor}`}>{name}</h3>
          <div className="text-center mb-6">
            <span className={`text-3xl font-bold ${theme.textColor}`}>{price_display}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{duration_text}</span>
          </div>
          <ul className={`space-y-2 mb-8 flex-grow text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <svg className={`w-4 h-4 flex-shrink-0 ${language === 'ar' ? 'ml-2' : 'mr-2'} ${theme.accentColor}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
              <span>{plan.interpretations_limit === null || plan.interpretations_limit >= 99999 ? 'تفسيرات لا محدودة' : `${plan.interpretations_limit} تفسيرات`}</span>
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className={`w-4 h-4 flex-shrink-0 ${language === 'ar' ? 'ml-2' : 'mr-2'} ${theme.accentColor}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>حد {plan.character_limit === null ? 'غير محدود' : plan.character_limit} حرف</span>
            </li>
            {(features || []).slice(0, 2).map((feature, fIndex) => (
              <li key={fIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className={`w-4 h-4 flex-shrink-0 ${language === 'ar' ? 'ml-2' : 'mr-2'} ${theme.accentColor}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>{typeof feature === 'object' ? feature[language] || feature['en'] : feature}</span>
              </li>
            ))}
          </ul>
          <Button
            onClick={() => onChoosePlan(plan)}
            className={`w-full mt-auto py-2.5 text-base font-medium ${theme.buttonClass || ''}`}
            variant={theme.buttonVariant}
            disabled={isLoading === plan.id}
          >
            {isLoading === plan.id ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : (plan.id === SUBSCRIPTION_TYPES.FREE ? 'ابدأ مجاناً' : 'اختر الخطة')}
          </Button>
        </motion.div>
      );
    };
    
    
    const PricingTeaserSection = () => {
      const { t, language } = useLanguage();
      const navigate = useNavigate();
      const { toast } = useToast();
      const { user } = useAuth();
      const [plans, setPlans] = useState([]);
      const [isLoadingPage, setIsLoadingPage] = useState(true);
      const [isLoadingAction, setIsLoadingAction] = useState(null);
    
      const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "YOUR_STRIPE_PUBLISHABLE_KEY";
      let stripePromise;
      if (STRIPE_PUBLISHABLE_KEY && STRIPE_PUBLISHABLE_KEY !== "YOUR_STRIPE_PUBLISHABLE_KEY") {
        stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
      }
      const areKeysPlaceholders = !STRIPE_PUBLISHABLE_KEY || STRIPE_PUBLISHABLE_KEY === "YOUR_STRIPE_PUBLISHABLE_KEY";
    
      const loadFeaturedPackages = useCallback(async () => {
        setIsLoadingPage(true);
        try {
          const fetchedPlans = await getFeaturedPackages(language, 3);
          setPlans(fetchedPlans.map((plan, index) => ({
            ...plan,
            isPopular: String(plan.id) === SUBSCRIPTION_TYPES.PREMIUM,
            delay: index * 0.1,
          })));
        } catch (error) {
          console.error("Failed to fetch featured plans:", error);
          toast({
            title: t('pricing.errorTitle'),
            description: t('pricing.fetchError'),
            variant: "destructive",
          });
        } finally {
          setIsLoadingPage(false);
        }
      }, [language, t, toast]);
    
      useEffect(() => {
        loadFeaturedPackages();
      }, [loadFeaturedPackages]);
    
      const handleChoosePlan = async (plan) => {
        if (!user && plan.id !== SUBSCRIPTION_TYPES.FREE) {
          toast({ title: t('auth.loginRequiredTitle'), description: t('pricing.loginToChoosePlan'), variant: "default" });
          navigate('/login', { state: { from: '/' } });
          return;
        }
    
        if (plan.id === SUBSCRIPTION_TYPES.FREE) {
          toast({ title: plan.name, description: t('pricing.freePlanSelectedInfo'), variant: "info" });
          navigate('/submit-dream');
          return;
        }
    
        if (!plan.stripe_price_id) {
          toast({ title: t('pricing.comingSoonTitle'), description: t('pricing.planComingSoon', { planName: plan.name }), variant: "default" });
          return;
        }
    
        setIsLoadingAction(plan.id);
    
        if (areKeysPlaceholders || !stripePromise) {
          toast({ title: t('pricing.stripeErrorTitle'), description: t('pricing.stripeConfigError'), variant: "destructive" });
          setIsLoadingAction(null);
          return;
        }
    
        try {
          const stripe = await stripePromise;
          if (!stripe) throw new Error(t('pricing.stripeLoadError'));
          const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: plan.stripe_price_id, quantity: 1 }],
            mode: 'subscription',
            successUrl: `${window.location.origin}/dashboard?subscription_success=true&plan_id=${plan.id}`,
            cancelUrl: `${window.location.origin}/`,
            customerEmail: user.email,
            locale: language === 'ar' ? 'ar' : 'en',
          });
          if (error) throw error;
        } catch (error) {
          toast({ title: t('pricing.paymentErrorTitle'), description: error.message || t('pricing.paymentProcessError'), variant: "destructive" });
        } finally {
          setIsLoadingAction(null);
        }
      };
    
      if (isLoadingPage) {
        return (
          <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800/50 dark:to-slate-900/30">
            <div className="container mx-auto px-4 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{t('pricing.loadingPlans')}</p>
            </div>
          </section>
        );
      }
    
      if (!plans || plans.length === 0) {
        return null; 
      }
    
      return (
        <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800/50 dark:to-slate-900/30">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-4"
            >
              {t('home.pricingSectionTitle')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-xl mx-auto"
            >
              {t('pricing.teaserSubtitle')}
            </motion.p>
    
            <div className={`grid grid-cols-1 ${plans.length === 1 ? 'md:grid-cols-1 max-w-sm mx-auto' : plans.length === 2 ? 'md:grid-cols-2 max-w-2xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
              {plans.map((plan) => (
                <PricingTeaserCard 
                  key={plan.id} 
                  plan={plan} 
                  language={language}
                  onChoosePlan={handleChoosePlan} 
                  isLoading={isLoadingAction}
                />
              ))}
            </div>
    
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: plans.length * 0.1 + 0.2 }}
              className="text-center mt-12"
            >
              <Button variant="ghost" onClick={() => navigate('/pricing')} className="text-lg text-primary hover:text-primary/80 dark:hover:text-primary-dark/80 dark:text-primary-dark font-semibold group">
                {t('home.viewAllPlans')}
                <span className={`inline-block transition-transform group-hover:translate-x-1 ${language === 'ar' ? 'group-hover:-translate-x-1 mr-2' : 'ml-2'}`}>&rarr;</span>
              </Button>
            </motion.div>
          </div>
        </section>
      );
    };
    
    export default PricingTeaserSection;
  