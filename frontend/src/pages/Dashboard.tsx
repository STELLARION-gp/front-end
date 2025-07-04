import React from 'react';
import DashboardContentArea from '../components/DashboardContentArea';

// Dashboard is now just a wrapper for our DashboardContentArea
const Dashboard: React.FC = () => {
  return <DashboardContentArea />;
};

export default Dashboard;
