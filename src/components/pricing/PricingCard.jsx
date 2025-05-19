
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { SUBSCRIPTION_TYPES } from '@/lib/constants';

const PricingCard = ({ plan, language, onChoosePlan, isLoadingPlanAction }) => {
  const theme = plan.theme || {};
  const IconComponent = plan.icon;


  return (
    <motion.div
      key={plan.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: plan.delay }}
      className={`rounded-xl shadow-lg p-6 md:p-8 flex flex-col relative overflow-hidden ${theme.bg} border-2 ${theme.border} hover:shadow-2xl transition-shadow duration-300 ${plan.isPopular ? 'ring-2 ring-offset-2 ring-offset-background dark:ring-offset-slate-900 ring-purple-500' : ''}`}
    >
      {plan.isPopular && (
        <div className={`absolute top-0 ${language === 'ar' ? 'left-0 rounded-br-lg' : 'right-0 rounded-bl-lg'} bg-purple-500 text-white text-xs font-semibold px-4 py-1 shadow-md`}>
          الأكثر شيوعًا
        </div>
      )}
      <div className={`mb-6 text-center ${theme.accentColor}`}>
        {IconComponent}
      </div>
      <h3 className={`text-2xl font-bold text-center mb-2 ${theme.textColor}`}>{plan.name}</h3>
      <p className={`text-4xl font-extrabold text-center mb-1 ${theme.textColor}`}>
        {plan.price_display}
        {plan.id !== SUBSCRIPTION_TYPES.FREE && <span className="text-base font-normal text-gray-500 dark:text-gray-400">{plan.duration_text}</span>}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-6">
         ({plan.name_en || plan.name || 'Plan Name'})
      </p>
      
      <ul className={`space-y-3 my-8 flex-grow ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        <li className="flex items-center text-gray-700 dark:text-gray-300">
            <CheckCircle className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'} flex-shrink-0 ${theme.accentColor}`} />
            <span>{plan.interpretations_limit === null || plan.interpretations_limit >= 99999 ? 'عدد لا محدود من التفسيرات' : `${plan.interpretations_limit} تفسير`} {plan.id !== SUBSCRIPTION_TYPES.FREE ? (plan.duration_days === 365 ? 'سنوياً' : (plan.duration_days === 30 ? 'شهرياً' : '')) : ''}</span>
        </li>
        <li className="flex items-center text-gray-700 dark:text-gray-300">
            <CheckCircle className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'} flex-shrink-0 ${theme.accentColor}`} />
            <span>حد {plan.character_limit === null ? 'غير محدود من' : plan.character_limit} الأحرف للرؤيا</span>
        </li>
        {(plan.features || []).map((feature, index) => (
          <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
            <CheckCircle className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'} flex-shrink-0 ${theme.accentColor}`} />
            <span>{typeof feature === 'object' ? feature[language] || feature['en'] : feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => onChoosePlan(plan)}
        variant={theme.buttonVariant}
        className={`w-full text-lg py-3 font-semibold mt-auto ${theme.buttonClass || ''} disabled:opacity-70`}
        disabled={isLoadingPlanAction === plan.stripe_price_id || (!plan.stripe_price_id && plan.id !== SUBSCRIPTION_TYPES.FREE)}
      >
        {isLoadingPlanAction === plan.stripe_price_id ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : 
          (plan.id === SUBSCRIPTION_TYPES.FREE ? 'ابدأ الآن مجاناً' : (!plan.stripe_price_id ? 'قريباً' : 'اشترك الآن'))
        }
      </Button>
    </motion.div>
  );
};

export default PricingCard;
