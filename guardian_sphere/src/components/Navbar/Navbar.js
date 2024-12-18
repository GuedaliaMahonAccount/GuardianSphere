import "./Navbar.css";
import LanguageSelect from "../Selectors/LanguageSelect/LanguageSelect";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { t, i18n } = useTranslation("App");
  const isRtl = i18n.language === "he";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="top_navbar">
      <LanguageSelect />

      {/* Settings Icon */}
      <div
        className={`navbar_settings ${
          isRtl ? "border_left_side_menu" : "border_right_side_menu"
        }`}
      >
        <img
          className="settings_icon"
          src="/Pictures/settings-icon.png" /* Chemin absolu */
          alt="Settings Icon"
        />
      </div>

      {/* Logout Button */}
      <Fragment>
        <div className={`logout-container ${isRtl ? "rtl" : "ltr"}`}>
          <button
            className="logout-button"
            type="button"
            onClick={handleLogout}
          >
            <img
              className="logout_icon"
              src="/Pictures/logout-icon-with.png" /* Chemin absolu */
              alt="Logout Icon"
            />
            {t("logout")}
          </button>
        </div>
      </Fragment>
    </nav>
  );
};

export default Navbar;
