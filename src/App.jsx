import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
// import HomePage from './pages/HomePage'; 

const HomePagePlaceholder = () => (
  <div style={{ padding: '2rem' }}>
    <h1>BrightSmile</h1>
    <Link to="/auth">Login</Link>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePagePlaceholder />} />
      
      <Route path="/auth" element={<AuthPage />} />

    </Routes>
  );
}

export default App;