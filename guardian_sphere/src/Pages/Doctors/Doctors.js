import React from 'react';
import './Doctors.css';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Doctors = () => {
  const { t } = useTranslation("Doctors");
  const navigate = useNavigate();

    const doctors = [
        {
            image: require('./images/maleDoctor.png'),
            name: t("doctor_1_name"),
            location: t("doctor_1_location"),
            description: t("doctor_1_description"),
            link: t("doctor_1_link"),
        },
        {
            image: require('./images/maleDoctor.png'),
            name: t("doctor_2_name"),
            location: t("doctor_2_location"),
            description: t("doctor_2_description"),
            link: t("doctor_2_link"),
        },
        {
            image: require('./images/maleDoctor.png'),
            name: t("doctor_3_name"),
            location: t("doctor_3_location"),
            description: t("doctor_3_description"),
            link: t("doctor_3_link"),
        },
    ];

    return (
        <div className="doctors-container">
            <button onClick={() => navigate("/home")} className="home-back-button">{t("home")}</button>
            <img src="logo192guardian.png" alt="Guardian Sphere Logo" className="landing-logo1" />
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
                        <div className="doctor-location">{doctor.location}</div>
                        <div className="doctor-description">{doctor.description}</div>
                        <a href={doctor.link} className="doctor-link" target="_blank" rel="noopener noreferrer">{t("learn_more")}</a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Doctors;