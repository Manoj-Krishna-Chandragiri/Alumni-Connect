import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiBriefcase,
  FiBookmark,
  FiUser,
  FiCpu,
  FiFileText,
  FiBarChart2,
  FiCheckCircle,
  FiSettings,
  FiTrendingUp,
  FiPieChart,
} from 'react-icons/fi';

const iconMap = {
  home: FiHome,
  users: FiUsers,
  calendar: FiCalendar,
  briefcase: FiBriefcase,
  bookmark: FiBookmark,
  user: FiUser,
  cpu: FiCpu,
  'file-text': FiFileText,
  'bar-chart': FiBarChart2,
  'check-circle': FiCheckCircle,
  settings: FiSettings,
  'trending-up': FiTrendingUp,
  'pie-chart': FiPieChart,
};

const Sidebar = ({ menuItems, isOpen, onClose }) => {
  const { hasScope, hasAnyScope } = useAuth();
  const location = useLocation();

  const filteredItems = menuItems.filter((item) => {
    if (!item.scope && !item.scopes) return true;
    if (item.scope) return hasScope(item.scope);
    if (item.scopes) return hasAnyScope(item.scopes);
    return true;
  });

  return (
    <>
      {/* Overlay (mobile + when sidebar open over content) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen pt-16 transition-transform duration-300 
          bg-white border-r border-gray-200 w-64 shadow-sm
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto scrollbar-thin">
          <nav className="space-y-1">
            {filteredItems.map((item) => {
              const Icon = iconMap[item.icon] || FiHome;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    isActive ? 'sidebar-item-active' : 'sidebar-item'
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto badge-primary">{item.badge}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
