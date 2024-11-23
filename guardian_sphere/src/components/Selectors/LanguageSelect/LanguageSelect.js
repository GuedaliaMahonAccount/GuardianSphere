import { useTranslation } from "react-i18next";
import i18n from "../../../i18n"; // Chemin vers votre fichier i18n.js
import "./Language.css";

const LanguageSelector = () => {
  const handleLanguageChange = (e) => {
    e.preventDefault();
    console.log(i18n); // Vérifiez que l'instance est initialisée
    i18n.changeLanguage(e.target.value); // Change la langue
  };

  // Gérer l'orientation RTL/LTR pour l'hébreu
  if (i18n.language === "he") {
    document.documentElement.setAttribute("dir", "rtl");
    document.body.setAttribute("dir", "rtl");
  } else {
    document.documentElement.setAttribute("dir", "ltr");
    document.body.setAttribute("dir", "ltr");
  }

  return (
    <div className="select_language_container">
      <img src="Pictures/language.png" alt="language" className="globe_icon" />
      <select
        name="languageSelect"
        onChange={handleLanguageChange}
        value={i18n.language}
      >
        <option value="en">EN</option>
        <option value="he">HE</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
