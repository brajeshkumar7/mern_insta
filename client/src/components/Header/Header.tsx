import React, { useRef } from "react";
import { toggleSidebar } from "../../slices/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootTypes } from "../../types";
import { Dropdown } from "../ui/Dropdown";
import useOutsideClick from "../../hooks/useOutsideClick";
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const { hamburger } = useSelector((state: RootTypes) => state.global);
  const toggleRef = useRef<HTMLImageElement>(null);
  const {
    ref: dropdownRef,
    isVisible: isOpen,
    setIsVisible: setIsOpen,
  } = useOutsideClick(false, toggleRef);

  const handleHamberger = () => {
    dispatch(toggleSidebar(!hamburger));
  };

  const handleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="header-container">
        <div className="header-left">
          <img alt="hamburger" src="./burger-menu.svg" onClick={handleHamberger} />
          <img alt="hamburger" src="./logo512.png" />
        </div>
        <div className="header-center"></div>
        <div className="header-right">
          <img alt="notification" src="./bell.svg" />
          <img alt="profile" src="./avatar.svg" onClick={handleMenu} ref={toggleRef} />
          <div ref={dropdownRef} className="menu-position">
            <Dropdown isOpen={isOpen} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
