// import logo from '../../Pictures/logo_transparent.png';
import "./Navbar.css";
import LanguageSelect from "../Selectors/LanguageSelect/LanguageSelect";
// import { useDispatch, useSelector } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser} from "@fortawesome/free-solid-svg-icons";
// import CurrencySelctor from "../Selectors/CurrencySelctor/CurrencySelctor";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  // const dispatch = useDispatch();
  const { t, i18n } = useTranslation("App");
  const isRtl = i18n.language === "he"
  const naviguate = useNavigate();


  const handleLogout = () => {
    // Remove the tokens that were set during login
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  
    // Redirect to login page
    naviguate("/login");
  };
  

  return (
    <nav className="top_navbar">
      {/* <div className="user_selector">
      <img src="Pictures/account_circle.png" alt="user" className="account_circle.png"/>
        <select >
          <option>{t("Profile")}</option>
          <option>{t("Settings")}</option>
          <option>{t("Help")}</option>
          <option>{t("Disconnected")}</option>
        </select>
      </div> */}

      <LanguageSelect />
      {/* <CurrencySelctor /> */}



      <div className={`navbar_settings ${isRtl ? "border_left_side_menu" : " border_right_side_menu"}`}>
      <img className="settings_icon" src="Pictures/settings.png" alt="settings_icon"/>
      </div>


    {/* Logout Button */}
    <Fragment>
  <div className={`logout-container ${isRtl ? "rtl" : "ltr"}`}>
  <button
  
  className="logout-button"
  type="button"
  onClick={(e) => handleLogout(e)}
>
    <img
      className="logout_icon"
      src="Pictures/logout-icon.png"
      alt="logout_icon"
      onClick={(e) => handleLogout(e)}
    />

      {t("logout")}
    </button>
  </div>
</Fragment>



    </nav>
  );
};

export default Navbar;
