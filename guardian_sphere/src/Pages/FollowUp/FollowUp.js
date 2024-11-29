import React from 'react';
import './FollowUp.css';
import { useTranslation } from "react-i18next";

const FollowUp = () => {
  const { t } = useTranslation("FollowUp");

  return (
    <div className="followup-container">
      <h2>{t("followup_title")}</h2>
      <p>{t("followup_description")}</p>
      {/* Add your follow-up content here */}
    </div>
  );
};

export default FollowUp;
