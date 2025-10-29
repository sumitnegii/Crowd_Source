import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [notifications] = useState([
    { id: 1, text: "Your question got 5 new answers", time: "2 hours ago" },
    { id: 2, text: "You earned a Helper badge", time: "1 day ago" },
    { id: 3, text: "New feature: CrowdAI is now available", time: "3 days ago" },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-content">
          {/* Left Side: Branding & Navigation */}
          <div className="navbar-left">
            <div
              className="navbar-brand"
              onClick={() => navigate("/")}
            >
              <div className="logo-container">
                <img src="/logo.png" alt="CrowdSource" className="navbar-logo" />
              </div>
              <span className="navbar-title">
                <span className="title-main">Crowd</span>
                <span className="title-accent">Source</span>
              </span>
            </div>

            <div className="navbar-links">
              <NavLink to="/browse" active={location.pathname === "/browse"}>
                <i className="fas fa-compass"></i>
                <span>Browse</span>
              </NavLink>
              <NavLink to="/leaderboard" active={location.pathname === "/leaderboard"}>
                <i className="fas fa-trophy"></i>
                <span>Leaderboard</span>
              </NavLink>
              <NavLink to="/about" active={location.pathname === "/about"}>
                <i className="fas fa-info-circle"></i>
                <span>About</span>
              </NavLink>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="navbar-center">
            <form className="search-container" onSubmit={handleSearch}>
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search questions, topics, or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">Search</button>
            </form>
          </div>

          {/* Right Side: User Actions */}
          <div className="navbar-right">
            {/* Ask Question Button */}
            <button
              className="ask-question-btn"
              onClick={() => navigate("/ask")}
            >
              <i className="fas fa-plus"></i>
              <span>Ask Question</span>
            </button>
            
            {/* Dark/Light Mode Toggle */}
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
            </button>

            {user ? (
              <>
                {/* Notifications */}
                <div className="notification-container">
                  <button
                    className="icon-btn"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <i className="fas fa-bell"></i>
                    <span className="notification-badge">{notifications.length}</span>
                  </button>

                  {showNotifications && (
                    <div className="notification-dropdown">
                      <div className="dropdown-header">
                        <h3>Notifications</h3>
                        <button
                          className="close-dropdown"
                          onClick={() => setShowNotifications(false)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <div className="notification-list">
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div key={notification.id} className="notification-item">
                                    <p>{notification.text}</p>
                                    <span className="notification-time">{notification.time}</span>
                                </div>
                            ))
                        ) : (
                            <div className="no-notifications">
                                <p>No new notifications.</p>
                            </div>
                        )}
                      </div>
                      {notifications.length > 0 && (
                          <div className="dropdown-footer">
                              <button className="view-all-btn">View All</button>
                          </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* User Dropdown */}
                <div className="user-dropdown-container">
                  <button
                    className="user-menu-btn"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <div className="user-avatar">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || user.email} />
                      ) : (
                        <span>{user.email.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="user-name">{user.displayName || user.email.split('@')[0]}</span>
                    <i className={`fas fa-chevron-${showDropdown ? 'up' : 'down'}`}></i>
                  </button>

                  {showDropdown && (
                    <div className="user-dropdown">
                      <Link to="/profile" className="dropdown-item">
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                      </Link>
                      <Link to="/settings" className="dropdown-item">
                        <i className="fas fa-cog"></i>
                        <span>Settings</span>
                      </Link>
                      <Link to="/help" className="dropdown-item">
                        <i className="fas fa-question-circle"></i>
                        <span>Help & Support</span>
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <button
                  className="login-btn"
                  onClick={() => navigate("/login")}
                >
                  <span>Login</span>
                </button>
                <button
                  className="signup-btn"
                  onClick={() => navigate("/signup")}
                >
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className={`mobile-menu-btn ${menuOpen ? 'open' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className="menu-line"></span>
              <span className="menu-line"></span>
              <span className="menu-line"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <NavLink to="/browse" active={location.pathname === "/browse"}>
              <i className="fas fa-compass"></i>
              <span>Browse</span>
            </NavLink>
            <NavLink to="/leaderboard" active={location.pathname === "/leaderboard"}>
              <i className="fas fa-trophy"></i>
              <span>Leaderboard</span>
            </NavLink>
            <NavLink to="/about" active={location.pathname === "/about"}>
              <i className="fas fa-info-circle"></i>
              <span>About</span>
            </NavLink>
            <NavLink to="/ask" active={location.pathname === "/ask"}>
              <i className="fas fa-plus"></i>
              <span>Ask Question</span>
            </NavLink>
            <div className="mobile-divider"></div>
            {user ? (
              <>
                <NavLink to="/profile" active={location.pathname === "/profile"}>
                  <i className="fas fa-user"></i>
                  <span>Profile</span>
                </NavLink>
                <button className="mobile-logout-btn" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button className="mobile-login-btn" onClick={() => navigate("/login")}>
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Login</span>
                </button>
                <button className="mobile-signup-btn" onClick={() => navigate("/signup")}>
                  <i className="fas fa-user-plus"></i>
                  <span>Sign Up</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

const NavLink = ({ to, children, active, className = "" }) => {
  return (
    <Link
      to={to}
      className={`nav-link ${className} ${active ? "active" : ""}`}
    >
      {children}
    </Link>
  );
};

export default Navbar;