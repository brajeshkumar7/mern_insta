import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../slices/globalSlice";
import { RootTypes } from "../../types";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const NavBar: React.FC = () => {
  const dispatch = useDispatch();
  const { hamburger } = useSelector((state: RootTypes) => state.global);
  const location = useLocation();

  const handleSidebar = () => {
    dispatch(toggleSidebar(!hamburger));
  };

  return (
    <div id="navbar" className={`side-bar ${hamburger ? "open" : "close"}`}>
      <div className="menu-section">
        <img alt="avatar" src="./burger-menu.svg" onClick={handleSidebar} />
        <img alt="hamburger" src="./logo512.png" />
      </div>
      <div className="nav-menu">
        <Link to="/" className={location.pathname === "/" ? "selected" : ""}>
          Posts
        </Link>
        <Link to="/post" className={location.pathname === "/post" ? "selected" : ""}>
          Create Post
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
