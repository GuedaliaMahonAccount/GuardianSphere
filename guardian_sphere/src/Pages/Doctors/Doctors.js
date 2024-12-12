import React from 'react';
import './Doctors.css';
import { useTranslation } from "react-i18next";

const Doctors = () => {
  const { t } = useTranslation("Doctors");

  const doctors = [
    {
      image: require('./images/doctor1.jpg'),
      name: t("doctor_1_name"),
      description: t("doctor_1_description"),
    },
    {
      image: require('./images/doctor2.jpg'),
      name: t("doctor_2_name"),
      description: t("doctor_2_description"),
    },
    {
      image: require('./images/doctor3.jpg'),
      name: t("doctor_3_name"),
      description: t("doctor_3_description"),
    },
  ];

  return (
    <div className="doctors-container">
      <h2>{t("doctors_title")}</h2>
      <p>{t("doctors_description")}</p>
      {doctors.map((doctor, index) => (
        <div className="doctor-card" key={index}>
          <img
            src={doctor.image}
            alt={doctor.name}
            className="doctor-image"
          />
          <div className="doctor-info">
            <div className="doctor-name">{doctor.name}</div>
            <div className="doctor-description">{doctor.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Doctors;