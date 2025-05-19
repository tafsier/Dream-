
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const CTASection = ({ t }) => {
  return (
    <section className="text-center py-12">
      <motion.h2 
          className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
      >
          {t('home.ctaTitle')}
      </motion.h2>
      <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay:0.1 }}
      >
          {t('home.ctaSubtitle')}
      </motion.p>
      <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay:0.2 }}
      >
          <Button size="lg" asChild className="button-primary-gradient group text-lg px-8 py-7">
            <Link to="/submit-dream">
              {t('home.ctaButton')}
              <Zap className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
      </motion.div>
    </section>
  );
};

export default CTASection;
