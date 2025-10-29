import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      
      <Route path="/auth" element={<AuthPage />} />

    </Routes>
  );
}

export default App;