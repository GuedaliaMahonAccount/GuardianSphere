import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import SideMenu from "../components/SideMenu/SideMenu";
import Contact from "../components/Contact/Contact";

const Layout = ({ children }) => {
  const location = useLocation();

  const isLoginPage = location.pathname.toLowerCase() === "/login";
  const isSignUpPage = location.pathname.toLowerCase() === "/signup";
  const isSignUpAdminPage = location.pathname.toLowerCase() === "/signup-admin";
  const isTerms = location.pathname.toLowerCase() === "/terms";
  const outPages = !isLoginPage && !isSignUpPage && !isTerms && !isSignUpAdminPage;

  const isDoctorPage = location.pathname.toLowerCase() === "/doctors";
  const isContact = !isDoctorPage;
  const isStatistic = location.pathname.toLowerCase() === "/statistic";
  const adminPages = !isStatistic;

  return (
    <div className="app-container">
      {/* Card flottante */}
      {outPages && isContact && adminPages && <Contact />}

      {/* Navbar si ce n'est pas une page de connexion/inscription */}
      {outPages && <Navbar />}

      <div className="content-container">
        {outPages && <SideMenu />}
        <main>{children}</main> {/* Contenu des enfants */}
      </div>
    </div>
  );
};

export default Layout;
