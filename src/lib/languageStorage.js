
export const getStoredLanguage = () => {
  try {
    const storedLang = localStorage.getItem('appLanguage');
    return storedLang && (storedLang === 'ar' || storedLang === 'en') ? storedLang : 'ar';
  } catch (error) {
    console.error("Error reading language from localStorage:", error);
    return 'ar'; 
  }
};

export const setStoredLanguage = (language) => {
  try {
    localStorage.setItem('appLanguage', language);
  } catch (error) {
    console.error("Error saving language to localStorage:", error);
  }
};
