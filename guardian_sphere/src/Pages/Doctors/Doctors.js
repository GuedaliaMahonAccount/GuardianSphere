import React from 'react';
import './Doctors.css';
import { useTranslation } from "react-i18next";

const Doctors = () => {
  const { t } = useTranslation("Doctors");

  return (
    <div className="doctors-container">
      <h2>{t("doctors_title")}</h2>
      <p>{t("doctors_description")}</p>
      {/* Add your content here */}
    </div>
  );
};

export default Doctors;
