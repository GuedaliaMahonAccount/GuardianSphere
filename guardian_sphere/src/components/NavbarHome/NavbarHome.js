import "./NavbarHome.css";
import LanguageSelect from "../Selectors/LanguageSelect/LanguageSelect";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NavbarHome = () => {
  const { t, i18n } = useTranslation("App");
  const isRtl = i18n.language === "he";
  const navigate = useNavigate();

  return (
    <nav className="top_navbar1">
      {/* Sélecteur de langue */}
      <LanguageSelect />

      {/* Menu de navigation */}
      <ul className="navbar_menu1">
        <li onClick={() => navigate("/landing")}>{t("Landing")}</li>
        <li onClick={() => navigate("/reviews")}>{t("Testimonials")}</li>
        <li onClick={() => navigate("/login")}>{t("Login")}</li>
        <li onClick={() => navigate("/signup-admin")}>{t("Admin Sign Up")}</li>
      </ul>

      {/* Icone des paramètres */}
      <div
        className={`navbar_settings ${
          isRtl ? "border_left_side_menu1" : "border_right_side_menu1"
        }`}
      >
        <img
          className="settings_icon1"
          src="/Pictures/settings-icon.png"
          alt="Settings Icon"
        />
      </div>
    </nav>
  );
};

export default NavbarHome;
