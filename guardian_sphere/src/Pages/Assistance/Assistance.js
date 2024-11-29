import React from 'react';
import './Assistance.css';
import { useTranslation } from "react-i18next";

const Assistance = () => {
  const { t } = useTranslation("Assistance");

  return (
    <div className="assistance-container">
      <h2>{t("assistance_title")}</h2>
      <p>{t("assistance_description")}</p>

      <div className="assistance-info">
        <div className="assistance-item">
          <h3>{t("general_support")}</h3>
          <p>📞 +33 1 23 45 67 89</p>
          <p>🕒 {t("general_support_hours")}</p>
        </div>

        <div className="assistance-item">
          <h3>{t("emergency")}</h3>
          <p>📞 +33 6 98 76 54 32</p>
          <p>🕒 {t("emergency_hours")}</p>
        </div>

        <div className="assistance-item">
          <h3>{t("technical_support")}</h3>
          <p>📞 +33 1 98 76 54 21</p>
          <p>🕒 {t("technical_support_hours")}</p>
        </div>
      </div>
    </div>
  );
};

export default Assistance;
