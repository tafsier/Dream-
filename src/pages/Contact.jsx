
    import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
    import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
    import { useLanguage } from '@/contexts/useLanguage';
    import ContactForm from '@/components/contact/ContactForm';
    import ContactInfo from '@/components/contact/ContactInfo';
    
    const Contact = () => {
      const { t } = useLanguage();
    
      return (
        <div className="min-h-screen py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="gradient-text">{t('contact.pageTitle')}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('contact.pageSubtitle')}
            </p>
          </motion.div>
    
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <ContactForm t={t} />
            <ContactInfo t={t} />
          </div>
        </div>
      );
    };
    
    export default Contact;
  