// components/Pages/Layout.jsx
// This component is no longer used as routing is now handled in App.jsx
// Keeping for reference only

import React from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";

export default function Layout({ user, onLogout }) {
  return (
    <div className="dashboard-container">
      <Sidebar user={user} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header user={user} onLogout={onLogout} />
        <div style={{ flex: 1, padding: "20px" }}>
          {/* Content will be rendered by Router */}
        </div>
      </div>
    </div>
  );
}
