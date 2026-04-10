// components/Pages/Layout.jsx
import React from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import MainContent from "../MainContent";

export default function Layout({ user, onLogout, activePage, setActivePage }) {
  return (
    <div className="dashboard-container">
      
      {/* Sidebar */}
      <Sidebar
        user={user}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Right side */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header user={user} onLogout={onLogout} />
        <MainContent activePage={activePage} user={user} setActivePage={setActivePage} />
      </div>

    </div>
  );
}
