import React from 'react';
import './Videos.css';
import { useTranslation } from "react-i18next";

const Videos = () => {
  const { t } = useTranslation("Videos");

  return (
    <div className="videos-container">
      <h2>{t("videos_title")}</h2>
      <p>{t("videos_description")}</p>
      {/* Add your video-related content here */}
    </div>
  );
};

export default Videos;
