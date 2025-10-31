import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/icons/logo.svg";
import styles from "./Footer.module.css";

const Footer = ({
  brand = "BrightSmile",
  logoPath = logo,
  description = "BrightSmile offers gentle, modern dental care with clear guidance and advanced technology. Comfortable visits, from checkups to cosmetic treatments.",
  links = [
    { href: "/", label: "Home" },
    { href: "/appointment", label: "Appointment" },
    { href: "/doctors", label: "Doctors" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
  ],
}) => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles["footer"]}>
      <div className={styles["footer-content"]}>
        {/* Left Column */}
        <div className={styles["footer-left"]}>
          <div className={styles["footer-header"]}>
            <img
              src={logoPath}
              alt={`${brand} logo`}
              className={styles["footer-logo"]}
            />
            <div className={styles["brand-name"]}>{brand}</div>
          </div>

          <p>{description}</p>
          <p className={styles["copyright"]}>
            © {year} {brand}. All Rights Reserved.
          </p>
        </div>

        {/* Right Column */}
        <div className={styles["footer-right"]}>
          <div className={styles["footer-header"]}>
            <div className={styles["links-title"]}>Quick Links</div>
          </div>

          <ul>
            {links.map((link) => (
              <li key={link.href}>
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
