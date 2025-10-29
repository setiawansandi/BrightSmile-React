// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../css/HomePage.css';

// Images & icons
import logo from '../assets/icons/logo.svg';
import benefitIcon from '../assets/icons/benefit.svg';
import boostIcon from '../assets/icons/boost.svg';
import heroImg from '../assets/images/hero-img.png';
import doc1 from '../assets/images/doc1.png';
import doc2 from '../assets/images/doc2.png';
import doc3 from '../assets/images/doc3.png';

const HomePage = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="general hero-page">
          <div className="hero-text">
            <h1>
              Where bright smiles meets bright <span className="highlight">Dentist</span>
            </h1>
            <p className="hero-subtitle">
              Teeth cleaning and whitening for a confident smile
            </p>

            <div className="actions">
              <Link to="/appointment" className="btn-base btn-primary">
                Book Now
              </Link>

              <div className="dentists">
                <img src={doc1} alt="Dentist 1" />
                <img src={doc2} alt="Dentist 2" />
                <img src={doc3} alt="Dentist 3" />
                <span className="text-secondary">
                  <span className="text-primary">10+</span> Pro Dentists
                </span>
              </div>
            </div>

            <div className="features">
              <span>
                <img src={boostIcon} alt="Free Appointment" /> Free Appointment
              </span>
              <span>
                <img src={boostIcon} alt="Discounts" /> Student & Senior Discount
              </span>
            </div>
          </div>

          <div className="hero-image">
            <img src={heroImg} alt="Hero" />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="general">
          <h2>
            Why choose <span className="highlight">BrightSmile?</span>
          </h2>
          <p className="subtitle">
            We provide comprehensive dental services with the latest technology and a
            patient-centred approach
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <p>
                Schedule your appointments online 24/7 with our convenient booking system
              </p>
              <h3>
                <img src={benefitIcon} alt="" /> Easy Booking
              </h3>
            </div>

            <div className="feature-card">
              <p>Extended hours including evenings and weekends to fit your schedule</p>
              <h3>
                <img src={benefitIcon} alt="" /> Flexible Hour
              </h3>
            </div>

            <div className="feature-card">
              <p>Experienced dentists committed to your oral health</p>
              <h3>
                <img src={benefitIcon} alt="" /> Expert Team
              </h3>
            </div>

            <div className="feature-card">
              <p>State-of-art equipment and peak dental care</p>
              <h3>
                <img src={benefitIcon} alt="" /> Quality Care
              </h3>
            </div>
          </div>

          <p className="stats-title">Trusted by Thousands for Healthier Smile!</p>

          <div className="stats">
            <div>
              <span className="number">
                98<span className="symbol">%</span>
              </span>
              <p>Satisfaction</p>
            </div>
            <div>
              <span className="number">
                5000<span className="symbol">+</span>
              </span>
              <p>Smiles Transformed</p>
            </div>
            <div>
              <span className="number">
                4.9<span className="symbol">☆</span>
              </span>
              <p>Star Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <img src={logo} alt="Tooth Icon" className="tooth-icon left" />

          <div className="cta-text">
            <h2>
              Ready to <span className="highlight">Schedule</span> Your Visit?
            </h2>
            <p>Take the first step towards a healthier, brighter, smile today</p>
            <Link to="/appointment" className="btn-base btn-primary2">
              Book Now
            </Link>
          </div>

          <img src={logo} alt="Tooth Icon" className="tooth-icon right" />
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
