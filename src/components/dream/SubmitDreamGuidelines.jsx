
import React from 'react';
import { motion } from 'framer-motion';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

const GuidelineItem = ({ children, icon: Icon = Info, colorClass = "text-primary dark:text-green-400" }) => {
  return (
    <motion.li 
      className="flex items-start space-x-3 rtl:space-x-reverse"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Icon className={`h-5 w-5 ${colorClass} mt-0.5 shrink-0`} />
      <span className="text-gray-700 dark:text-gray-300 text-sm">{children}</span>
    </motion.li>
  );
};

const SubmitDreamGuidelines = ({ t }) => {
  const guidelines = t('submitDream.guidelines.points', { returnObjects: true });
  const importantNote = t('submitDream.guidelines.importantNote');

  return (
    <motion.div 
      className="mb-10 p-6 bg-gradient-to-br from-sky-50 via-teal-50 to-green-50 dark:from-slate-800 dark:via-slate-800/80 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <Info className="h-7 w-7 text-primary dark:text-green-400 mr-3" />
        {t('submitDream.guidelines.title')}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {t('submitDream.guidelines.intro')}
      </p>
      <ul className="space-y-3 mb-6">
        {Array.isArray(guidelines) && guidelines.map((item, index) => (
          <GuidelineItem key={index} icon={CheckCircle} colorClass="text-green-500 dark:text-green-400">
            {item}
          </GuidelineItem>
        ))}
      </ul>
      {importantNote && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3 rtl:mr-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <span className="font-semibold">{t('submitDream.guidelines.importantNoteTitle')}:</span> {importantNote}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SubmitDreamGuidelines;
