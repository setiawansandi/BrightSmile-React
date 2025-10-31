import React, { useState, useEffect, useRef } from "react";
import PasswordInput from "./PasswordInput";
import { register } from "../../features/auth/authService.js";

import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import styles from "../../css/AuthPage.module.css"; // ✅ use the same module

// --- Validation ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[\p{L}\s]+$/u;

// --- Component ---
const RegisterForm = ({ onSignupSuccess }) => {
  const dobInputRef = useRef(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [initialCountry, setInitialCountry] = useState(null);

  const [passwordReqs, setPasswordReqs] = useState({
    length: false,
    lower: false,
    upper: false,
    number: false,
    symbol: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    api: "",
  });

  // --- Detect country code using IP ---
  useEffect(() => {
    fetch("http://ip-api.com/json/?fields=countryCode")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.countryCode) setInitialCountry(data.countryCode);
        else setInitialCountry("US");
      })
      .catch(() => setInitialCountry("US"));
  }, []);

  // --- Password Validation Effect ---
  useEffect(() => {
    setPasswordReqs({
      length: password.length >= 8,
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^\p{L}\p{N}]/u.test(password),
    });
  }, [password]);

  // --- Validation Functions ---
  const validateNames = () => {
    const isFirstInvalid = firstName !== "" && !nameRegex.test(firstName);
    const isLastInvalid = lastName !== "" && !nameRegex.test(lastName);
    if (isFirstInvalid || isLastInvalid) {
      setErrors((prev) => ({ ...prev, name: "Must consist of letters only" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, name: "" }));
    return true;
  };

  const validateEmail = () => {
    if (email !== "" && !emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Email is invalid" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validatePhone = () => {
    if (phone && !isValidPhoneNumber(phone)) {
      setErrors((prev) => ({ ...prev, phone: "Please enter a valid phone number." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, phone: "" }));
    return true;
  };

  const validateConfirmPassword = () => {
    if (confirmPassword === "" || password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirm: "Passwords do not match." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirm: "" }));
    return true;
  };

  const handleDateClick = () => {
    if (dobInputRef.current) {
      try {
        dobInputRef.current.showPicker();
      } catch {
        /* noop for unsupported browsers */
      }
    }
  };

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, api: "" }));

    const isNameValid = validateNames();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isConfirmValid = validateConfirmPassword();

    const allReqsMet = Object.values(passwordReqs).every(Boolean);
    if (!allReqsMet) {
      setErrors((prev) => ({ ...prev, password: "Password does not meet all requirements." }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isConfirmValid || !allReqsMet) {
      if (!isConfirmValid) {
        setPassword("");
        setConfirmPassword("");
      }
      return;
    }

    const formData = { firstName, lastName, dob, phone, email, password };

    try {
      const newUserData = await register(formData);
      console.log("Signup successful:", newUserData);
      window.location.href = "/";
      // If you want to route without reload, call onSignupSuccess?.()
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        api: error?.message || "Signup failed. Please try again.",
      }));
    }
  };

  return (
    <form id="signup-form" onSubmit={handleSubmit}>
      {errors.api && (
        <span className={`${styles["error-message"]} ${styles["api-error"]}`}>
          {errors.api}
        </span>
      )}

      <div className={styles["name-group"]}>
        <div className={`${styles["input-group"]} ${errors.name ? styles["has-error"] : ""}`}>
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            name="first_name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={validateNames}
          />
          <span className={styles["error-message"]} id="signup-name-error">
            {errors.name}
          </span>
        </div>

        <div className={`${styles["input-group"]} ${errors.name ? styles["has-error"] : ""}`}>
          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            name="last_name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onBlur={validateNames}
          />
        </div>
      </div>

      <div className={styles["input-group"]}>
        <label htmlFor="dob">Date of Birth</label>
        <input
          type="date"
          id="dob"
          name="dob"
          required
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          ref={dobInputRef}
          onClick={handleDateClick}
          onKeyDown={(e) => e.preventDefault()}
        />
      </div>

      <div className={`${styles["input-group"]} ${errors.phone ? styles["has-error"] : ""}`}>
        <label htmlFor="phone">Phone Number</label>

        {initialCountry ? (
          <PhoneInput
            id="phone"
            value={phone}
            onChange={setPhone}
            onBlur={validatePhone}
            defaultCountry={initialCountry}
            international
            countryCallingCodeEditable={false}
          />
        ) : (
          <input
            type="text"
            placeholder="Loading phone input..."
            disabled
            style={{ backgroundColor: "#f9f9f9", cursor: "wait" }}
          />
        )}
        <span className={styles["error-message"]} id="signup-phone-error">
          {errors.phone}
        </span>
      </div>

      <div className={`${styles["input-group"]} ${errors.email ? styles["has-error"] : ""}`}>
        <label htmlFor="signup-email">Email</label>
        <input
          type="email"
          id="signup-email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validateEmail}
        />
        <span className={styles["error-message"]} id="signup-email-error">
          {errors.email}
        </span>
      </div>

      <PasswordInput
        label="Password"
        id="signup-password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      >
        <div className={styles["password-requirements"]} id="signup-req-list">
          <ul>
            <li className={passwordReqs.length ? styles.valid : ""}>
              Must be at least 8 characters long.
            </li>
            <li className={passwordReqs.lower ? styles.valid : ""}>
              Must include at least one lowercase letter.
            </li>
            <li className={passwordReqs.upper ? styles.valid : ""}>
              Must include at least one capital letter.
            </li>
            <li className={passwordReqs.number ? styles.valid : ""}>
              Must include at least one number.
            </li>
            <li className={passwordReqs.symbol ? styles.valid : ""}>
              Must include at least one symbol (e.g., !@#$).
            </li>
          </ul>
        </div>
      </PasswordInput>

      <PasswordInput
        label="Confirm Password"
        id="confirm_password"
        name="confirm_password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onBlur={validateConfirmPassword}
        error={errors.confirm}
      />

      <button type="submit" className={`btn-base ${styles["submit-btn"]}`} name="signup_submit">
        Create Account
      </button>
    </form>
  );
};

export default RegisterForm;
