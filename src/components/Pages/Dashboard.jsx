// components/Dashboard.js
import React, { useState } from 'react';
import MainContent from '../MainContent';

const Dashboard = ({ user }) => {
  const [activePage, setActivePage] = useState('dashboard-page');

  return (
    <MainContent activePage={activePage} user={user} />
  );
};

export default Dashboard;