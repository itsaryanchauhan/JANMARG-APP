import React, { createContext, ReactNode, useContext, useState } from "react";

interface Language {
  code: "en" | "hi";
  name: string;
  flag: string;
}

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  availableLanguages: Language[];
  t: (key: string) => string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
];

// Basic translations
const translations: Record<"en" | "hi", Record<string, string>> = {
  en: {
    welcome: "Reports in your area",
    selectArea: "Select Area",
    myReports: "My Reports",
    anonymous: "Anonymous",
    submitted: "Submitted",
    inProgress: "In Progress",
    resolved: "Resolved",
    selectLanguage: "Select Language",
    search: "Search reports...",
  },
  hi: {
    welcome: "आपके क्षेत्र में रिपोर्ट्स",
    selectArea: "क्षेत्र चुनें",
    myReports: "मेरी रिपोर्ट्स",
    anonymous: "गुमनाम",
    submitted: "जमा किया गया",
    inProgress: "प्रगति में",
    resolved: "हल किया गया",
    selectLanguage: "भाषा चुनें",
    search: "रिपोर्ट खोजें...",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages[0]
  );

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage.code][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        availableLanguages: languages,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
