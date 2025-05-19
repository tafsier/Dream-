
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const HeroSection = ({ t }) => {
  return (
    <motion.section 
      className="text-center py-16 md:py-24 bg-gradient-to-b from-primary/5 dark:from-green-700/10 via-transparent to-transparent rounded-b-3xl -mx-4 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold mb-6"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 100 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-green-600 to-teal-500 dark:from-green-400 dark:via-teal-300 dark:to-sky-400">
            {t('home.heroTitleMain')}
          </span>
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {t('home.heroSubtitle')}
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button size="lg" asChild className="button-primary-gradient group text-lg px-8 py-7">
            <Link to="/submit-dream">
              {t('home.heroCta')}
              <Zap className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
