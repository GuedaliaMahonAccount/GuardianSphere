import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from "react-i18next";
import './Home.css';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { t } = useTranslation("Home");
    const username = localStorage.getItem('username') || t("defaultUser");
    const navigate = useNavigate();

    const heroUpdates = [
        {
            type: "headline",
            content: t("first_headline"),
            description: t("first_subheadline"),
        },
        {
            type: "headline",
            content: t("second_headline"),
            description: t("second_subheadline"),
        },
        {
            type: "headline",
            content: t("third_headline"),
            description: t("third_subheadline"),
        },
    ];

    const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);
    const intervalRef = useRef(null);

    const startTimer = useCallback(() => {
        intervalRef.current = setInterval(() => {
            setCurrentUpdateIndex((prevIndex) =>
                prevIndex === heroUpdates.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);
    }, [heroUpdates.length]);

    // const resetTimer = useCallback(() => {
    //     if (intervalRef.current) {
    //         clearInterval(intervalRef.current);
    //     }
    //     startTimer();
    // }, [startTimer]);
    //
    // const handleNext = useCallback(() => {
    //     setCurrentUpdateIndex((prevIndex) =>
    //         prevIndex === heroUpdates.length - 1 ? 0 : prevIndex + 1
    //     );
    //     resetTimer();
    // }, [heroUpdates.length, resetTimer]);

    // const handlePrev = useCallback(() => {
    //     setCurrentUpdateIndex((prevIndex) =>
    //         prevIndex === 0 ? heroUpdates.length - 1 : prevIndex - 1
    //     );
    //     resetTimer();
    // }, [heroUpdates.length, resetTimer]);

    useEffect(() => {
        startTimer();
        return () => clearInterval(intervalRef.current);
    }, [startTimer]);

    const currentUpdate = heroUpdates[currentUpdateIndex];

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>{t("welcome", { name: username })}</h1>
                <p>{t("description")}</p>
            </header>

            {/* <div className="hero-container">
                <div className="hero-navigation">
                    <button className="hero-arrow prev" onClick={handlePrev}>
                        ←
                    </button>
                    <button className="hero-arrow next" onClick={handleNext}>
                        →
                    </button>
                </div>

                <div className="hero-section top-section">
                    {currentUpdate.type === "headline" && (
                        <>
                            <h1>{currentUpdate.content}</h1>
                            <p>{currentUpdate.description}</p>
                        </>
                    )}
                </div>

                <div className="hero-indicator">
                    {heroUpdates.map((_, index) => (
                        <span
                            key={index}
                            className={`hero-indicator-dot ${index === currentUpdateIndex ? "active" : ""}`}
                        ></span>
                    ))}
                </div>
            </div> */}

<div className="hero-updates-container">
    <div className="hero-content">
        <h1>{currentUpdate.content}</h1>
        <p>{currentUpdate.description}</p>
    </div>
    <div className="hero-pagination">
        {heroUpdates.map((_, index) => (
            <span
                key={index}
                className={`pagination-dot ${index === currentUpdateIndex ? "active" : ""}`}
                onClick={() => setCurrentUpdateIndex(index)}
            ></span>
        ))}
    </div>
</div>

            <div className="home-actions">
                <div className="action-row">
                    <div className="action-card" onClick={() => navigate("/chat")}>
                        <h3>{t("chatSupport")}</h3>
                        <p>{t("chatDescription")}</p>
                    </div>
                    <div className="action-card" onClick={() => navigate("/call")}>
                        <h3>{t("callSupport")}</h3>
                        <p>{t("callDescription")}</p>
                    </div>
                    <div className="action-card" onClick={() => navigate("/groups")}>
                        <h3>{t("groupsSupport")}</h3>
                        <p>{t("groupsDescription")}</p>
                    </div>
                    <div className="action-card" onClick={() => navigate("/videos")}>
                        <h3>{t("resources")}</h3>
                        <p>{t("resourcesDescription")}</p>
                    </div>
                </div>
                <div className="action-row">
                    <div className="action-card" onClick={() => navigate("/follow-up")}>
                        <h3>{t("followUpSupport")}</h3>
                        <p>{t("followUpDescription")}</p>
                    </div>
                    <div className="action-card" onClick={() => navigate("/assistance")}>
                        <h3>{t("assistanceSupport")}</h3>
                        <p>{t("assistanceDescription")}</p>
                    </div>
                    <div className="action-card" onClick={() => navigate("/doctors")}>
                        <h3>{t("doctorsSupport")}</h3>
                        <p>{t("doctorsDescription")}</p>
                    </div>
                </div>
            </div>

            <footer className="home-footer">
                <p>{t("footer")}</p>
            </footer>
        </div>
    );
};

export default Home;
