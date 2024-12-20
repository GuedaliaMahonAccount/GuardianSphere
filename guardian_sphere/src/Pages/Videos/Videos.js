import React from 'react';
import './Videos.css';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Videos = () => {
    const { t } = useTranslation("Videos");
    const [activeTopic, setActiveTopic] = React.useState(null);
    const navigate = useNavigate();

    // Load topics dynamically from i18n
    const topics = t("topics", { returnObjects: true }) || [];

    const activeTopicData = activeTopic !== null
        ? topics.find((topic, index) => index === activeTopic)
        : null;

    return (
        <div className="videos-container">
            {/* כפתור חזרה לעמוד הבית */}
            <button onClick={() => navigate("/home")} className="home-back-button">
                {t("home")}
            </button>

            <h2>{t("videos_title")}</h2>
            <p>{t("videos_description")}</p>

            {/* כפתור חזרה לנושאים */}
            {activeTopic !== null && (
                <button className="back-button" onClick={() => setActiveTopic(null)}>
                    {t("back_button")}
                </button>
            )}

            {/* תצוגת נושאים */}
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

            {/* תצוגת סרטונים */}
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
