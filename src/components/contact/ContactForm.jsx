
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const ContactForm = ({ t }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' }); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ 
            name: formData.name, 
            email: formData.email, 
            subject: formData.subject, 
            message: formData.message,
            is_read: false,
            created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setStatus({ type: 'success', message: t('contact.successMessage') });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setStatus({ type: 'error', message: t('contact.errorMessage') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">{t('contact.formTitle')}</h2>
      {status.message && (
        <Alert variant={status.type === 'error' ? 'destructive' : 'default'} className={`${status.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700' : ''} mb-6`}>
          {status.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{status.type === 'success' ? t('contact.successTitle') : t('contact.errorTitle')}</AlertTitle>
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('contact.formName')}</label>
          <Input type="text" id="name" value={formData.name} onChange={handleChange} placeholder={t('contact.formNamePlaceholder')} required 
                 className="bg-gray-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:ring-primary dark:focus:ring-green-500 focus:border-primary dark:focus:border-green-500"/>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('contact.formEmail')}</label>
          <Input type="email" id="email" value={formData.email} onChange={handleChange} placeholder={t('contact.formEmailPlaceholder')} required 
                 className="bg-gray-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:ring-primary dark:focus:ring-green-500 focus:border-primary dark:focus:border-green-500"/>
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('contact.formSubject')}</label>
          <Input type="text" id="subject" value={formData.subject} onChange={handleChange} placeholder={t('contact.formSubjectPlaceholder')} required 
                 className="bg-gray-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:ring-primary dark:focus:ring-green-500 focus:border-primary dark:focus:border-green-500"/>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('contact.formMessage')}</label>
          <Textarea id="message" rows={5} value={formData.message} onChange={handleChange} placeholder={t('contact.formMessagePlaceholder')} required 
                    className="bg-gray-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:ring-primary dark:focus:ring-green-500 focus:border-primary dark:focus:border-green-500"/>
        </div>
        <Button type="submit" className="w-full button-primary-gradient text-lg py-3" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
              />
              {t('contact.sendingButton')}
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" /> {t('contact.sendButton')}
            </>
          )}
        </Button>
      </form>
    </>
  );
};

export default ContactForm;
