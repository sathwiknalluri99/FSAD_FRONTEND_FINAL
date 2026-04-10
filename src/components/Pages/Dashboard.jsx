// components/Dashboard.js
import React, { useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import MainContent from '../MainContent';
import Footer from '../Footer';

const Dashboard = ({ user, onLogout }) => {
  const [activePage, setActivePage] = useState('dashboard-page');

  return (
    <div className="dashboard">
      <Header user={user} onLogout={onLogout} activePage={activePage} setActivePage={setActivePage} />
      <div className="dashboard-content">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <MainContent activePage={activePage} user={user} />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;