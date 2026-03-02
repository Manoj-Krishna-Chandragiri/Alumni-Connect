import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from '../components/shared';
import { SCOPES } from '../constants/roles';

const PrincipalLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const menuItems = [
    {
      label: 'Home',
      path: '/principal/home',
      icon: 'home',
    },
    {
      label: 'All Students',
      path: '/principal/students',
      icon: 'users',
      scope: SCOPES.VIEW_STUDENTS,
    },
    {
      label: 'All Alumni',
      path: '/principal/alumni',
      icon: 'users',
      scope: SCOPES.VIEW_ALUMNI,
    },
    {
      label: 'Institution Analytics',
      path: '/principal/analytics',
      icon: 'pie-chart',
      scope: SCOPES.VIEW_INSTITUTION_ANALYTICS,
    },
    {
      label: 'Events',
      path: '/principal/events',
      icon: 'calendar',
      scope: SCOPES.VIEW_EVENTS,
    },
    {
      label: 'Settings',
      path: '/principal/settings',
      icon: 'settings',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        title="Principal Dashboard"
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

export default PrincipalLayout;
