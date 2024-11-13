import React from "react";
import Header from "../Header/Header";
import NavBar from "../Sidebar/Sidebar";
import "./Layout.css";

interface layoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<layoutProps> = ({ children }) => {
  return (
    <div className="page-container">
      <Header />
      <NavBar />
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Layout;
