import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from '../components/shared';
import { SCOPES } from '../constants/roles';

const CounsellorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const menuItems = [
    {
      label: 'Home',
      path: '/counsellor/home',
      icon: 'home',
    },
    {
      label: 'Student Directory',
      path: '/counsellor/students',
      icon: 'users',
      scope: SCOPES.VIEW_STUDENTS,
    },
    {
      label: 'Alumni Directory',
      path: '/counsellor/alumni',
      icon: 'users',
      scope: SCOPES.VIEW_ALUMNI,
    },
    {
      label: 'Counselling Insights',
      path: '/counsellor/insights',
      icon: 'bar-chart',
      scope: SCOPES.VIEW_COUNSELLING_INSIGHTS,
    },
    {
      label: 'Events',
      path: '/counsellor/events',
      icon: 'calendar',
      scope: SCOPES.VIEW_EVENTS,
    },
    {
      label: 'Settings',
      path: '/counsellor/settings',
      icon: 'settings',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        title="Counsellor Dashboard"
      />
      
      <Sidebar
        menuItems={menuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CounsellorLayout;
