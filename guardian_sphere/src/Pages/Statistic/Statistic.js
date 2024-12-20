import React from "react";
import { useTranslation } from "react-i18next";
import './Statistic.css';

const Statistic = () => {
    const { t } = useTranslation("Statistic"); // Namespace 'Statistic' for translations

    return (
        <div className="statistic-container">
            <h1>{t("statistic_title")}</h1>
            <p>{t("statistic_description")}</p>
        </div>
    );
};

export default Statistic;