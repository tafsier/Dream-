
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Facebook, Twitter, Instagram, Linkedin, Youtube, Send } from 'lucide-react';
    import { useLanguage } from '@/contexts/useLanguage';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    
    const Footer = () => {
      const { t, language } = useLanguage();
      const currentYear = new Date().getFullYear();
    
      const socialLinks = [
        { name: 'Facebook', icon: Facebook, href: '#' },
        { name: 'Twitter', icon: Twitter, href: '#' },
        { name: 'Instagram', icon: Instagram, href: '#' },
        { name: 'LinkedIn', icon: Linkedin, href: '#' },
        { name: 'YouTube', icon: Youtube, href: '#' },
      ];
    
      const quickLinks = [
        { name: t('footer.navAbout'), href: '/about' },
        { name: t('footer.navContact'), href: '/contact' },
        { name: t('footer.navFAQ'), href: '/faq' },
        { name: t('footer.navPricing'), href: '/pricing' },
        { name: t('footer.navDreamTypes'), href: '/dream-types' },
        { name: t('footer.navSubmitDream'), href: '/submit-dream' },
      ];
    
      const legalLinks = [
        { name: t('footer.privacyPolicy'), href: '/privacy-policy' },
        { name: t('footer.termsOfService'), href: '/terms-of-service' },
      ];
    
      return (
        <footer className="bg-gradient-to-b from-green-100 to-teal-100 dark:from-slate-800 dark:to-gray-800 text-gray-700 dark:text-gray-300 py-12 border-t border-green-200 dark:border-slate-700">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-primary dark:text-green-400 mb-3">{t('appName')}</h2>
                <p className="text-sm mb-4">{t('footer.description')}</p>
                <div className="flex space-x-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      aria-label={link.name}
                      className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                    >
                      <link.icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>
    
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">{t('footer.quickLinks')}</h3>
                <ul className="space-y-2">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link to={link.href} className="hover:text-primary dark:hover:text-green-400 transition-colors text-sm">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
    
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">{t('footer.legal')}</h3>
                <ul className="space-y-2">
                  {legalLinks.map((link) => (
                    <li key={link.name}>
                      <Link to={link.href} className="hover:text-primary dark:hover:text-green-400 transition-colors text-sm">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
    
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">{t('footer.newsletterTitle')}</h3>
                <p className="text-sm mb-3">{t('footer.newsletterDesc')}</p>
                <form className="flex">
                  <Input
                    type="email"
                    placeholder={t('footer.emailPlaceholder')}
                    className="rounded-r-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    aria-label={t('footer.emailPlaceholder')}
                  />
                  <Button type="submit" variant="default" className="rounded-l-none bg-primary hover:bg-primary/90 dark:bg-green-500 dark:hover:bg-green-600">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
    
            <div className="text-center border-t border-green-200 dark:border-slate-700 pt-8">
              <p className="text-sm">
                {t('footer.rightsReserved', { year: currentYear })}
              </p>
            </div>
          </div>
        </footer>
      );
    };
    
    export default Footer;
  