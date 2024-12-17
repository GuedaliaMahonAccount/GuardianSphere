import React from 'react';
import './Videos.css';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Videos = () => {
  const { t } = useTranslation("Videos");
  const [activeTopic, setActiveTopic] = React.useState(null);
  const navigate = useNavigate();

  // Topics loaded dynamically from i18n
  const topics = [
    {
      id: 1,
      title: t("topic_1_title"),
      image: require('./images/topic1.jpg'),
      videos: [
        { title: t("topic_1_video_1"), url: t("topic_1_video_1_url") },
        { title: t("topic_1_video_2"), url: t("topic_1_video_2_url") },
        { title: t("topic_1_video_3"), url: t("topic_1_video_3_url") },
        { title: t("topic_1_video_4"), url: t("topic_1_video_4_url") },
        { title: t("topic_1_video_5"), url: t("topic_1_video_5_url") },
      ],
    },
    {
      id: 2,
      title: t("topic_2_title"),
      image: require('./images/topic2.jpg'),
      videos: [
        { title: t("topic_2_video_1"), url: t("topic_2_video_1_url") },
        { title: t("topic_2_video_2"), url: t("topic_2_video_2_url") },
        { title: t("topic_2_video_3"), url: t("topic_2_video_3_url") },
        { title: t("topic_2_video_4"), url: t("topic_2_video_4_url") },
        { title: t("topic_2_video_5"), url: t("topic_2_video_5_url") },
      ],
    },
  ];

  return (
    <div className="videos-container">
      <button onClick={() => navigate("/home")} className="home-back-button">{t("home")}</button>
      <h2>{t("videos_title")}</h2>
      <p>{t("videos_description")}</p>

      {/* כפתור חזרה */}
      {activeTopic && (
        <button className="back-button" onClick={() => setActiveTopic(null)}>
          {t("back_button")}
        </button>
      )}

      {/* Render topic images */}
      {!activeTopic && (
        <div className="topic-buttons">
          {topics.map((topic) => (
            <div key={topic.id} onClick={() => setActiveTopic(topic.id)}>
              <img src={topic.image} alt={topic.title} className="topic-image" />
              <div className="topic-title">{topic.title}</div>
            </div>
          ))}
        </div>
      )}

      {/* Render videos for the active topic */}
      {activeTopic && (
        <div className="videos-list">
          <h3>{topics.find((topic) => topic.id === activeTopic).title}</h3>
          <ul>
            {topics.find((topic) => topic.id === activeTopic).videos.map((video, index) => (
              <li key={index}>
                <h4>{video.title}</h4>
                <iframe
                  src={video.url}
                  title={video.title}
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
