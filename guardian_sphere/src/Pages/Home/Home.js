import React from 'react';
import { useTranslation } from "react-i18next";
import './Home.css';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { t } = useTranslation("Home");
    const username = localStorage.getItem('username') || t("defaultUser");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>{t("welcome", { name: username })}</h1>
                <p>{t("description")}</p>
            </header>
            <div className="home-actions">
                <div className="action-card" onClick={() => navigate("/chat")}>
                    <h3>{t("chatSupport")}</h3>
                    <p>{t("chatDescription")}</p>
                </div>
                <div className="action-card" onClick={() => navigate("/groups")}>
                    <h3>{t("groupsSupport")}</h3>
                    <p>{t("groupsDescription")}</p>
                </div>
                <div className="action-card" onClick={() => navigate("/follow-up")}>
                    <h3>{t("followUpSupport")}</h3>
                    <p>{t("followUpDescription")}</p>
                </div>
                <div className="action-card" onClick={() => navigate("/videos")}>
                    <h3>{t("resources")}</h3>
                    <p>{t("resourcesDescription")}</p>
                </div>
                <div className="action-card" onClick={() => navigate("/doctors")}>
                    <h3>{t("doctorsSupport")}</h3>
                    <p>{t("doctorsDescription")}</p>
                </div>
                <div className="action-card" onClick={() => navigate("/assistance")}>
                    <h3>{t("assistanceSupport")}</h3>
                    <p>{t("assistanceDescription")}</p>
                </div>
            </div>
            <footer className="home-footer">
                <p>{t("footer")}</p>
            </footer>
        </div>
    );
};

export default Home;
