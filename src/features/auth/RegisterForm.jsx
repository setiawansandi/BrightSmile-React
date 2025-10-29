import React, { useState, useEffect, useRef } from 'react';
import PasswordInput from './PasswordInput';
import { register } from '../../features/auth/authService.js';

import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// --- Validation ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[\p{L}\s]+$/u;

// --- Component ---
const RegisterForm = ({ onSignupSuccess }) => {
  const dobInputRef = useRef(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [initialCountry, setInitialCountry] = useState(null);

  const [passwordReqs, setPasswordReqs] = useState({
    length: false,
    lower: false,
    upper: false,
    number: false,
    symbol: false,
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    api: '',
  });

  // --- Detect country code using IP ---
  useEffect(() => {
    fetch("http://ip-api.com/json/?fields=countryCode")
      .then((res) => res.json())
      .then((data) => {
        console.log("IP API Response:", data);

        if (data && data.countryCode) {
          setInitialCountry(data.countryCode);
        } else {
          setInitialCountry('US');
        }
      })
      .catch((err) => {
        console.error("Failed to fetch IP-based country.", err);
        setInitialCountry('US');
      });
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

  const validateNames = () => {
    const isFirstInvalid = firstName !== '' && !nameRegex.test(firstName);
    const isLastInvalid = lastName !== '' && !nameRegex.test(lastName);
    if (isFirstInvalid || isLastInvalid) {
      setErrors(prev => ({ ...prev, name: 'Must consist of letters only' }));
    } else {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const validateEmail = () => {
    if (email === '') {
      setErrors(prev => ({ ...prev, email: '' }));
    } else if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Email is invalid' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const validatePhone = () => {
    if (phone && !isValidPhoneNumber(phone)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number.' }));
    } else {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateConfirmPassword = () => {
    if (confirmPassword && password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirm: 'Passwords do not match.' }));
    } else {
      setErrors(prev => ({ ...prev, confirm: '' }));
    }
  };

  const handleDateClick = () => {
    if (dobInputRef.current) {
      try {
        dobInputRef.current.showPicker();
      } catch (error) {
        console.error("Error showing date picker:", error);
      }
    }
  };

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    validateNames();
    validateEmail();
    validatePhone();
    validateConfirmPassword();

    const allReqsMet = Object.values(passwordReqs).every(Boolean);
    if (!allReqsMet) {
      setErrors(prev => ({ ...prev, password: 'Password does not meet all requirements.' }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
    }

    if (errors.name || errors.email || errors.phone || errors.confirm || !allReqsMet) {
      console.log('Client-side validation failed');
      return;
    }

    const formData = { firstName, lastName, dob, phone, email, password };
    console.log('Submitting registration with:', formData);

    /*
    // --- THIS IS WHERE YOU'LL CALL YOUR API ---
    try {
      const newUserData = await register(formData);
      console.log('Signup successful:', newUserData);
      
      // Call the prop function to switch to the login form
      // and show the success message
      onSignupSuccess(); 
      
    } catch (error) {
      // This is where you'd handle "emailtaken" etc.
      console.error('Signup failed:', error);
      setErrors(prev => ({ ...prev, api: error.message || 'Signup failed. Please try again.' }));
    }
    */
  };

  console.log("RegisterForm rendering with initialCountry:", initialCountry);

  return (
    <form id="signup-form" method="POST" action="auth.php" onSubmit={handleSubmit}>

      {errors.api && <span className="error-message api-error">{errors.api}</span>}

      <div className="name-group">
        <div className={`input-group ${errors.name ? 'has-error' : ''}`}>
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
          <span className="error-message" id="signup-name-error">
            {errors.name}
          </span>
        </div>
        <div className={`input-group ${errors.name ? 'has-error' : ''}`}>
          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            name="last_name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.gexft.value)}
            onBlur={validateNames}
          />
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="dob">Date of Birth</label>
        <input
          type="date"
          id="dob"
          name="dob"
          required
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          max={new Date().toISOString().split('T')[0]}

          ref={dobInputRef}
          onClick={handleDateClick}
          onKeyDown={(e) => e.preventDefault()}
        />
      </div>

      <div className={`input-group ${errors.phone ? 'has-error' : ''}`}>
        <label htmlFor="phone">Phone Number</label>

        {initialCountry && (
          <PhoneInput
            id="phone"

            value={phone}
            onChange={setPhone}
            onBlur={validatePhone}
            defaultCountry={initialCountry}
            international
            countryCallingCodeEditable={false}
          />
        )}

        {!initialCountry && (
          <input type="text" placeholder="Loading..." />
        )}
        <span className="error-message" id="signup-phone-error">
          {errors.phone}
        </span>
      </div>

      <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
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
        <span className="error-message" id="signup-email-error">
          {errors.email}
          !</span>
      </div>

      <PasswordInput
        label="Password"
        id="signup-password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      >
        <div className="password-requirements" id="signup-req-list">
          <ul>
            <li id="req-length" className={passwordReqs.length ? 'valid' : ''}>
              Must be at least 8 characters long.
            </li>
            <li id="req-lower" className={passwordReqs.lower ? 'valid' : ''}>
              Must include at least one lowercase letter.
            </li>
            <li id="req-upper" className={passwordReqs.upper ? 'valid' : ''}>
              Must include at least one capital letter.
            </li>
            <li id="req-number" className={passwordReqs.number ? 'valid' : ''}>
              Must include at least one number.
            </li>
            <li id="req-symbol" className={passwordReqs.symbol ? 'valid' : ''}>
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

      <button type="submit" className="btn-base submit-btn" name="signup_submit">
        Create Account
      </button>
    </form>
  );
};

export default RegisterForm;

