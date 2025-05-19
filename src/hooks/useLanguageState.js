
    import { useState, useEffect, useCallback } from 'react';
    import { getStoredLanguage, setStoredLanguage } from '@/lib/languageStorage';
    
    export const useLanguageState = () => {
      const [language, setLanguageState] = useState(getStoredLanguage());
      const [direction, setDirection] = useState(language === 'ar' ? 'rtl' : 'ltr');
    
      useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        setStoredLanguage(language);
        setDirection(language === 'ar' ? 'rtl' : 'ltr');
      }, [language]);
    
      const setLanguage = useCallback((lang) => {
        if (lang === 'ar' || lang === 'en') {
          setLanguageState(lang);
        } else {
          console.warn(`Unsupported language: ${lang}. Defaulting to 'ar'.`);
          setLanguageState('ar');
        }
      }, []);
    
      const toggleLanguage = useCallback(() => {
        setLanguageState((prevLang) => (prevLang === 'ar' ? 'en' : 'ar'));
      }, []);
    
      return { language, setLanguage, toggleLanguage, direction };
    };
  