import React, { useState } from "react";
import eyeOpenIcon from "../../assets/icons/eye-open.svg";
import eyeCloseIcon from "../../assets/icons/eye-close.svg";
import styles from "../../css/AuthPage.module.css"; // ⬅️ use the same module

const PasswordInput = ({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`${styles["input-group"]} ${error ? styles["has-error"] : ""}`}>
      <label htmlFor={id}>{label}</label>

      <div className={styles["password-wrapper"]}>
        <input
          type={isVisible ? "text" : "password"}
          id={id}
          name={name}
          required
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />

        <button
          type="button"
          className={styles["toggle-password"]}
          onClick={() => setIsVisible((v) => !v)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
        >
          <img
            src={eyeOpenIcon}
            alt=""
            className={`${styles["eye-icon"]} ${isVisible ? styles.hidden : ""}`}
          />
          <img
            src={eyeCloseIcon}
            alt=""
            className={`${styles["eye-slash-icon"]} ${!isVisible ? styles.hidden : ""}`}
          />
        </button>
      </div>

      <span className={styles["error-message"]}>{error}</span>

      {children}
    </div>
  );
};

export default PasswordInput;
