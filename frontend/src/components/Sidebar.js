import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../../src/stylesheet/Sidebar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  // Navigation items with icons
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/brands/new', label: 'Add Brand', icon: '➕' },
    { path: '/brands/get/all', label: 'All Brand', icon: '🏷️' },
    { path: '/categories/new', label: 'Add Category', icon: '➕' },
    { path: '/categories/get/all', label: 'All Category', icon: '📂' },
    { path: '/products/new', label: 'Add Product', icon: '➕' },
    { path: '/products/get/all', label: 'All Product', icon: '📦' },
    { path: '/admin/slider/new', label: 'Add Slider', icon: '➕' },
    { path: '/admin/slider/get/all', label: 'Slider List', icon: '📦' },
    { path: '#about', label: 'About', icon: 'ℹ️' },
    { path: '#contact', label: 'Contact', icon: '✉️' },
  ];

  return (
    <div className="sidebar">
      {/* Logo - Compact version */}
      <div className="sidebar-logo">
        <div className="logo">SMD<span>WEAR</span></div>
      </div>

      {/* Navigation Links */}
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li
            key={item.label}
            className={location.pathname === item.path ? 'active' : ''}
            title={item.label}  // Add tooltip
          >
            <a href={item.path}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="sidebar-auth">
        {currentUser ? (
          <div className="user-section">
            <div className="user-profile">
              <div className="user-avatar">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.firstName} />
                ) : (
                  <span>{currentUser.firstName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="user-details">
                <div className="user-name">{currentUser.firstName} {currentUser.lastName}</div>
                <div className="user-email">{currentUser.email}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="btn-logout"
              aria-label="Logout"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="btn-login">
              <i className="bi bi-box-arrow-in-right"></i>
              <span>Login</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;