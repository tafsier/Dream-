
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Users, Target, Eye, TrendingUp, ShieldCheck, HeartHandshake, Brain, Zap } from 'lucide-react';
    import { useLanguage } from '@/contexts/useLanguage';
    
    const StatCard = ({ icon: Icon, label, value, bgColorClass }) => (
      <motion.div
        className={`p-6 rounded-xl shadow-lg flex flex-col items-center text-center ${bgColorClass} text-white transform hover:scale-105 transition-transform duration-300`}
        whileHover={{ y: -5 }}
      >
        <Icon className="w-12 h-12 mb-3" />
        <span className="text-3xl font-bold">{value}</span>
        <span className="text-sm mt-1">{label}</span>
      </motion.div>
    );
    
    const ValueCard = ({ icon: Icon, title, description }) => (
      <motion.div 
        className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
        whileHover={{ y: -5 }}
      >
        <div className="flex items-center mb-3">
          <Icon className="w-8 h-8 text-primary dark:text-green-400 mr-3" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{description}</p>
      </motion.div>
    );
    
    const About = () => {
      const { t } = useLanguage();
    
      const stats = [
        { id: 's1', icon: Eye, label: t('about.stat1Label'), value: '10,000+', bgColorClass: 'bg-gradient-to-br from-green-500 to-teal-600' },
        { id: 's2', icon: Users, label: t('about.stat2Label'), value: '5,000+', bgColorClass: 'bg-gradient-to-br from-teal-500 to-cyan-600' },
        { id: 's3', icon: TrendingUp, label: t('about.stat3Label'), value: '98%', bgColorClass: 'bg-gradient-to-br from-cyan-500 to-sky-600' },
        { id: 's4', icon: Zap, label: t('about.stat4Label'), value: '20+', bgColorClass: 'bg-gradient-to-br from-sky-500 to-indigo-600' },
      ];
    
      const values = [
        { id: 'v1', icon: ShieldCheck, title: t('about.value1Title'), description: t('about.value1Desc') },
        { id: 'v2', icon: HeartHandshake, title: t('about.value2Title'), description: t('about.value2Desc') },
        { id: 'v3', icon: Brain, title: t('about.value3Title'), description: t('about.value3Desc') },
        { id: 'v4', icon: Target, title: t('about.value4Title'), description: t('about.value4Desc') },
      ];
    
      return (
        <div className="space-y-16 py-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{t('about.pageTitle')}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('about.pageSubtitle')}
            </p>
          </motion.section>
    
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <Target className="w-8 h-8 text-primary dark:text-green-400 mr-3" /> {t('about.missionTitle')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                {t('about.missionDesc')}
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <Eye className="w-8 h-8 text-primary dark:text-green-400 mr-3" /> {t('about.visionTitle')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                {t('about.visionDesc')}
              </p>
            </div>
          </motion.section>
    
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800 dark:text-gray-100">{t('about.statsTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <StatCard key={stat.id} icon={stat.icon} label={stat.label} value={stat.value} bgColorClass={stat.bgColorClass} />
              ))}
            </div>
          </motion.section>
    
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800 dark:text-gray-100">{t('about.valuesTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value) => (
                <ValueCard key={value.id} icon={value.icon} title={value.title} description={value.description} />
              ))}
            </div>
          </motion.section>
    
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center mt-16"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">{t('home.ctaTitle')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto">
              {t('home.ctaSubtitle')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors button-primary-gradient"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {t('home.ctaButton')}
            </motion.button>
          </motion.section>
        </div>
      );
    };
    
    export default About;
  