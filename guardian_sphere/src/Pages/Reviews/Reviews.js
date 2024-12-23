import React from "react";
import "./Reviews.css"; // Style spécifique à cette page
import { useTranslation } from "react-i18next";

const Reviews = () => {
  const { t } = useTranslation("Reviews");

  return (
    <div className="reviews-container">
      <header className="reviews-header">
        <h1>{t("reviewsTitle")}</h1>
        <p>{t("reviewsSubtitle")}</p>
      </header>

      <div className="reviews-content">
        {/* Ajoutez une boucle ici pour afficher des témoignages dynamiques */}
        <div className="review-card">
          <p>{t("review1")}</p>
          <h4>{t("review1Author")}</h4>
        </div>
        <div className="review-card">
          <p>{t("review2")}</p>
          <h4>{t("review2Author")}</h4>
        </div>
        {/* Ajoutez d'autres témoignages ici */}
      </div>
    </div>
  );
};

export default Reviews;
