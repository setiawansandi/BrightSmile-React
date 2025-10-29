import React, { useState } from 'react';

import eyeOpenIcon from '../../assets/icons/eye-open.svg';
import eyeCloseIcon from '../../assets/icons/eye-close.svg';

const PasswordInput = ({ label, id, name, value, onChange, onBlur, error, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className={`input-group ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <div className="password-wrapper">
        <input
          type={isVisible ? 'text' : 'password'}
          id={id}
          name={name}
          required
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        <button type="button" className="toggle-password" onClick={toggleVisibility}>
          <img
            src={eyeOpenIcon}
            alt="Show password"
            className={`eye-icon ${isVisible ? 'hidden' : ''}`}
          />
          <img
            src={eyeCloseIcon}
            alt="Hide password"
            className={`eye-slash-icon ${!isVisible ? 'hidden' : ''}`}
          />
        </button>
      </div>
      <span className="error-message">
        {error}
      </span>

      {children}
    </div>
  );
};

export default PasswordInput;