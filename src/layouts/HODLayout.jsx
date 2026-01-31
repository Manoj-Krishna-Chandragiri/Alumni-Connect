import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from '../components/shared';
import { SCOPES } from '../constants/roles';

const HODLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      label: 'Home',
      path: '/hod/home',
      icon: 'home',
    },
    {
      label: 'Department Students',
      path: '/hod/students',
      icon: 'users',
      scope: SCOPES.VIEW_STUDENTS,
    },
    {
      label: 'Department Alumni',
      path: '/hod/alumni',
      icon: 'users',
      scope: SCOPES.VIEW_ALUMNI,
    },
    {
      label: 'Department Analytics',
      path: '/hod/analytics',
      icon: 'bar-chart',
      scope: SCOPES.VIEW_DEPARTMENT_ANALYTICS,
    },
    {
      label: 'Events',
      path: '/hod/events',
      icon: 'calendar',
      scope: SCOPES.VIEW_EVENTS,
    },
    {
      label: 'Settings',
      path: '/hod/settings',
      icon: 'settings',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        title="HOD Dashboard"
      />
      
      <Sidebar
        menuItems={menuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default HODLayout;
