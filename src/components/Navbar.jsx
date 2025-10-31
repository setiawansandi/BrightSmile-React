import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/icons/logo.svg";
import dropdownArrow from "../assets/icons/dropdown-arrow-black.svg";
import defaultAvatar from "../assets/images/none.png";
import { logout } from "../features/auth/authService";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // (true if you want click-to-toggle)

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev); // not used with :hover dropdown

  const handleLogout = async () => {
    try {
      logout();
      setUser(null);
      setMenuOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const displayName =
    user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Account" : "Account";
  const avatarUrl = user?.avatarUrl || defaultAvatar;

  return (
    <header className={styles["navbar-container"]}>
      <div className={`general ${styles["navbar"]}`}>
        {/* Logo */}
        <Link to="/" className={styles["logo"]} aria-label="BrightSmile home">
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
          <Link to="/auth" className={`btn-base ${styles["btn-login"]}`}>
            Login
          </Link>
        ) : (
          <div className={styles["user-menu"]}>
            <button className={styles["user-profile-trigger"]}>
              <img src={avatarUrl} alt="" className={styles["profile-pic"]} />
              <span className={styles["user-name"]}>{displayName}</span>
              <img src={dropdownArrow} alt="" className={styles["dropdown-arrow-icon"]} />
            </button>

            <div className={styles["user-dropdown"]}>
              <Link to="/dashboard">Dashboard</Link>
              <button
                type="button"
                className={styles["logout-link"]}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
