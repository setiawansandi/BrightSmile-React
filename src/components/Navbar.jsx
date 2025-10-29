import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/icons/logo.svg'; 

const Navbar = () => {
  return (
    <header className="navbar-container">
      <div className="general navbar">
        <Link to="/" className="logo" aria-label="BrightSmile home">
          <img src={logo} alt="Logo" />
          <span>BrightSmile</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;