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
            <div className="home-buttons">
                <button onClick={() => navigate("/chat")} className="home-button">{t("chat")}</button>
                <button onClick={() => navigate("/groups")} className="home-button">{t("groups")}</button>
                <button onClick={() => navigate("/follow-up")} className="home-button">{t("followUp")}</button>
                <button onClick={() => navigate("/videos")} className="home-button">{t("videos")}</button>
                <button onClick={() => navigate("/doctors")} className="home-button">{t("doctors")}</button>
                <button onClick={() => navigate("/assistance")} className="home-button">{t("assistance")}</button>
                <button onClick={handleLogout} className="home-button">{t("logout")}</button>
            </div>
            <footer className="home-footer">
                <p>{t("footer")}</p>
            </footer>
        </div>
    );
};

export default Home;
