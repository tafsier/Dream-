
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Edit3, Brain, FileText } from 'lucide-react';
    
    const HowItWorksStep = ({ icon, title, description, number, delay }) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay }}
        className="relative flex flex-col items-center text-center p-6 bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-lg shadow-md"
      >
        <div className="absolute -top-5 -right-3 bg-primary dark:bg-green-500 text-white h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
          {number}
        </div>
        <div className="mb-4 text-primary dark:text-green-400">
          {React.cloneElement(icon, { className: "h-12 w-12" })}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </motion.div>
    );
    
    const iconMap = {
      submit: <Edit3 />,
      analyze: <Brain />,
      receive: <FileText />,
    };
    
    const HowItWorksSection = ({ t, steps = [] }) => {
      return (
        <section className="bg-gray-100 dark:bg-slate-900/50 py-16 md:py-20 -mx-4 px-4 rounded-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-16">{t('home.howItWorksTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-12 relative">
              <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-1 border-t-2 border-dashed border-primary/50 dark:border-green-500/50 transform -translate-y-1/2"></div>
              {steps.map((step) => (
                  <HowItWorksStep 
                    key={step.id} 
                    icon={iconMap[step.id]} 
                    title={t(step.titleKey)} 
                    description={t(step.descriptionKey)} 
                    number={step.number} 
                    delay={step.delay} 
                  />
              ))}
          </div>
        </section>
      );
    };
    
    export default HowItWorksSection;
  