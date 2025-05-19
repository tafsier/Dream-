
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactInfoItem = ({ icon, title, content }) => (
  <div className="flex items-start space-x-3 rtl:space-x-reverse">
    <div className="flex-shrink-0 text-primary dark:text-green-400 mt-1">{icon}</div>
    <div>
      <h3 className="font-semibold text-gray-800 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{content}</p>
    </div>
  </div>
);

const ContactInfo = ({ t }) => {
  const contactDetails = [
    { icon: <Mail className="h-5 w-5" />, title: t('contact.emailTitle'), content: t('contact.emailContent') },
    { icon: <Phone className="h-5 w-5" />, title: t('contact.phoneTitle'), content: t('contact.phoneContent') },
    { icon: <MapPin className="h-5 w-5" />, title: t('contact.addressTitle'), content: t('contact.addressContent') },
  ];

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">{t('contact.contactInfoTitle')}</h2>
      <div className="space-y-6">
        {contactDetails.map((item, index) => (
          <ContactInfoItem key={index} icon={item.icon} title={item.title} content={item.content} />
        ))}
      </div>
    </>
  );
};

export default ContactInfo;
