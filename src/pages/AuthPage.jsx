import React, { useState, useEffect } from "react";
import LoginForm from "../features/auth/LoginForm";
import RegisterForm from "../features/auth/RegisterForm";
import logo from "../assets/icons/logo.svg";
import styles from "../css/AuthPage.module.css";

const AuthPage = () => {
  const [activeForm, setActiveForm] = useState("login");
  const [showSignupSuccess, setShowSignupSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("signup_errors")) setActiveForm("signup");
    else if (urlParams.get("signup") === "success") {
      setActiveForm("login");
      setShowSignupSuccess(true);
    } else if (urlParams.has("login_error")) setActiveForm("login");
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  const showLogin = () => { setActiveForm("login"); setShowSignupSuccess(false); };
  const showSignup = () => { setActiveForm("signup"); setShowSignupSuccess(false); };

  return (
    <>
      <header className={styles["auth-bar-container"]}>
        <div className={`general ${styles["auth-bar"]}`}>
          <a href="/" className={styles.logo} aria-label="BrightSmile home">
            <img src={logo} alt="Logo" />
            <span>BrightSmile</span>
          </a>
        </div>
      </header>

      <main className={styles["form-wrapper"]}>
        <div className={styles["form-container"]}>
          <div className={styles["toggle-wrapper"]}>
            <div className={styles["toggle-container"]}>
              <button
                id="login-toggle"
                className={`${styles["toggle-btn"]} ${activeForm === "login" ? styles.active : ""}`}
                onClick={showLogin}
              >
                Login
              </button>
              <button
                id="signup-toggle"
                className={`${styles["toggle-btn"]} ${activeForm === "signup" ? styles.active : ""}`}
                onClick={showSignup}
              >
                Sign up
              </button>
            </div>
          </div>

          {showSignupSuccess && (
            <div className={styles["form-success-message"]}>
              <p>Account created successfully! Please log in.</p>
            </div>
          )}

          {activeForm === "login" ? (
            <LoginForm />
          ) : (
            <RegisterForm onSignupSuccess={showLogin} />
          )}
        </div>
      </main>
    </>
  );
};

export default AuthPage;
