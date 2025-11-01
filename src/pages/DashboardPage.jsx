import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Using axios
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import styles from '../css/DashboardPage.module.css';

import logo from '../assets/icons/logo.svg';
import none from '../assets/images/none.png';

// --- API ---
const SERVER_BASE_URL = 'http://localhost:3000';
const API_BASE_URL = `${SERVER_BASE_URL}/api`;

// --- Helper Functions ---
const capitalize = (s) => {
  if (typeof s !== 'string' || !s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const [year, month, day] = dateString.split('T')[0].split('-');
    if (!day || !month || !year) return dateString;
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// --- Component ---

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const getBadgeClass = (status) => {
    const k = String(status).toLowerCase();
    let statusClass = '';
    switch (k) {
      case 'confirmed':
        statusClass = styles["badge--confirmed"]; 
        break;
      case 'completed':
        statusClass = styles["badge--completed"];
        break;
      case 'cancelled':
        statusClass = styles["badge--cancelled"];
        break;
      default:
        statusClass = '';
    }
    return `${styles.badge} ${statusClass}`;
  };

  // Load user data and fetch appointments on page load
  useEffect(() => {
    if (searchParams.get('updated')) { setSuccess('Appointment updated.'); }
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!storedUser || !token) {
      setIsLoading(false);
      setError('Authentication required. Please log in.');
      navigate('/auth');
      return; 
    }
    const userId = JSON.parse(storedUser).id;

    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      const authHeader = { headers: { 'Authorization': `Bearer ${token}` } };
      try {
        const [profileResponse, apptResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/user`, authHeader),
          axios.get(`${API_BASE_URL}/appointment?user=${userId}`, authHeader)
        ]);
        setUser(profileResponse.data.data);
        setAppointments(apptResponse.data.data || []);
      } catch (err) {
        const message = err.response?.data?.error || err.message || 'Failed to load data.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [searchParams, navigate]);

  // --- Handle 'Cancel' and 'Complete' actions ---
  const handleAppointmentAction = async (e, appointmentId, action) => {
    e.preventDefault(); 
    if (action === 'cancel' && !window.confirm('Cancel this appointment?')) { return; }
    setError(null);
    setSuccess(null);
    const token = localStorage.getItem('token');
    if (!token) { setError("Authentication required. Please log in again."); return; }
    const newStatus = action === 'complete' ? 'completed' : 'cancelled';
    try {
      const authHeader = { headers: { 'Authorization': `Bearer ${token}` } };
      const body = { appt_id: appointmentId, status: newStatus };
      await axios.put(`${API_BASE_URL}/appointment`, body, authHeader);
      setSuccess('Appointment updated successfully.');
      setAppointments(prevAppointments => 
        prevAppointments.map(appt => 
          appt.appointment_id === appointmentId 
            ? { ...appt, status: newStatus } 
            : appt
        )
      );
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Action failed.';
      setError(message);
    }
  };

  // --- Derived State ---
  const isDoctor = user?.is_doctor === 1; 
  const firstColHeader = isDoctor ? 'Patient' : 'Doctor';

  // --- Render Logic (Loading/Error) ---
  if (isLoading) {
    return (
      <>
        <Navbar />
        {/* 👇 3. All classNames are updated */}
        <div className={`general ${styles.dashboard}`} style={{ minHeight: '60vh' }}>
           <h1 className={styles["dash-title"]}>Loading...</h1>
        </div>
        <Footer />
      </>
    );
  }
  
  if (!user) {
    return (
      <>
        <Navbar />
        <div className={`general ${styles.dashboard}`} style={{ minHeight: '60vh' }}>
          <h1 className={styles["dash-title"]}>My <span className="highlight">Dashboard</span></h1>
          <div className={`${styles.flash} ${styles.error}`}>{error || 'Error loading user data.'}</div>
        </div>
        <Footer />
      </>
    );
  }

  // --- Main JSX ---
  return (
    <>
      <Navbar />
      
      <section className={`general ${styles.dashboard}`}>
        <h1 className={styles["dash-title"]}>My <span className="highlight">Dashboard</span></h1>

        {success && <div className={styles.flash}>{success}</div>}
        {error && <div className={`${styles.flash} ${styles.error}`}>{error}</div>}

        {/* User Information */}
        <div className={`${styles["section-card"]} ${styles["patient-card"]}`}>
          <p className={styles["section-title"]}>{isDoctor ? 'Doctor Information' : 'Patient Information'}</p>
          <div className={styles["patient-grid"]}>
            
            <div className={styles.avatar}>
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl}
                  alt="Profile photo" 
                />
              ) : (
                <img src={none} alt="" className={styles["avatar-placeholder"]} />
              )}
            </div>

            <ul className={styles["patient-fields"]}>
              <li><span className={styles.label}>Name:</span> <span>{`${user.firstName} ${user.lastName}` || '—'}</span></li>
              <li><span className={styles.label}>Email:</span> <span>{user.email || '—'}</span></li>
              <li><span className={styles.label}>Phone:</span> <span>{user.phone || '—'}</span></li>
              <li><span className={styles.label}>Date of Birth:</span> <span>{formatDisplayDate(user.dob)}</span></li>
            </ul>

            <img src={logo} alt="Logo" className={styles["card-logo"]} />
          </div>
        </div>

        {/* Appointment History */}
        <div className={`${styles["section-card"]} ${styles["history-card"]}`}>
          <p className={styles["section-title"]}>Appointment History</p>
          
          {isLoading ? (
            <div>Loading appointments...</div>
          ) : (
            <div className={styles["table-wrap"]}>
              <table className={styles["appt-table"]}>
                <colgroup>
                  <col style={{ width: '160px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '90px' }} />
                  <col style={{ width: '120px' }} />
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    <th>{firstColHeader}</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th className={styles["actions-col"]}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className={styles["empty-row"]}>No appointments found.</td>
                    </tr>
                  ) : (
                    appointments.map(a => {
                      const isConfirmed = a.status.toLowerCase() === 'confirmed';
                      const counterpartName = isDoctor ? a.patient_name : a.doctor_name;

                      return (
                        <tr key={a.appointment_id}>
                          <td>{counterpartName || '—'}</td>
                          <td>{a.date}</td>
                          <td>{a.time}</td>
                          <td>
                            <span className={getBadgeClass(a.status)}>
                              {capitalize(a.status)}
                            </span>
                          </td>
                          <td className={styles.actions}>
                            {isConfirmed ? (
                              <>
                                <Link className={`btn-base btn-sm`} to={`/appointment?appointmentId=${a.appointment_id}`}>
                                  Reschedule
                                </Link>
                                {isDoctor ? (
                                  <form onSubmit={(e) => handleAppointmentAction(e, a.appointment_id, 'complete')}>
                                    <button type="submit" className={`btn-base btn-sm ${styles["btn-complete"]}`}>Complete</button>
                                  </form>
                                ) : (
                                  <form onSubmit={(e) => handleAppointmentAction(e, a.appointment_id, 'cancel')}>
                                    <button type="submit" className={`btn-base btn-sm ${styles["btn-danger"]}`}>Cancel</button>
                                  </form>
                                )}
                              </>
                            ) : (
                              <span className={styles.muted}>--</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default DashboardPage;
