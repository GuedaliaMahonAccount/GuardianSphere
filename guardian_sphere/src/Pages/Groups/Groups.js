import React from 'react';
import './Groups.css';
import { useTranslation } from "react-i18next";

const Groups = () => {
  const { t } = useTranslation("Groups");

  return (
    <div className="groups-container">
      <h2>{t("groups_title")}</h2>
      <p>{t("groups_description")}</p>
      {/* Add your group-related content here */}
    </div>
  );
};

export default Groups;
