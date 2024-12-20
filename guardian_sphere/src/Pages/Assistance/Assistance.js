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
      { name: t("Clalit"), phone: t("*8703,*2708,03-747-2010") },
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
      {
        name: t("Localities_of_the_Ashkelon_Coast_Regional_Council"),
        phone: "08-677-5598",
      },
      { name: t("Localities_of_Sdot_Negev_Regional_Council"), phone: "08-994-1091" },
      {
        name: t("Settlements_of_Shaar_Hanegev_Regional_Council"),
        phone: "051-226-6275",
      },
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
      { name: t("ALUT"), phone: "03-670-3077", description: t("ALUT_explain") },
      { name: t("ERAN"), phone: "1201", description: t("ERAN_explain") },
      { name: t("NATAL"), phone: "1-800-363-363", description: t("NATAL_explain") },
      { name: t("METIVTA"), phone: t("*2837"), description: t("METIVTA_explain") },
      { name: t("Hashivem"), phone: t("*3251"), description: t("Hashivem_explain") },
      { name: t("Ask_Me"), phone: "053-789-3424", description: t("Ask_Me_explain") },
      { name: t("Akshiva"), phone: "02-376-4763", description: t("Akshiva_explain") },
      { name: t("SAHAR"), phone: "055-9571399", description: t("SAHAR_explain") },
      { name: t("Makshivim"), phone: t("*3596"), description: t("Makshivim_explain") },
      { name: t("Derekh_Gever"), phone: "079-699-9004", description: t("Derekh_Gever_explain") },
      { name: t("TAFSAN"), phone: "058-579-7888", description: t("TAFSAN_explain") },
      { name: t("Elem"), phone: "054-942-4062", description: t("Elem_explain") },
      { name: t("Nefesh_Ahat"), phone: t("*8944"), description: t("Nefesh_Ahat_explain") },
      { name: t("Hava_Center"), phone: "052-666-8799", description: t("Hava_Center_explain") },
      { name: t("Duet_Center"), phone: "054-750-3970", description: t("Duet_Center_explain") },
      { name: t("FEMALE_SEXUAL_HELP"), phone: "1202", description: t("FEMALE_SEXUAL_HELP_explain") },
      { name: t("MALE_SEXUAL_HELP"), phone: "1203", description: t("MALE_SEXUAL_HELP_explain") },
      { name: t("CBT"), phone: "050-404-0983", description: t("CBT_explain") },
      { name: t("Ezer_MiZion"), phone: "1800-808-100", description: t("Ezer_MiZion_explain") },
      { name: t("BAR_ILAN"), phone: "03-531-8811", description: t("BAR_ILAN_explain") },
      { name: t("Likhyot"), phone: "0747-800-380", description: t("Likhyot_explain") },
      { name: t("new_immigrants"), phone: "3201", description: t("new_immigrants_explain") },
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

    let items = filterData(data[currentView]);

    // Separate general_resilience_center if present
    let generalCenter = null;
    if (currentView === "resilienceCenters") {
      generalCenter = data.resilienceCenters.find(
        (item) => item.name === t("general_resilience_center")
      );
      items = items.filter((item) => item.name !== t("general_resilience_center"));
    }

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
          {/* Always render the general_resilience_center first */}
          {generalCenter && (
            <li>{`${generalCenter.name} 📞 ${generalCenter.phone}`}</li>
          )}

          {/* Render filtered results */}
          {items.length > 0 ? (
            items.map((item, index) => (
              <li key={index}>
                📞 {item.phone} 📍 {item.name}{" "}
                {item.description && <div>{item.description}</div>}
              </li>
            ))
          ) : (
            // Show no results message below the general_resilience_center
            <li className="no-results-message">
              {t("no_results_found")}
            </li>
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
