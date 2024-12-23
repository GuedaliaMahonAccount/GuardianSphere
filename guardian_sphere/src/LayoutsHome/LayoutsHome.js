import React from "react";
import { useLocation } from "react-router-dom";
import NavbarHome from "../components/NavbarHome/NavbarHome";

const LayoutHome = ({ children }) => {
  const location = useLocation();

  const isAuthPage = ["/login", "/signup", "/signup-admin", "/landing", "/reviews"].includes(
    location.pathname.toLowerCase()
  );

  return (
    <div className="layout-container">
      {/* Afficher le Navbar */}
      {isAuthPage &&<NavbarHome />}


      <div className="content-container">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default LayoutHome;
