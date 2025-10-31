import React, { useState } from "react";
import PasswordInput from "./PasswordInput";
import { login } from "./authService";
import styles from "../../css/AuthPage.module.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", api: "" });

  const validateEmail = () => {
    if (email !== "" && !emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Email is invalid" }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", api: "" });

    const isEmailValid = validateEmail();

    if (email === "") {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
      return;
    }

    if (!isEmailValid) return;

    try {
      const userData = await login(email, password);
      console.log("Login successful:", userData);
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);
      setErrors((prev) => ({ ...prev, api: error.message }));
    }
  };

  return (
    <form id="login-form" onSubmit={handleSubmit}>
      {errors.api && (
        <span className={`${styles["error-message"]} ${styles["api-error"]}`}>
          {errors.api}
        </span>
      )}

      <div
        className={`${styles["input-group"]} ${
          errors.email ? styles["has-error"] : ""
        }`}
      >
        <label htmlFor="login-email">Email</label>
        <input
          type="email"
          id="login-email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validateEmail}
        />
        <span className={styles["error-message"]} id="login-email-error">
          {errors.email}
        </span>
      </div>

      <PasswordInput
        label="Password"
        id="login-password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <button
        type="submit"
        name="login_submit"
        className={`btn-base ${styles["submit-btn"]}`}
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
