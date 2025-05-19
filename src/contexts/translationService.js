
import arTranslations from '@/locales/ar.json';
import enTranslations from '@/locales/en.json';

const translationsData = {
  ar: arTranslations,
  en: enTranslations,
};

const getNestedTranslation = (keys, translations) => {
  return keys.reduce((obj, k) => (obj && typeof obj === 'object' && k in obj ? obj[k] : undefined), translations);
};

export const translate = (key, language, options = {}) => {
  const keys = key.split('.');
  
  let text = getNestedTranslation(keys, translationsData[language]);

  if (text === undefined) {
    console.warn(`Translation key "${key}" not found in language "${language}". Trying fallback "en".`);
    text = getNestedTranslation(keys, translationsData['en']);
  }
  
  if (text === undefined) {
    console.error(`Translation key "${key}" not found in language "${language}" or fallback "en". Returning key.`);
    return key;
  }

  if (typeof text === 'string' && Object.keys(options).length > 0) {
    let result = text;
    for (const optKey in options) {
      if (Object.prototype.hasOwnProperty.call(options, optKey)) {
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
  
  return typeof text === 'string' ? text : key;
};

export const getAllTranslationsForLanguage = (language) => {
  return translationsData[language] || translationsData['en'];
};
