
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Anchor } from 'lucide-react';

const PropheticGuidanceCard = ({ title, items, t }) => (
  <Card className="bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
    <CardHeader className="bg-gradient-to-r from-primary/10 to-green-500/10 dark:from-slate-700 dark:to-slate-700/80 p-4 border-b dark:border-slate-600">
      <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
        <Anchor className="h-6 w-6 mr-2 text-primary dark:text-green-400" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 space-y-3">
      {items.map((item, index) => (
        <div key={index} className="text-sm">
          {item.type === 'hadith' && (
            <blockquote className="border-r-4 border-primary dark:border-green-500 pr-3 py-1 bg-gray-50 dark:bg-slate-700/50 rounded">
              <p className="italic text-gray-700 dark:text-gray-300 leading-relaxed">“{item.text}”</p>
              {item.narrator && <footer className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('home.propheticGuidance.narratorLabel')}: {item.narrator}</footer>}
              {item.source && <footer className="text-xs text-gray-500 dark:text-gray-400">{t('home.propheticGuidance.sourceLabel')}: {item.source}</footer>}
            </blockquote>
          )}
          {item.type === 'quote' && (
            <blockquote className="border-r-4 border-teal-500 dark:border-teal-400 pr-3 py-1 bg-gray-50 dark:bg-slate-700/50 rounded">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.text}</p>
              <footer className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('home.propheticGuidance.scholarLabel')}: {item.author}</footer>
            </blockquote>
          )}
          {item.type === 'paragraph' && <p className="text-gray-700 dark:text-gray-300">{item.text}</p>}
          {item.type === 'list' && (
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 pl-2">
              {item.items.map((li, idx) => <li key={idx}>{li}</li>)}
            </ul>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
);

const PropheticGuidanceSection = ({ t, guidanceData }) => {
  if (!guidanceData || typeof guidanceData !== 'object') {
    return null; 
  }

  return (
    <section>
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">{guidanceData.mainTitle}</h2>
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-xl">
        <h3 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-200 mb-6">{guidanceData.tocTitle}</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.values(guidanceData)
            .filter(section => typeof section === 'object' && section.title && Array.isArray(section.content))
            .map((section, index) => (
              <PropheticGuidanceCard key={index} title={section.title} items={section.content} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropheticGuidanceSection;
