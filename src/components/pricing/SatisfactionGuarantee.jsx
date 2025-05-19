
    import React from 'react';
    import { motion } from 'framer-motion';
    import { ShieldCheck, MessageSquare as MessageSquareHeart } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useNavigate } from 'react-router-dom';
    
    const SatisfactionGuarantee = ({ t }) => {
      const navigate = useNavigate();
    
      return (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 md:mt-24 py-12 bg-gradient-to-r from-green-50 via-teal-50 to-cyan-50 dark:from-slate-800 dark:via-gray-800 dark:to-neutral-800 rounded-xl shadow-lg"
        >
          <div className="container mx-auto px-4 text-center">
            <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              {t('pricing.satisfactionGuaranteeTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-8">
              {t('pricing.satisfactionGuaranteeText')}
            </p>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10 dark:border-primary-dark dark:text-primary-dark dark:hover:bg-primary-dark/20"
              onClick={() => navigate('/contact')}
            >
              <MessageSquareHeart className="mr-2 h-5 w-5" />
              {t('pricing.contactSupport')}
            </Button>
          </div>
        </motion.section>
      );
    };
    
    export default SatisfactionGuarantee;
  