import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import { uiText } from '../i18n';
import type { Language } from '../types';

type LanguageContextValue = {
  language: Language;
  copy: (typeof uiText)[Language];
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = useCallback(() => {
    setLanguage((currentLanguage) => (currentLanguage === 'en' ? 'zh' : 'en'));
  }, []);

  const value = useMemo(
    () => ({
      language,
      copy: uiText[language],
      setLanguage,
      toggleLanguage,
    }),
    [language, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return context;
}
