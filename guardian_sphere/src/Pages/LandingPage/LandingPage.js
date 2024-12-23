import React from 'react';
import './LandingPage.css';
import { useTranslation } from "react-i18next";

const LandingPage = () => {
    const { t } = useTranslation("Landing");

    return (
        <div className="landing-container">
            <header className="landing-header">
                <img src="logo192guardian.png" alt="Guardian Sphere Logo" className="landing-logo" />
                <h1>{t("welcomeTitle")}</h1>
                <p>{t("welcomeDescription")}</p>
            </header>

            <section className="highlights">
                <h2>{t("highlightsTitle")}</h2>
                <div className="highlight-cards">
                    <div className="highlight-card">
                        <h3>{t("highlight1Title")}</h3>
                        <p>{t("highlight1Description")}</p>
                    </div>
                    <div className="highlight-card">
                        <h3>{t("highlight2Title")}</h3>
                        <p>{t("highlight2Description")}</p>
                    </div>
                    <div className="highlight-card">
                        <h3>{t("highlight3Title")}</h3>
                        <p>{t("highlight3Description")}</p>
                    </div>
                </div>
            </section>

            <section className="features">
                <h2>{t("featuresTitle")}</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <h3>{t("feature1Title")}</h3>
                        <p>{t("feature1Description")}</p>
                    </div>
                    <div className="feature-card">
                        <h3>{t("feature2Title")}</h3>
                        <p>{t("feature2Description")}</p>
                    </div>
                    <div className="feature-card">
                        <h3>{t("feature3Title")}</h3>
                        <p>{t("feature3Description")}</p>
                    </div>
                </div>
            </section>



            <footer className="landing-footer">
                <p>{t("footerText")}</p>
            </footer>
        </div>
    );
};

export default LandingPage;
