import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const Layout = ({ children }) => {
  const location = useLocation();

  const isLoginPage = location.pathname.toLowerCase() === "/login";
  const isSignUpPage = location.pathname.toLowerCase() === "/signup";
  const isTerms = location.pathname.toLowerCase() === "/terms";
  const outPages = !isLoginPage && !isSignUpPage && !isTerms;

  return (
    <div className="app-container">
      {outPages && <Navbar />}
      <main>{children}</main> {/* Ajout des enfants ici */}
    </div>
  );
};

export default Layout;
