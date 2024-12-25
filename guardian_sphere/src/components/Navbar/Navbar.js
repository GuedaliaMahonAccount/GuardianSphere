import "./Navbar.css";
import LanguageSelect from "../Selectors/LanguageSelect/LanguageSelect";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getPointsOfMe } from "./navbarReq";

const Navbar = () => {
  const { t, i18n } = useTranslation("App");
  const isRtl = i18n.language === "he";
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const username = localStorage.getItem('username') || t("defaultUser");

  const fetchScore = async () => {
    try {
      const points = await getPointsOfMe();
      setScore(points.points);
    } catch (error) {
      console.error('Failed to fetch score:', error);
    }
  };

  useEffect(() => {
    fetchScore();
    // Poll every 5 seconds for score updates
    const interval = setInterval(fetchScore, 1000);
    return () => clearInterval(interval);
  }, []);

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
        className={`navbar_settings ${isRtl ? "border_left_side_menu" : "border_right_side_menu"
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

      <div ></div>



      {/* Score Button */}
      <div className={`score-button ${isRtl ? "rtl" : "ltr"}`}>
          <div className="score-content">
            <span className="name">{username}, {t("you_get")}</span>
            <span className="score-icon">{score}</span>
            <span className="name">{t("points")}</span>
          </div>
      </div>


    </nav>
  );
};

export default Navbar;
