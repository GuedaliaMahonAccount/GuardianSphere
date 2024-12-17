import React, { useState } from "react";
import "./Assistance.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Assistance = () => {
  const { t } = useTranslation("Assistance");
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const hmoNumbers = [
    { name: t("center_a"), phone: "123-456-7890", hours: t("hours_a") },
    { name: t("center_b"), phone: "456-789-0123", hours: t("hours_b") },
    { name: t("center_c"), phone: "789-012-3456", hours: t("hours_c") },
    { name: t("center_d"), phone: "012-345-6789", hours: t("hours_d") },
    { name: t("center_e"), phone: "345-678-9012", hours: t("hours_e") },
    // Add more items to test scrolling
  ];

  const resilienceCenters = [
    { name: t("location_a"), phone: "111-222-3333" },
    { name: t("location_b"), phone: "444-555-6666" },
    { name: t("location_c"), phone: "777-888-9999" },
    { name: t("location_d"), phone: "000-111-2222" },
    { name: t("location_e"), phone: "333-444-5555" },
    { name: t("location_f"), phone: "666-777-8888" },
    // Add more items to test scrolling
  ];

  const associations = [
    { name: t("association_a"), phone: "123-123-1234" },
    { name: t("association_b"), phone: "234-234-2345" },
    { name: t("association_c"), phone: "345-345-3456" },
    { name: t("association_d"), phone: "456-456-4567" },
    { name: t("association_e"), phone: "567-567-5678" },
    // Add more items to test scrolling
  ];

  const getFilteredList = () => {
    const items =
      currentView === "hmo-assistance"
        ? hmoNumbers
        : currentView === "resilience-centers"
        ? resilienceCenters
        : associations;

    return items.filter((item) =>
      (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.phone || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderPopupView = () => {
    const filteredList = getFilteredList();

    return (
      <div className="popup">
        <button className="close-button" onClick={() => setCurrentView("")}>
          {t("close")}
        </button>
        <h2 className="popup-heading">
          {currentView === "hmo-assistance"
            ? t("hmo_assistance")
            : currentView === "resilience-centers"
            ? t("resilience_centers")
            : t("associations")}
        </h2>
        <input
          type="text"
          placeholder={t("search_placeholder")}
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="scroll-container">
          <ul className="contact-list">
            {filteredList.length > 0 ? (
              filteredList.map((item, index) => (
                <li key={index}>
                  📞 {item.phone} {item.hours ? <br /> : ""}
                  {item.hours && `🕒 ${item.hours}`}
                  {item.provider ? <br /> : ""}
                  {item.provider && `${t("provided_by")}: ${item.provider}`}
                  {item.name && `📍 ${item.name}`}
                </li>
              ))
            ) : (
              <li>{t("no_results_found")}</li>
            )}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="assistance-container">
      <button onClick={() => navigate("/home")} className="home-back-button">{t("home")}</button>
      <h2 className="main-heading">{t("assistance_title")}</h2>
      <div className="buttons-layout">
        <button
          className="large-button"
          onClick={() => {
            setCurrentView("hmo-assistance");
            setSearchQuery("");
          }}
        >
          {t("hmo_assistance")}
        </button>
        <button
          className="large-button"
          onClick={() => {
            setCurrentView("resilience-centers");
            setSearchQuery("");
          }}
        >
          {t("resilience_centers")}
        </button>
        <button
          className="large-button"
          onClick={() => {
            setCurrentView("associations");
            setSearchQuery("");
          }}
        >
          {t("associations")}
        </button>
      </div>
      {currentView && renderPopupView()}
    </div>
  );
};

export default Assistance;
