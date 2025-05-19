
    const importTranslationFile = async (lang, part) => {
      try {
        const module = await import(`@/locales/${lang}/${part}.json`);
        return module.default;
      } catch (error) {
        console.warn(`Could not load translation part "${part}" for language "${lang}":`, error);
        return {}; 
      }
    };
    
    const translationParts = [
      'common', 'navbar', 'footer', 'home', 'submitDream', 
      'pricing', 'dashboard', 'profile', 'settings', 
      'notificationsPage', 'contact', 'dreamTypes', 'faq', 
      'auth', 'notFound'
    ];
    
    export const loadTranslations = async (language) => {
      let langToLoad = language;
      if (langToLoad !== 'ar' && langToLoad !== 'en') {
        console.warn(`Unsupported language "${language}" requested for loading. Defaulting to 'ar'.`);
        langToLoad = 'ar';
      }
    
      const loadedTranslations = {};
      for (const part of translationParts) {
        const partTranslations = await importTranslationFile(langToLoad, part);
        Object.assign(loadedTranslations, partTranslations);
      }
      return loadedTranslations;
    };
    
    const getNestedTranslation = (keys, currentTranslations) => {
      return keys.reduce((obj, k) => (obj && typeof obj === 'object' && k in obj ? obj[k] : undefined), currentTranslations);
    };
    
    export const translate = (key, currentTranslations, options = {}) => {
      const keys = key.split('.');
      let text = getNestedTranslation(keys, currentTranslations);
    
      if (text === undefined) {
        console.warn(`Translation key "${key}" not found. Returning key.`);
        return key;
      }
    
      if (typeof text === 'object' && options.returnObjects) {
        return text;
      }
    
      if (typeof text !== 'string') {
        console.warn(`Translation for key "${key}" is not a string. Returning key. Value:`, text);
        return key;
      }
    
      if (Object.keys(options).length > 0) {
        let result = text;
        for (const optKey in options) {
          if (Object.prototype.hasOwnProperty.call(options, optKey) && optKey !== 'returnObjects') {
            const trimmedOptKey = optKey.trim();
            if (trimmedOptKey !== '') {
              const escapedOptKey = trimmedOptKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              if (escapedOptKey !== '') {
                try {
                  result = result.replace(new RegExp(`{${escapedOptKey}}`, 'g'), options[optKey]);
                } catch (e) {
                  console.error(`Error creating RegExp for key "${escapedOptKey}" in translation "${key}":`, e);
                }
              } else {
                console.warn(`Skipping replacement for an effectively empty (after escaping) option key in translation for "${key}"`);
              }
            } else {
              console.warn(`Skipping replacement for empty or whitespace-only option key in translation for "${key}"`);
            }
          }
        }
        return result;
      }
      return text;
    };
  