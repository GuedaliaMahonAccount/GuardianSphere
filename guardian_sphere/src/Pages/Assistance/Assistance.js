import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./Assistance.css";

const Assistance = () => {
  const { t } = useTranslation("Assistance");
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const data = {
    hmoAssistance: [
      { name: t("center_a"), phone: "123-456-7890", hours: t("hours_a") },
      { name: t("center_b"), phone: "456-789-0123", hours: t("hours_b") },
      { name: t("center_c"), phone: "789-012-3456", hours: t("hours_c") },
      { name: t("center_d"), phone: "012-345-6789", hours: t("hours_d") },
      { name: t("center_e"), phone: "345-678-9012", hours: t("hours_e") },
      // Add more items to test scrolling
    ],
    resilienceCenters: [
      { name: t("general_support_center"), phone: "999-999-9999" },
      { name: t("location_a"), phone: "111-222-3333" },
      { name: t("location_b"), phone: "444-555-6666" },
      { name: t("location_c"), phone: "777-888-9999" },
      { name: t("location_d"), phone: "000-111-2222" },
      { name: t("location_e"), phone: "333-444-5555" },
      { name: t("location_f"), phone: "666-777-8888" },
    ],
    associations: [
      { name: t("association_a"), phone: "123-123-1234" },
      { name: t("association_b"), phone: "234-234-2345" },
      { name: t("association_c"), phone: "345-345-3456" },
      { name: t("association_d"), phone: "456-456-4567" },
      { name: t("association_e"), phone: "567-567-5678" },
      // Add more items to test scrolling
    ],
  };

  const filterData = (list) =>
    list.filter(
      (item) =>
        (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.phone || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

  const renderView = () => {
    if (!currentView) return null;

    const items = filterData(data[currentView]);
    return (
      <div className="popup">
        <button
          className="close-button"
          onClick={() => {
            setCurrentView(null);
            setSearchQuery("");
          }}
        >
          {t("close")}
        </button>
        <h2>{t(currentView)}</h2>
        <input
          type="text"
          placeholder={t("search_placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <ul className="contact-list">
          {items.length > 0 ? (
            items.map((item, index) => (
              <li key={index}>
                <strong>{item.name}</strong> - {item.phone} ({item.hours || t("no_hours")})
              </li>
            ))
          ) : (
            <li>{t("no_results_found")}</li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <div className="assistance-container">
      <button onClick={() => navigate("/home")} className="home-back-button">
        {t("home")}
      </button>
      <h1>{t("assistance_title")}</h1>
      <div className="buttons-layout">
        {["hmoAssistance", "resilienceCenters", "associations"].map((view) => (
          <button
            key={view}
            className="large-button"
            onClick={() => {
              setCurrentView(view);
              setSearchQuery("");
            }}
          >
            {t(view)}
          </button>
        ))}
      </div>
      {renderView()}
    </div>
  );
};

export default Assistance;
