import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { ShoppingCart, User, Search } from 'react-feather';
import logoImg from '../assets/logo.jpg';

import '../../src/App.css';
import '../stylesheet/Navbar.css'

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-container">
          <div className="announcement-item">Call us Today +977-98-51189875</div>
          <div className="announcement-divider"></div>
          <div className="announcement-item">Sun-Fri 8:00 - 17:00</div>
          <div className="announcement-divider"></div>
          <div className="announcement-item">Tripureshwor-11, Kathmandu 44600</div>
        </div>
      </div>

      {/* Company Header (Styled Letterhead Area) */}
      <div className="company-header">
        <div className="top-row">
          <span className="pan">PAN No. <strong>609670554</strong></span>
          <span className="reg">Regd. No. <strong>229300/076/077</strong></span>
        </div>

        <div className="middle-row">
          <img src={logoImg} alt="Company Logo" className="logo" />
          <div className="company-title">
            <h1>Surgimed Surgical Suppliers Pvt. Ltd.</h1>
            <p>Tripureshwor, Kathmandu</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-content">
            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
            </button>

            {/* Desktop Navigation */}
            <nav className={`main-navigation ${mobileMenuOpen ? 'open' : ''}`}>
              <ul className="nav-links">
                <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
                <li><a href="/products/view/all">Products</a></li>
                <li><a href="/brands/view/all">Brands</a></li>
                <li><a href="/categories/view/all">Category</a></li>
                <li className="mega-menu">
                  <Link to="/products/view/all" onClick={() => setMobileMenuOpen(false)}>Shop+</Link>
                  <div className="mega-menu-content">
                    <div className="mega-menu-column">
                      <h4>Categories</h4>
                      <Link to="/products/category/men">Men's Wear</Link>
                      <Link to="/products/category/women">Women's Wear</Link>
                      <Link to="/products/category/accessories">Accessories</Link>
                    </div>
                    <div className="mega-menu-column">
                      <h4>Collections</h4>
                      <Link to="/products/collection/summer">Summer Collection</Link>
                      <Link to="/products/collection/winter">Winter Collection</Link>
                      <Link to="/products/collection/new">New Arrivals</Link>
                    </div>
                  </div>
                </li>
                <li><Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link></li>
                <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
              </ul>
            </nav>

            {/* Header Utilities */}
            <div className="header-utils">
              <form className="search-box" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" aria-label="Search">
                  <Search size={18} />
                </button>
              </form>

              <div className="header-actions">
                {currentUser ? (
                  <div className="account-dropdown">
                    <Link to="/account" className="account-btn">
                      <User size={18} />
                      <span className="account-name">{currentUser.firstName}</span>
                    </Link>
                    <div className="dropdown-menu">
                      {currentUser.role === 'admin' && (
                        <Link to="/dashboard">Dashboard</Link>
                      )}
                      <Link to="/account">My Account</Link>
                      <button onClick={handleLogout}>Logout</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="login-btn">
                      Sign In
                    </Link>
                    <Link to="/register" className="btn-primary">
                      Register
                    </Link>
                  </>
                )}
                <Link to="/cart" className="cart-btn">
                  <ShoppingCart size={18} />
                  <span className="cart-count">0</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;