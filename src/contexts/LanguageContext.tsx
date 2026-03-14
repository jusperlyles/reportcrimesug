import { createContext, useContext, useState, type ReactNode } from "react";

type Lang = "en" | "lg" | "sw";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    reportCrime: "Report Crime",
    getHelp: "Get Help",
    lostAndFound: "Lost & Found",
    missingPersons: "Missing Persons",
    searchStations: "Search Stations",
    lawsAndRights: "Laws & Rights",
    settings: "Settings",
    notifications: "Notifications",
    signOut: "Sign Out",
    signIn: "Sign In",
    language: "Language",
    profile: "Profile",
    emergency: "Emergency",
    submitReport: "Submit Report",
    description: "Description",
    location: "Location",
    detect: "Detect",
    submitting: "Submitting...",
    reportSubmitted: "Report Submitted",
    crimeType: "Crime Type",
    voiceRecording: "Voice Recording",
    startRecording: "Start Recording",
    stopRecording: "Stop Recording",
    reportMissingPerson: "Report Missing Person",
    reportMissingProperty: "Report Missing Property",
    continueWithGoogle: "Continue with Google",
    email: "Email",
    password: "Password",
    welcomeBack: "Welcome back",
    createAccount: "Create an account",
    appearance: "Appearance",
  },
  lg: {
    dashboard: "Dashiboodi",
    reportCrime: "Loopa Musango",
    getHelp: "Funa Obuyambi",
    lostAndFound: "Ebyabuzze n'Ebyazuuliddwa",
    missingPersons: "Abantu Ababuzze",
    searchStations: "Noonya Sitesoni",
    lawsAndRights: "Amateeka n'Eddembe",
    settings: "Enteekateeka",
    notifications: "Ebiragiro",
    signOut: "Fuluma",
    signIn: "Yingira",
    language: "Olulimi",
    profile: "Profaayiro",
    emergency: "Amangu",
    submitReport: "Waayo Alipoota",
    description: "Ennnyonyola",
    location: "Ekifo",
    detect: "Zuula",
    submitting: "Ewayo...",
    reportSubmitted: "Alipoota Eweddwa",
    crimeType: "Ekika ky'omusango",
    voiceRecording: "Okukwata Eddoboozi",
    startRecording: "Tandika Okukwata",
    stopRecording: "Komya Okukwata",
    reportMissingPerson: "Loopa Omuntu Abuzze",
    reportMissingProperty: "Loopa Ebintu Ebibuzze",
    continueWithGoogle: "Weyongereko ne Google",
    email: "Imeeyilo",
    password: "Ekigambo ekyama",
    welcomeBack: "Tukusanyukidde",
    createAccount: "Koola akawunti",
    appearance: "Endabika",
  },
  sw: {
    dashboard: "Dashibodi",
    reportCrime: "Ripoti Uhalifu",
    getHelp: "Pata Msaada",
    lostAndFound: "Vilivyopotea na Kupatikana",
    missingPersons: "Watu Waliopotea",
    searchStations: "Tafuta Kituo",
    lawsAndRights: "Sheria na Haki",
    settings: "Mipangilio",
    notifications: "Arifa",
    signOut: "Toka",
    signIn: "Ingia",
    language: "Lugha",
    profile: "Wasifu",
    emergency: "Dharura",
    submitReport: "Tuma Ripoti",
    description: "Maelezo",
    location: "Mahali",
    detect: "Gundua",
    submitting: "Inatuma...",
    reportSubmitted: "Ripoti Imetumwa",
    crimeType: "Aina ya Uhalifu",
    voiceRecording: "Kurekodi Sauti",
    startRecording: "Anza Kurekodi",
    stopRecording: "Acha Kurekodi",
    reportMissingPerson: "Ripoti Mtu Aliyepotea",
    reportMissingProperty: "Ripoti Mali Iliyopotea",
    continueWithGoogle: "Endelea na Google",
    email: "Barua pepe",
    password: "Neno la siri",
    welcomeBack: "Karibu tena",
    createAccount: "Tengeneza akaunti",
    appearance: "Mwonekano",
  },
};

const langNames: Record<Lang, string> = { en: "English", lg: "Luganda", sw: "Swahili" };

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  langNames: Record<Lang, string>;
  allLangs: Lang[];
}

const LangContext = createContext<LangContextType>({
  lang: "en", setLang: () => {}, t: (k) => k,
  langNames, allLangs: ["en", "lg", "sw"],
});

export const useLang = () => useContext(LangContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem("app_lang") as Lang) || "en"
  );

  const changeLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("app_lang", l);
  };

  const t = (key: string) => translations[lang]?.[key] || translations.en[key] || key;

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t, langNames, allLangs: ["en", "lg", "sw"] }}>
      {children}
    </LangContext.Provider>
  );
}
