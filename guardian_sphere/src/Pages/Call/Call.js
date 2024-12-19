import React from 'react';
import { useTranslation } from "react-i18next";
import './Call.css';
import { useNavigate } from "react-router-dom";

const Call = () => {
    const { t } = useTranslation("Call");
    const username = localStorage.getItem('username') || t("defaultUser");
    const navigate = useNavigate();

    return (
        <div className="call-container">
        </div>
    );
}

export default Call;