// import logo from '../../Pictures/logo_transparent.png';
import "./Navbar.css";
import LanguageSelect from "../Selectors/LanguageSelect/LanguageSelect";
import { useDispatch, useSelector } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser} from "@fortawesome/free-solid-svg-icons";
import CurrencySelctor from "../Selectors/CurrencySelctor/CurrencySelctor";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("App");
  const isRtl = i18n.language === "he"




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




    </nav>
  );
};

export default Navbar;
