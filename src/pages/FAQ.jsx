
    import React, { useState } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { ChevronDown, HelpCircle } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { useLanguage } from '@/contexts/useLanguage';
    
    const FaqItem = ({ qKey, aKey, t }) => {
      const [isOpen, setIsOpen] = useState(false);
      const question = t(qKey);
      const answer = t(aKey);
    
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-b border-gray-200 dark:border-slate-700"
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex justify-between items-center w-full py-5 px-1 text-left text-lg font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75 rounded-md"
            aria-expanded={isOpen}
          >
            <span>{question}</span>
            <ChevronDown
              className={`w-5 h-5 text-primary dark:text-green-400 transform transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="py-4 px-1 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    };
    
    const FAQ = () => {
      const { t } = useLanguage();
    
      const faqData = [
        { id: 'q1', qKey: 'faq.q1Title', aKey: 'faq.q1Answer' },
        { id: 'q2', qKey: 'faq.q2Title', aKey: 'faq.q2Answer' },
        { id: 'q3', qKey: 'faq.q3Title', aKey: 'faq.q3Answer' },
        { id: 'q4', qKey: 'faq.q4Title', aKey: 'faq.q4Answer' },
        { id: 'q5', qKey: 'faq.q5Title', aKey: 'faq.q5Answer' },
        { id: 'q6', qKey: 'faq.q6', aKey: 'faq.a6' },
      ];
    
      return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <HelpCircle className="w-16 h-16 text-primary dark:text-green-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="gradient-text">{t('faq.pageTitle')}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              {t('faq.pageSubtitle')}
            </p>
          </motion.div>
    
          <div className="space-y-4">
            {faqData.map((item) => (
              <FaqItem key={item.id} qKey={item.qKey} aKey={item.aKey} t={t} />
            ))}
          </div>
    
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: faqData.length * 0.1 + 0.3, duration: 0.5 }}
            className="mt-16 text-center p-8 bg-primary-soft dark:bg-slate-800/50 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              {t('faq.contactUsPrompt')}
            </h2>
            <Button asChild size="lg" className="button-primary-gradient">
              <Link to="/contact">{t('faq.contactUsButton')}</Link>
            </Button>
          </motion.div>
        </div>
      );
    };
    
    export default FAQ;
  