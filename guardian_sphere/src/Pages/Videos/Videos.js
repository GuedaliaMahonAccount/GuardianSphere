import React from 'react';
import './Videos.css';
import { useTranslation } from "react-i18next";

// when there will be topics, gonna need to do it in english and hebrew. 
const topics = [
  { id: 1, title: "Topic 1", videos: ["Video 1.1", "Video 1.2", "Video 1.3", "Video 1.4", "Video 1.5"] },
  { id: 2, title: "Topic 2", videos: ["Video 2.1", "Video 2.2", "Video 2.3", "Video 2.4", "Video 2.5"] },
  { id: 3, title: "Topic 3", videos: ["Video 3.1", "Video 3.2", "Video 3.3", "Video 3.4", "Video 3.5"] },
  { id: 4, title: "Topic 4", videos: ["Video 4.1", "Video 4.2", "Video 4.3", "Video 4.4", "Video 4.5"] },
];

const Videos = () => {
  const { t } = useTranslation("Videos");
  const [activeTopic, setActiveTopic] = React.useState(null);

  return (
    <div className="videos-container">
      <h2>{t("videos_title")}</h2>
      <p>{t("videos_description")}</p>
      
      {/* Render topic buttons */}
      <div className="topic-buttons">
        {topics.map((topic) => (
          <button
            key={topic.id}
            className="topic-button"
            onClick={() => setActiveTopic(topic.id)}
          >
            {topic.title}
          </button>
        ))}
      </div>
      
      {/* Render videos for the active topic */}
      {activeTopic && (
        <div className="videos-list">
          <h3>{topics.find((topic) => topic.id === activeTopic).title}</h3>
          <ul>
            {topics.find((topic) => topic.id === activeTopic).videos.map((video, index) => (
              <li key={index}>{video}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Videos;
