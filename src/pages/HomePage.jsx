// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../css/HomePage.module.css";

// Images & icons
import logo from "../assets/icons/logo.svg";
import benefitIcon from "../assets/icons/benefit.svg";
import boostIcon from "../assets/icons/boost.svg";
import heroImg from "../assets/images/hero-img.png";
import doc1 from "../assets/images/doc1.png";
import doc2 from "../assets/images/doc2.png";
import doc3 from "../assets/images/doc3.png";

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`general ${styles["hero-page"]}`}>
          <div className={styles["hero-text"]}>
            <h1>
              Where bright smiles meets bright{" "}
              <span className={styles.highlight}>Dentist</span>
            </h1>
            <p className={styles["hero-subtitle"]}>
              Teeth cleaning and whitening for a confident smile
            </p>

            <div className={styles.actions}>
              <Link to="/appointment" className={`btn-base ${styles["btn-primary"]}`}>
                Book Now
              </Link>

              <div className={styles.dentists}>
                <img src={doc1} alt="Dentist 1" />
                <img src={doc2} alt="Dentist 2" />
                <img src={doc3} alt="Dentist 3" />
                <span className={styles["text-secondary"]}>
                  <span className={styles["text-primary"]}>10+</span> Pro
                  Dentists
                </span>
              </div>
            </div>

            <div className={styles.features}>
              <span>
                <img src={boostIcon} alt="Free Appointment" /> Free Appointment
              </span>
              <span>
                <img src={boostIcon} alt="Discounts" /> Student & Senior
                Discount
              </span>
            </div>
          </div>

          <div className={styles["hero-image"]}>
            <img src={heroImg} alt="Hero" />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <div className="general">
          <h2>
            Why choose <span className={styles.highlight}>BrightSmile?</span>
          </h2>
          <p className={styles.subtitle}>
            We provide comprehensive dental services with the latest technology
            and a patient-centred approach
          </p>

          <div className={styles["features-grid"]}>
            <div className={styles["feature-card"]}>
              <p>
                Schedule your appointments online 24/7 with our convenient
                booking system
              </p>
              <h3>
                <img src={benefitIcon} alt="" /> Easy Booking
              </h3>
            </div>

            <div className={styles["feature-card"]}>
              <p>
                Extended hours including evenings and weekends to fit your
                schedule
              </p>
              <h3>
                <img src={benefitIcon} alt="" /> Flexible Hour
              </h3>
            </div>

            <div className={styles["feature-card"]}>
              <p>Experienced dentists committed to your oral health</p>
              <h3>
                <img src={benefitIcon} alt="" /> Expert Team
              </h3>
            </div>

            <div className={styles["feature-card"]}>
              <p>State-of-art equipment and peak dental care</p>
              <h3>
                <img src={benefitIcon} alt="" /> Quality Care
              </h3>
            </div>
          </div>

          <p className={styles["stats-title"]}>
            Trusted by Thousands for Healthier Smile!
          </p>

          <div className={styles.stats}>
            <div>
              <span className={styles.number}>
                98<span className={styles.symbol}>%</span>
              </span>
              <p>Satisfaction</p>
            </div>
            <div>
              <span className={styles.number}>
                5000<span className={styles.symbol}>+</span>
              </span>
              <p>Smiles Transformed</p>
            </div>
            <div>
              <span className={styles.number}>
                4.9<span className={styles.symbol}>☆</span>
              </span>
              <p>Star Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles["cta-content"]}>
          <img
            src={logo}
            alt="Tooth Icon"
            className={`${styles["tooth-icon"]} ${styles.left}`}
          />

          <div className={styles["cta-text"]}>
            <h2>
              Ready to <span className={styles.highlight}>Schedule</span> Your
              Visit?
            </h2>
            <p>
              Take the first step towards a healthier, brighter, smile today
            </p>
            <Link
              to="/appointment"
              className={`btn-base ${styles["btn-primary2"]}`}
            >
              Book Now
            </Link>
          </div>

          <img
            src={logo}
            alt="Tooth Icon"
            className={`${styles["tooth-icon"]} ${styles.right}`}
          />
        </div>
      </section>
    </>
  );
};

export default HomePage;
