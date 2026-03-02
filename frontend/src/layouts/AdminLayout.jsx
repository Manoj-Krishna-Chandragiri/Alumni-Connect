import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from '../components/shared';
import { SCOPES } from '../constants/roles';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const menuItems = [
    {
      label: 'Home',
      path: '/admin/home',
      icon: 'home',
    },
    {
      label: 'Verify Alumni',
      path: '/admin/verify-alumni',
      icon: 'check-circle',
      scope: SCOPES.VERIFY_ALUMNI,
    },
    {
      label: 'Manage Users',
      path: '/admin/users',
      icon: 'users',
      scope: SCOPES.MANAGE_USERS,
    },
    {
      label: 'Manage Students',
      path: '/admin/students',
      icon: 'users',
      scope: SCOPES.MANAGE_STUDENTS,
    },
    {
      label: 'Manage Alumni',
      path: '/admin/alumni',
      icon: 'users',
      scope: SCOPES.MANAGE_ALUMNI,
    },
    {
      label: 'Events',
      path: '/admin/events',
      icon: 'calendar',
      scope: SCOPES.MANAGE_EVENTS,
    },
    {
      label: 'System Settings',
      path: '/admin/settings',
      icon: 'settings',
      scope: SCOPES.MANAGE_SYSTEM,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        title="Admin Dashboard"
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

export default AdminLayout;
