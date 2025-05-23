import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./SideMenu.css";
import { useTranslation } from "react-i18next";

function SideMenu() {
  const [menuExpand, setMenuExpand] = useState(false);
  const [adminExpand, setAdminExpand] = useState(false); // État pour développer/réduire la section admin
  const { t, i18n } = useTranslation("App");

  const isRtl = i18n.language === "he";
  const userRole = localStorage.getItem("role");

  const toggleMenu = () => {
    setMenuExpand(!menuExpand);
    if (!menuExpand) {
      document.body.style.margin = isRtl ? "0 220px 0 0" : "0 0 0 220px";
    } else {
      document.body.style.margin = isRtl ? "0 20px 0 0" : "0 0 0 20px";
    }
  };

  const toggleAdminMenu = () => {
    setAdminExpand(!adminExpand);
  };

  const menuItems = [
    { label: t("home"), path: "/home", icon: "Pictures/home_icon.png", className: "home_icon_margin" },
    { label: t("chat"), path: "/chat", icon: "Pictures/chat_icon.png", className: "icon" },
    { label: t("call"), path: "/call", icon: "Pictures/call_icon.png", className: "icon" },
    { label: t("groups"), path: "/groups", icon: "Pictures/groups_icon.png", className: "icon" },
    { label: t("follow_up"), path: "/follow-up", icon: "Pictures/follow_up_icon.png", className: "icon" },
    { label: t("videos"), path: "/videos", icon: "Pictures/videos_icon.png", className: "icon" },
    { label: t("doctors"), path: "/doctors", icon: "Pictures/doctors_icon.png", className: "icon" },
    { label: t("assistance"), path: "/assistance", icon: "Pictures/assistance_icon.png", className: "icon" },
  ];

  const adminItems = [
    { label: t("statistic"), path: "/statistic", icon: "Pictures/statistic_icon.png", className: "icon" },
    { label: t("organisation"), path: "/organisation", icon: "Pictures/organisation_icon.png", className: "icon" },
    { label: t("unban"), path: "/unban", icon: "Pictures/unbaned_icon.png", className: "icon" },
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
          <NavLink
            key={index}
            to={item.path}
            className={`link ${menuExpand ? "hover_width_fullsize" : "hover_width_small"} ${item.className || ""}`}
            activeClassName="active"
          >
            <img className="logo_tab" src={item.icon} alt={item.label} />
            <span
              className={`router_link_home ${isRtl ? "margin_right_link" : "margin_left_link"}`}
            >
              {item.label}
            </span>
          </NavLink>
        ))}

        {/* Admin Section */}
        {userRole === "admin" && (
          <div className="admin_section">
            <div
              className={`admin_header ${menuExpand ? "full_size" : "small_size"}`}
              onClick={toggleAdminMenu}
            >
              <img
                src="Pictures/admin_icon.png"
                alt={t("admin")}
                className="admin_icon"
              />
              <span>{menuExpand && t("admin")}</span>
              <span>{menuExpand && (adminExpand ? "\u276E" : "\u276F")}</span>
            </div>
            {adminExpand &&
              adminItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={`link admin_link ${menuExpand ? "hover_width_fullsize" : "hover_width_small"} ${
                    item.className || ""
                  }`}
                  activeClassName="active"
                >
                  <img className="logo_tab" src={item.icon} alt={item.label} />
                  <span
                    className={`router_link_home ${isRtl ? "margin_right_link" : "margin_left_link"}`}
                  >
                    {item.label}
                  </span>
                </NavLink>
              ))}
          </div>
        )}
      </nav>
    </div>
  );
}

export default SideMenu;
