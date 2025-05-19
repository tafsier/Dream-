
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { useLanguage } from '@/contexts/useLanguage';
    import { CheckCircle, AlertTriangle, MessageSquare, BookOpen, ShieldAlert, Star, Info } from 'lucide-react';
    
    const DreamTypeCard = ({ icon: Icon, titleKey, descriptionKey, characteristicsKeys, t, iconColorClass = "text-primary dark:text-green-400" }) => {
      const title = t(titleKey);
      const description = t(descriptionKey);
      const characteristics = characteristicsKeys.map(key => t(key));
    
      return (
        <motion.div
          className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <Icon className={`w-10 h-10 mr-4 ${iconColorClass}`} />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed flex-grow">{description}</p>
          {characteristics.length > 0 && (
            <>
              <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('dreamTypes.characteristicsTitle')}</h3>
              <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400 list-disc list-inside mb-4">
                {characteristics.map((char, index) => (
                  <li key={index}>{char}</li>
                ))}
              </ul>
            </>
          )}
        </motion.div>
      );
    };
    
    const DreamTypes = () => {
      const { t } = useLanguage();
    
      const dreamTypesData = [
        { id: 'true', icon: CheckCircle, titleKey: 'dreamTypes.trueDreamTitle', descriptionKey: 'dreamTypes.trueDreamDesc', characteristicsKeys: ['dreamTypes.trueChar1', 'dreamTypes.trueChar2', 'dreamTypes.trueChar3'], iconColorClass: "text-green-500 dark:text-green-400" },
        { id: 'devil', icon: AlertTriangle, titleKey: 'dreamTypes.devilDreamTitle', descriptionKey: 'dreamTypes.devilDreamDesc', characteristicsKeys: ['dreamTypes.evilChar1', 'dreamTypes.evilChar2', 'dreamTypes.evilChar3'], iconColorClass: "text-red-500 dark:text-red-400" },
        { id: 'self', icon: MessageSquare, titleKey: 'dreamTypes.selfDreamTitle', descriptionKey: 'dreamTypes.selfDreamDesc', characteristicsKeys: ['dreamTypes.selfTalkChar1', 'dreamTypes.selfTalkChar2', 'dreamTypes.selfTalkChar3'], iconColorClass: "text-blue-500 dark:text-blue-400" },
        { id: 'symbolic', icon: BookOpen, titleKey: 'dreamTypes.symbolicTitle', descriptionKey: 'dreamTypes.symbolicDesc', characteristicsKeys: ['dreamTypes.symbolicChar1', 'dreamTypes.symbolicChar2'], iconColorClass: "text-purple-500 dark:text-purple-400" },
        { id: 'warning', icon: ShieldAlert, titleKey: 'dreamTypes.warningTitle', descriptionKey: 'dreamTypes.warningDesc', characteristicsKeys: ['dreamTypes.warningChar1', 'dreamTypes.warningChar2', 'dreamTypes.warningChar3'], iconColorClass: "text-yellow-500 dark:text-yellow-400" },
        { id: 'prophetic', icon: Star, titleKey: 'dreamTypes.propheticTitle', descriptionKey: 'dreamTypes.propheticDesc', characteristicsKeys: ['dreamTypes.propheticChar1', 'dreamTypes.propheticChar2', 'dreamTypes.propheticChar3'], iconColorClass: "text-amber-500 dark:text-amber-400" },
      ];
    
      return (
        <div className="space-y-12 py-8">
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{t('dreamTypes.pageTitle')}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('dreamTypes.pageSubtitle')}
            </p>
          </motion.section>
    
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dreamTypesData.map((type, index) => (
              <motion.div key={type.id} custom={index} initial="hidden" animate="visible" variants={{
                hidden: { opacity: 0, y: 20 },
                visible: (i) => ({
                  opacity: 1,
                  y: 0,
                  transition: { delay: i * 0.1, duration: 0.5 }
                })
              }}>
                <DreamTypeCard {...type} t={t} />
              </motion.div>
            ))}
          </div>
    
          <motion.section 
            className="bg-primary-soft dark:bg-slate-800/50 p-8 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dreamTypesData.length * 0.1, duration: 0.5 }}
          >
            <div className="flex items-start">
              <Info className="w-8 h-8 text-primary dark:text-green-400 mr-4 shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-semibold text-primary-dark dark:text-green-300 mb-3">{t('dreamTypes.importanceTitle')}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{t('dreamTypes.importanceDesc')}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">{t('dreamTypes.referenceText')}</p>
              </div>
            </div>
          </motion.section>
    
          <motion.section
            className="text-center py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (dreamTypesData.length + 1) * 0.1, duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('dreamTypes.ctaTitle')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">{t('dreamTypes.ctaSubtitle')}</p>
            <Button asChild size="lg" className="button-primary-gradient text-lg px-8 py-4">
              <Link to="/submit-dream">{t('dreamTypes.ctaButton')}</Link>
            </Button>
          </motion.section>
        </div>
      );
    };
    
    export default DreamTypes;
  