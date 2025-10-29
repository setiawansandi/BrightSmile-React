// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/icons/logo.svg';
import dropdownArrow from '../assets/icons/dropdown-arrow-black.svg';
import defaultAvatar from '../assets/images/none.png';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  // Example user — replace with your auth logic (context or API)
  const [user, setUser] = useState({
    fullName: 'Unknown',
    avatarUrl: ''
  });

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      // Example: if you store a token in localStorage
      localStorage.removeItem('authToken');

      // Clear local user state
      setUser(null);

      // Navigate back to home
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const displayName = user?.fullName || 'Account';
  const avatarUrl = user?.avatarUrl || defaultAvatar;

  return (
    <header className="navbar-container">
      <div className="general navbar">
        {/* Logo */}
        <Link to="/" className="logo" aria-label="BrightSmile home">
          <img src={logo} alt="Logo" />
          <span>BrightSmile</span>
        </Link>

        {/* Navigation */}
        <nav>
          <Link to="/">Home</Link>
          <Link to="/appointment">Appointment</Link>
          <Link to="/doctors">Doctors</Link>
          <Link to="/services">Services</Link>
          <Link to="/about">About</Link>
        </nav>

        {/* Auth section */}
        {!user ? (
          // Logged out
          <Link to="/auth" className="btn-base btn-login">Login</Link>
        ) : (
          // Logged in
          <div className="user-menu">
            <button
              className="user-profile-trigger"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={toggleMenu}
            >
              <img src={avatarUrl} alt="" className="profile-pic" />
              <span className="user-name">{displayName}</span>
              <img src={dropdownArrow} alt="" className="dropdown-arrow-icon" />
            </button>

            {menuOpen && (
              <div className="user-dropdown" role="menu" aria-label="User menu">
                <Link to="/dashboard" role="menuitem">Dashboard</Link>
                <button
                  type="button"
                  className="logout-link"
                  onClick={handleLogout}
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
