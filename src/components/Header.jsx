// components/Header.jsx
import React from "react";

export default function Header({ user, onLogout }) {
  return (
    <header className="dashboard-header">

      {/* LEFT: BRAND */}
      <div className="header-left" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <i
          className="fa-solid fa-layer-group"
          style={{ fontSize: "22px", color: "white" }}
        ></i>
        <span className="header-title">EduERP</span>
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="header-right" style={{ display: "flex", alignItems: "center", gap: "18px" }}>

        <i
          className="fa-solid fa-bell"
          style={{ fontSize: "18px", cursor: "pointer", opacity: 0.9 }}
        ></i>

        <span
          className="logout-text"
          onClick={onLogout}
        >
          Logout
        </span>
      </div>
    </header>
  );
}
