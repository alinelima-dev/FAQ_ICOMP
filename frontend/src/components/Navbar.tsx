import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import "./css/Navbar.css";

interface NavbarProps {
  onSearch?: (valor: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  return (
    <div className="navbar">
      <h2>FAQIcomp</h2>
      <div className="search-box">
        <input
          type="text"
          placeholder="Pesquise aqui."
          onChange={(e) => onSearch?.(e.target.value)}
        />
        <BiSearchAlt2 />
      </div>
    </div>
  );
};

export default Navbar;
