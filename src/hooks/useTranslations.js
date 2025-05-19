
    import { useState, useEffect, useCallback } from 'react';
    import { loadTranslations, translate } from '@/lib/translationService';
    
    export const useTranslations = (language) => {
      const [translations, setTranslations] = useState({});
      const [isLoadingTranslations, setIsLoadingTranslations] = useState(true);
    
      useEffect(() => {
        const fetchTranslations = async () => {
          setIsLoadingTranslations(true);
          try {
            const loadedTranslations = await loadTranslations(language);
            setTranslations(loadedTranslations);
          } catch (error) {
            console.error("Failed to load translations:", error);
            setTranslations({}); 
          } finally {
            setIsLoadingTranslations(false);
          }
        };
    
        fetchTranslations();
      }, [language]);
    
      const t = useCallback((key, options = {}) => {
        if (isLoadingTranslations) {
          return key; 
        }
        return translate(key, translations, options);
      }, [translations, isLoadingTranslations]);
    
      return { t, translations, isLoadingTranslations };
    };
  