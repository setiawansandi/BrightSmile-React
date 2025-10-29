// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/icons/logo.svg';
import './Footer.css';

const Footer = ({
  brand = 'BrightSmile',
  logoPath = logo,
  description = 'BrightSmile offers gentle, modern dental care with clear guidance and advanced technology. Comfortable visits, from checkups to cosmetic treatments.',
  links = [
    { href: '/', label: 'Home' },
    { href: '/appointment', label: 'Appointment' },
    { href: '/doctors', label: 'Doctors' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
  ],
}) => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left Column */}
        <div className="footer-left">
          <div className="footer-header">
            <img src={logoPath} alt={`${brand} logo`} className="footer-logo" />
            <div className="brand-name">{brand}</div>
          </div>

          <p>{description}</p>
          <p className="copyright">
            © {year} {brand}. All Rights Reserved.
          </p>
        </div>

        {/* Right Column */}
        <div className="footer-right">
          <div className="footer-header">
            <div className="links-title">Quick Links</div>
          </div>

          <ul>
            {links.map((link, index) => (
              <li key={index}>
                {/* Use Link if using React Router, otherwise <a> */}
                <Link to={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
