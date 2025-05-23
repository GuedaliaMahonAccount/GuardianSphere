import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      // Nouveau chemin relatif pour charger les fichiers JSON
      loadPath: "/assets/i18n/{{ns}}/{{lng}}.json",
    },
    fallbackLng: "en",
    ns: ["App", "Home", "Login"], 
    interpolation: {
      escapeValue: false, // React gère l'échappement
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
