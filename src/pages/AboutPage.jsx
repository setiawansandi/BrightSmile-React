import React from 'react';
import styles from '../css/AboutPage.module.css';

import aboutHeroImg from '../assets/images/about-hero.png';
import logoSvg from '../assets/icons/logo.svg';
import locationPinIcon from '../assets/icons/location-pin.svg';
import phoneIcon from '../assets/icons/phone-rounded.svg';
import emailIcon from '../assets/icons/email.svg';


function AboutPage() {
  return (
    <>
      <section className={styles['about-hero']}>
        <img
          src={aboutHeroImg}
          alt="Clinic"
          className={styles['about-hero__img']}
        />
        <div className={styles['about-hero__caption']}>
          Your Smile, Our Priority
        </div>
      </section>

      <section className={styles['about']}>
        <div className={`general ${styles['about__grid']}`}>
          <h3 className={styles['about__title']}>
            About <span className={styles['highlight']}>Us</span>
          </h3>

          <div className={styles['about__text']}>
            <p>
              BrightSmile Dental Clinic is a leading Singaporean dental practice
              with a core mission to deliver quality and affordable dental care
              to the entire community.
            </p>
            <p>
              With many years of treating our patients like family, our team at
              BrightSmile Dental Clinic continuously strives to provide excellent
              customer experiences, taking the time to understand the unique
              needs of each patient. This commitment is supported by continuous
              training and education for our staff and clinicians to maintain
              the highest standards of dental care.
            </p>
            <p>
              Our dental team comes from diverse backgrounds and speaks multiple
              languages, including English, Mandarin, and Malay, ensuring that
              we can accommodate your needs and make every visit to the dentist
              a pleasant and memorable experience.
            </p>
          </div>

          <div className={styles['about__brand']}>
            <img
              src={logoSvg}
              alt="BrightSmile logo"
              className={styles['about__logo']}
            />
            <div className={styles['brand-name']}>BrightSmile</div>
          </div>
        </div>
      </section>

      <section className={`${styles['contact']} general`}>
        <div className={styles['contact-intro']}>
          <h2 className={styles['contact-title']}>
            Get In <span className={styles['highlight']}>Touch</span>
          </h2>
          <p className={styles['contact-sub']}>
            We'd love to hear from you! Whether you have questions, need
            support, or want to learn more about our services, our team is here
            to help
          </p>
        </div>
        <div className={styles['contact-info']}>
          <div className={styles['contact-item']}>
            <div className={styles['icon-badge']}>
              <img src={locationPinIcon} alt="Location icon" />
            </div>
            <div className={styles['contact-meta']}>
              <div className={styles['meta-title']}>Our Address</div>
              <div className={styles['meta-text']}>
                Blk 18 Jln Membina,<br />#01-05, S164018
              </div>
            </div>
          </div>

          <div className={styles['contact-item']}>
            <div className={styles['icon-badge']}>
              <img src={phoneIcon} alt="Phone icon" />
            </div>
            <div className={styles['contact-meta']}>
              <div className={styles['meta-title']}>Our Number</div>
              <div className={styles['meta-text']}>
                <a href="tel:+6561235678">+65 6123 5678</a>
              </div>
            </div>
          </div>

          <div className={styles['contact-item']}>
            <div className={styles['icon-badge']}>
              <img src={emailIcon} alt="Mail icon" />
            </div>
            <div className={styles['contact-meta']}>
              <div className={styles['meta-title']}>Our Email</div>
              <div className={styles['meta-text']}>
                <a href="mailto:info@brightsmile.com">info@brightsmile.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className={styles['contact__map']} aria-label="Map to our clinic">
          <iframe
            title="Bright Smile Dental Surgery (Tiong Bahru) location"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2713.9050730170384!2d103.6801892161104!3d1.3445423607906486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da0f750415f4a3%3A0xc981943da10e306e!2sNanyang%20Auditorium!5e0!3m2!1sen!2ssg!4v1760380046335!5m2!1sen!2ssg"
          ></iframe>
        </div>
      </section>

    </>
  );
}

export default AboutPage;
