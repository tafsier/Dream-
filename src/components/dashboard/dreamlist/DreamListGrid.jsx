
import React from 'react';
import DreamCard from '@/components/dashboard/DreamCard';
import { AnimatePresence } from 'framer-motion';

const DreamListGrid = ({ dreams, onViewInterpretation, onDeleteDream, t, language, formatDate }) => {
  if (!dreams || dreams.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        <p>{t('dashboard.noDreamsMatchFilters')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {dreams.map((dream) => (
          <DreamCard
            key={dream.id}
            dream={dream}
            onViewInterpretation={onViewInterpretation}
            onDeleteDream={onDeleteDream}
            t={t}
            language={language}
            formatDate={formatDate}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default DreamListGrid;
