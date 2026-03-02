import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from '../components/shared';
import { SCOPES } from '../constants/roles';

const AlumniLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const menuItems = [
    {
      label: 'Home',
      path: '/alumni/home',
      icon: 'home',
    },
    {
      label: 'Alumni Directory',
      path: '/alumni/directory',
      icon: 'users',
      scope: SCOPES.VIEW_ALUMNI,
    },
    {
      label: 'Events',
      path: '/alumni/events',
      icon: 'calendar',
      scope: SCOPES.VIEW_EVENTS,
    },
    {
      label: 'Post Jobs',
      path: '/alumni/jobs',
      icon: 'briefcase',
      scope: SCOPES.POST_JOB,
    },
    {
      label: 'Blogs',
      path: '/alumni/blogs',
      icon: 'file-text',
      scope: SCOPES.POST_BLOG,
    },
    {
      label: 'Saved Items',
      path: '/alumni/saved',
      icon: 'bookmark',
    },
    {
      label: 'Profile',
      path: '/alumni/profile',
      icon: 'user',
      scope: SCOPES.EDIT_PROFILE,
    },
    {
      label: 'Settings',
      path: '/alumni/settings',
      icon: 'settings',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        title="Alumni Dashboard"
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

export default AlumniLayout;
