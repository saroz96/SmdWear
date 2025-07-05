import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../../src/stylesheet/Sidebar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  // Navigation items with icons
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/', label: 'View Site', icon: '🌐' },
    { path: '/brands/new', label: 'Add Brand', icon: '➕', adminOnly: true },
    { path: '/brands/get/all', label: 'All Brand', icon: '🏷️', adminOnly: true },
    { path: '/categories/new', label: 'Add Category', icon: '➕', adminOnly: true },
    { path: '/categories/get/all', label: 'All Category', icon: '📂', adminOnly: true },
    { path: '/products/new', label: 'Add Product', icon: '➕', adminOnly: true },
    { path: '/products/get/all', label: 'All Product', icon: '📦', adminOnly: true },
    { path: '/admin/slider/new', label: 'Add Slider', icon: '➕', adminOnly: true },
    { path: '/admin/slider/get/all', label: 'Slider List', icon: '📦', adminOnly: true },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/contact', label: 'Contact', icon: '✉️' },
  ];

  // Filter items based on user role
  const filteredNavItems = currentUser?.role === 'admin'
    ? navItems
    : navItems.filter(item => !item.adminOnly);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo">SMD<span>WEAR</span></div>
        </div>
      </div>

      <div className="sidebar-content">
        <ul className="sidebar-nav">
          {filteredNavItems.map((item) => (
            <li
              key={item.label}
              className={location.pathname === item.path ? 'active' : ''}
              title={item.label}
            >
              <NavLink to={item.path}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
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
              <button onClick={logout} className="btn-logout">
                <i className="bi bi-box-arrow-right"></i>
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="auth-buttons">
              <button className="btn-login">
                <i className="bi bi-box-arrow-in-right"></i>
                <span>Login</span>
              </button>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
