import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SideMenu.css";
import { useTranslation } from "react-i18next";

function SideMenu() {
  const [menuExpand, setMenuExpand] = useState(false);
  const { t, i18n } = useTranslation("App");

  const isRtl = i18n.language === "he";

  const toggleMenu = () => {
    setMenuExpand(!menuExpand);
    if (!menuExpand) {
      document.body.style.margin = isRtl ? "0 220px 0 0" : "0 0 0 220px";
    } else {
      document.body.style.margin = isRtl ? "0 20px 0 0" : "0 0 0 20px";
    }
  };

  const menuItems = [
    { label: t("home"), path: "/home", icon: "Pictures/home_icon.png" },
    { label: t("groups"), path: "/groups", icon: "Pictures/groups_icon.png" },
    { label: t("follow_up"), path: "/follow-up", icon: "Pictures/follow_up_icon.png" },
    { label: t("videos"), path: "/videos", icon: "Pictures/videos_icon.png" },
    { label: t("doctors"), path: "/doctors", icon: "Pictures/doctors_icon.png" },
    { label: t("assistance"), path: "/assistance", icon: "Pictures/assistance_icon.png" },
  ];

  return (
    <div
      className={`menu_home ${isRtl ? "right" : "left"} ${menuExpand ? "full_size" : "small_size"}`}
    >
      <button
        className={`menu_arrow_button ${menuExpand ? "align_end" : "align_center"}`}
        onClick={toggleMenu}
      >
        {menuExpand ? "\u276E" : "\u276F"}
      </button>
      <div className="logo">
        <div className="transparent_logo"></div>
        {menuExpand && <img src={"Pictures/small_logo_transparent.png"} alt="logo" />}
      </div>
      <nav className="menu_links">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`link ${menuExpand ? "hover_width_fullsize" : "hover_width_small"}`}
          >
            <img src={item.icon} alt={item.label} />
            <Link
              to={item.path}
              className={`router_link_home ${isRtl ? "margin_right_link" : "margin_left_link"}`}
            >
              {item.label}
            </Link>
          </div>
        ))}
      </nav>
    </div>
  );
}

export default SideMenu;
