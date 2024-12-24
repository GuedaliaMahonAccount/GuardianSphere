import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import './Home.css';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { t } = useTranslation("Home");
    const username = localStorage.getItem('username') || t("defaultUser");
    const navigate = useNavigate();

    // Array of updates for the Hero Box
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

    // State to track the current update index
    const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);

    // Function to handle next update
    const handleNext = () => {
        setCurrentUpdateIndex((prevIndex) =>
            prevIndex === heroUpdates.length - 1 ? 0 : prevIndex + 1
        );
        resetTimer(); // Reset the timer when an arrow is clicked
    };

    // Function to handle previous update
    const handlePrev = () => {
        setCurrentUpdateIndex((prevIndex) =>
            prevIndex === 0 ? heroUpdates.length - 1 : prevIndex - 1
        );
        resetTimer(); // Reset the timer when an arrow is clicked
    };

    // Timer reset function
    const resetTimer = () => {
        clearInterval(interval);
        startTimer();
    };

    // UseEffect to handle the automatic switching
    useEffect(() => {
        startTimer();
        return () => clearInterval(interval);
    }, [interval, startTimer]);

    // Start the timer
    let interval;
    const startTimer = () => {
        interval = setInterval(() => {
            setCurrentUpdateIndex((prevIndex) =>
                prevIndex === heroUpdates.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000); // 5000 milliseconds = 5 seconds
    };

    // Get the current update based on the index
    const currentUpdate = heroUpdates[currentUpdateIndex];

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>{t("welcome", { name: username })}</h1>
                <p>{t("description")}</p>
            </header>

            {/* Add the Stacked Hero Box Here */}
            <div className="hero-container">
                {/* Navigation Arrows */}
                <div className="hero-navigation">
                    <button className="hero-arrow prev" onClick={handlePrev}>
                        ←
                    </button>
                    <button className="hero-arrow next" onClick={handleNext}>
                        →
                    </button>
                </div>

                {/* Top Section */}
                <div className="hero-section top-section">
                    {currentUpdate.type === "headline" && (
                        <>
                            <h1>{currentUpdate.content}</h1>
                            <p>{currentUpdate.description}</p>
                        </>
                    )}
                </div>

                {/* Indicator for Current Headline */}
                <div className="hero-indicator">
                    {heroUpdates.map((update, index) => (
                        <span
                            key={index}
                            className={`hero-indicator-dot ${index === currentUpdateIndex ? "active" : ""}`}
                        ></span>
                    ))}
                </div>
            </div>

            <div className="home-actions">
                {/* Row 1 */}
                <div className="action-row">
                    <div className="action-card" onClick={() => navigate("/chat")}>
                        <h3>{t("chatSupport")}</h3>
                        <p>{t("chatDescription")}</p>
                    </div>
                    <div className="action-card" onClick={() => navigate("/call")}>
                        <h3>{t("callSupport")}</h3>
                        <p>{t("chatDescription")}</p>
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
                {/* Row 2: Groups */}
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

export default Home;//