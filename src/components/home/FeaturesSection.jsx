
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Zap, Users, Shield } from 'lucide-react';
    
    const FeatureCard = ({ icon, title, description, delay }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
      >
        <div className="p-3 bg-primary/10 dark:bg-green-500/20 rounded-full mb-4">
          {React.cloneElement(icon, { className: "h-8 w-8 text-primary dark:text-green-400" })}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{description}</p>
      </motion.div>
    );
    
    const iconMap = {
      instant: <Zap />,
      expert: <Users />,
      secure: <Shield />,
    };
    
    const FeaturesSection = ({ t, features = [] }) => {
      return (
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">{t('home.featuresSectionTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <FeatureCard 
                key={feature.id} 
                icon={iconMap[feature.id]} 
                title={t(feature.titleKey)} 
                description={t(feature.descriptionKey)} 
                delay={feature.delay} 
              />
            ))}
          </div>
        </section>
      );
    };
    
    export default FeaturesSection;
  