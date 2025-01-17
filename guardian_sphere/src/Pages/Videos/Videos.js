import React, { useEffect, useState } from 'react';
import './Videos.css';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { incrementContacted } from "../../components/Contact/contactReq";

const Videos = () => {
    const { t } = useTranslation("Videos");
    const [activeTopic, setActiveTopic] = React.useState(null);
    const navigate = useNavigate();

    // Load topics dynamically from i18n
    const topics = t("topics", { returnObjects: true }) || [];

    const activeTopicData = activeTopic !== null
        ? topics.find((topic, index) => index === activeTopic)
        : null;

    // Increase points if the user stays on the page for more than 2 minutes
    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                await increasePoints();
                console.log("User stayed for more than 2 minutes, points increased.");
            } catch (error) {
                console.error("Failed to increase points:", error);
            }
        }, 2 * 60 * 1000); // 2 minutes in milliseconds

        return () => clearTimeout(timer); // Clear the timer if the user leaves the page
    }, []);

    // Function to increase points
    const increasePoints = async () => {
        try {
            // Increment 'contacted' field in the backend
            await incrementContacted();
            console.log('Points incremented successfully');
        } catch (error) {
            console.error('Failed to increment points:', error);
        }
    };

    return (
        <div className="videos-container">
            {/* Home button, visible only when no topic is active */}
            {activeTopic === null && (
                <button onClick={() => navigate("/home")} className="home-back-button">
                    {t("home")}
                </button>
            )}
            <img src="logo192guardian.png" alt="Guardian Sphere Logo" className="landing-logo1" />
            
            <h2>{t("videos_title")}</h2>
            <p>{t("videos_description")}</p>

            {/* Back button, visible only when a topic is active */}
            {activeTopic !== null && (
                <button className="back-button" onClick={() => setActiveTopic(null)}>
                    {t("back_button")}
                </button>
            )}

            {/* List of topics */}
            {activeTopic === null && (
                <div className="topic-buttons">
                    {topics.map((topic, index) => (
                        <div
                            key={index}
                            className="topic-item"
                            onClick={() => setActiveTopic(index)}
                        >
                            {topic.image && (
                                <img
                                    src={topic.image}
                                    alt={topic.topic_title}
                                    className="topic-image"
                                />
                            )}
                            <div className="topic-title">{topic.topic_title}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* List of videos for the active topic */}
            {activeTopicData && (
                <div className="videos-list">
                    <h3>{activeTopicData.topic_title}</h3>
                    <ul>
                        {activeTopicData.videos.map((video, index) => (
                            <li key={index} className="video-item">
                                <h4>{video.video_title}</h4>
                                <iframe
                                    src={video.video_url}
                                    title={video.video_title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Videos;
