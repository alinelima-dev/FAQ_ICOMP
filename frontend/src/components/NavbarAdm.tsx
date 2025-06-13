import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaSignOutAlt,
  FaQuestionCircle,
  FaClipboardList,
} from "react-icons/fa";
import "./css/NavbarAdm.css";

const NavbarAdm: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-header">
        <h2 className="navbar-brand">
          FAQIcomp • <span className="admin-text">Admin</span>
        </h2>
      </div>
      <div className="navbar-actions">
        {token && (
          <div className="nav-buttons">
            <Link className="nav-button" to="/adm/perguntas">
              <FaQuestionCircle /> Perguntas
            </Link>
            <Link className="nav-button" to="/adm/categorias">
              <FaClipboardList /> Categorias
            </Link>
            <button className="nav-button logout-button" onClick={handleLogout}>
              <FaSignOutAlt /> Sair
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarAdm;
