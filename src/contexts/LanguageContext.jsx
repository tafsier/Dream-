
    import React, { createContext } from 'react';
    import { useLanguageState } from '@/hooks/useLanguageState';
    import { useTranslations } from '@/hooks/useTranslations';
    
    export const LanguageContext = createContext(undefined);
    
    export const LanguageProvider = ({ children }) => {
      const { language, setLanguage, toggleLanguage, direction } = useLanguageState();
      const { t, translations, isLoadingTranslations } = useTranslations(language);
    
      const contextValue = {
        language,
        setLanguage,
        toggleLanguage,
        direction,
        t,
        translations,
        isLoadingTranslations,
      };
    
      return (
        <LanguageContext.Provider value={contextValue}>
          {children}
        </LanguageContext.Provider>
      );
    };
  