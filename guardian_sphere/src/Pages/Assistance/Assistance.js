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
      { name: t("Clalit"), phone: t("*8703,*2708,03-747-2010")},
      { name: t("Makabi"), phone: t("*3555,*3028") },
      { name: t("Leumit"), phone: t("*507,1-700-507-507,02-6335209") },
      { name: t("Meuhedet"), phone: t("*3833") },
    ],
    resilienceCenters: [
      { name: t("general_resilience_center"), phone: t("*5486") },
      { name: t("Ofakim"), phone: "08-992-8438" },
      { name: t("Netivot,Merhavim,Bnei-Shimon"), phone: "055-306-3863" },
      { name: t("Ashkelon"), phone: t("*2452") },
      { name: t("Localities_of_Eshkol_Regional_Council"), phone: "08-996-5264" },
      { name: t("Localities_of_the_Ashkelon_Coast_Regional_Council"), phone: "08-677-5598" },
      { name: t("Localities_of_Sdot_Negev_Regional_Council"), phone: "08-994-1091" },
      { name: t("Settlements_of_Shaar_Hanegev_Regional_Council"), phone: "051-226-6275" },
      { name: t("Bedouin_Society_Resilience_Center"), phone: "072-221-2788" },
      { name: t("Sderot"), phone: t("08-661-1140/50") },
      { name: t("Resilience_centers_in_the_northern_district-Hebrew"), phone: "04-690-0603" },
      { name: t("Resilience_centers_in_the_northern_district-Arabic"), phone: "04-770-2649" },
      { name: t("Resilience_centers_in_the_northern_district-English"), phone: "04-770-2651" },
      { name: t("Resilience_centers_in_the_northern_district-Russian"), phone: "04-770-2650" },
      { name: t("Etzion"), phone: "058-398-9550" },
      { name: t("Binyamin"), phone: "02-584-8600" },
      { name: t("Samaria"), phone: "055-277-9285" },
      { name: t("Judea"), phone: t("02-9969560,055-953-4177") },
      { name: t("Golan"), phone: "04-696-9759" },  
    ],
    associations: [
      { name: t("association_a"), phone: "123-123-1234" },
      { name: t("association_b"), phone: "234-234-2345" },
      { name: t("association_c"), phone: "345-345-3456" },
      { name: t("association_d"), phone: "456-456-4567" },
      { name: t("association_e"), phone: "567-567-5678" },  
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
                📞 {item.phone} 📍 {item.name}{" "}
                {item.hours && `(${item.hours})`}
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
