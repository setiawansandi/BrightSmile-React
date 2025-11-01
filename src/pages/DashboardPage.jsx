import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Using axios
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// 👇 1. Import the .module.css file as 'styles'
// (Make sure your file is renamed to DashboardPage.module.css)
import styles from '../css/DashboardPage.module.css';

// Keep these. They are for your placeholder and card logo.
import logo from '../assets/icons/logo.svg';
import none from '../assets/images/none.png';

// --- Configuration ---
const SERVER_BASE_URL = 'http://localhost:3000';
const API_BASE_URL = `${SERVER_BASE_URL}/api`;


// --- Helper Functions ---
const capitalize = (s) => {
  if (typeof s !== 'string' || !s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return '—'; // Returns '—' if dob is null
  try {
    const [year, month, day] = dateString.split('T')[0].split('-');
    if (!day || !month || !year) return dateString; // Safety check
    return `${day}/${month}/${year}`; // "01/10/2025"
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Fallback
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

  // 👇 2. Moved getBadgeClass inside so it can access 'styles'
  const getBadgeClass = (status) => {
    const k = String(status).toLowerCase();
    let statusClass = '';
    switch (k) {
      // Use bracket notation for classes with dashes
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
    // Combine the base 'badge' class with the specific 'statusClass'
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
                                {/* Global classes 'btn-base' and 'btn-sm' come from index.css */}
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




// import React, { useState, useEffect } from 'react';
// import { Link, useSearchParams, useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import '../css/DashboardPage.css';

// import logo from '../assets/icons/logo.svg';
// import none from '../assets/images/none.png';

// // --- Helper Functions ---

// const getBadgeClass = (status) => {
//   const k = String(status).toLowerCase();
//   switch (k) {
//     case 'confirmed':
//       return 'badge badge--confirmed';
//     case 'completed':
//       return 'badge badge--completed';
//     case 'cancelled':
//       return 'badge badge--cancelled';
//     default:
//       return 'badge';
//   }
// };

// const capitalize = (s) => {
//   if (typeof s !== 'string' || !s) return '';
//   return s.charAt(0).toUpperCase() + s.slice(1);
// };

// const formatDisplayDate = (dateString) => {
//   if (!dateString) return '—';
//   try {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   } catch (error) {
//     console.error('Error formatting date:', error);
//     return dateString;
//   }
// };

// // --- Component ---

// const DashboardPage = () => {
//   const [user, setUser] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUserLoading, setIsUserLoading] = useState(true);
  
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   // Load user data and fetch appointments on page load
//   useEffect(() => {
//     // Check for flash messages in URL
//     if (searchParams.get('updated')) {
//       setSuccess('Appointment updated.');
//     }

//     // Get user and token from storage
//     const storedUser = localStorage.getItem('user');
//     const token = localStorage.getItem('token');

//     if (!storedUser || !token) {
//       setIsLoading(false);
//       setIsUserLoading(false);
//       setError('Authentication required. Please log in.');
//       navigate('/auth');
//       return; 
//     }

//     const userData = JSON.parse(storedUser);
//     setUser(userData);
//     setIsUserLoading(false); // User is now loaded

//     // --- Fetch appointment data using the real API ---
//     const fetchAppointments = async (userId, authToken) => {
//       setIsLoading(true); // Start loading appointments
//       setError(null);
//       try {
//         const response = await fetch(`/api/appointment?user=${userId}`, {
//           headers: {
//             'Authorization': `Bearer ${authToken}` // Send the auth token
//           },
//         });

//         // --- SAFE ERROR HANDLING BLOCK ---
//         if (!response.ok) {
//           let errorMessage;
//           try {
//             // Try to parse a JSON error message first
//             const errData = await response.json();
//             errorMessage = errData.message || errData.error || `Error ${response.status}`;
//           } catch (e) {
//             // This catches the "Unexpected token '<'" error
//             // It means the server sent HTML, so we use the status text
//             errorMessage = `API request failed: ${response.status} ${response.statusText}`;
//             console.error("The API response was not JSON. Check your browser Network tab.");
//           }
//           throw new Error(errorMessage);
//         }
//         // --- END SAFE BLOCK ---
        
//         const apptData = await response.json();
        
//         // This assumes your API returns data in the
//         // format the table expects (e.g., with 'counterpart_name', 'date_fmt', 'time_fmt').
//         setAppointments(apptData); 

//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false); // Stop loading appointments
//       }
//     };

//     fetchAppointments(userData.id, token); // Pass user ID and token

//   }, [searchParams, navigate]); // Add navigate to dependency array

//   // --- Handle 'Cancel' and 'Complete' actions ---
//   const handleAppointmentAction = async (e, appointmentId, action) => {
//     e.preventDefault(); 
    
//     if (action === 'cancel' && !window.confirm('Cancel this appointment?')) {
//       return;
//     }

//     setError(null);
//     setSuccess(null);
    
//     const token = localStorage.getItem('token'); // Get auth token
//     if (!token) {
//       setError("Authentication required. Please log in again.");
//       return;
//     }
    
//     const newStatus = action === 'complete' ? 'completed' : 'cancelled';

//     try {
//       // Call the PUT endpoint your friend made
//       const response = await fetch('/api/appointment', {
//         method: 'PUT', // Use PUT
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}` // Add auth
//         },
//         body: JSON.stringify({
//           id: appointmentId, // Send the appointment ID
//           status: newStatus  // Send the new status
//         }),
//       });

//       // --- SAFE ERROR HANDLING BLOCK ---
//       if (!response.ok) {
//         let errorMessage;
//         try {
//           const errData = await response.json();
//           errorMessage = errData.message || errData.error || `Error ${response.status}`;
//         } catch (e) {
//           errorMessage = `API request failed: ${response.status} ${response.statusText}`;
//           console.error("The API response was not JSON. Check your browser Network tab.");
//         }
//         throw new Error(errorMessage);
//       }
//       // --- END SAFE BLOCK ---

//       const data = await response.json(); // API should return the updated appointment
//       setSuccess('Appointment updated successfully.');
      
//       // Update the UI state locally without a page reload
//       setAppointments(prevAppointments => 
//         prevAppointments.map(appt => 
//           appt.id === appointmentId 
//             ? { ...appt, status: newStatus } // Update the status
//             : appt
//         )
//       );

//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // --- Derived State ---
//   const isDoctor = user?.isDoctor === 1;
//   const firstColHeader = isDoctor ? 'Patient' : 'Doctor';

//   // --- Render Logic ---

//   // Show a loading screen while user is being checked
//   if (isUserLoading) {
//     return (
//       <>
//         <Navbar />
//         <div className="general dashboard" style={{ minHeight: '60vh' }}>
//            <h1 className="dash-title">Loading...</h1>
//         </div>
//         <Footer />
//       </>
//     );
//   }
  
//   // Show error if user failed to load (e.g., no token)
//   if (!user) {
//     return (
//       <>
//         <Navbar />
//         <div className="general dashboard" style={{ minHeight: '60vh' }}>
//           <h1 className="dash-title">My <span className="highlight">Dashboard</span></h1>
//           <div className="flash error">{error || 'Error loading user data.'}</div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   // --- Main JSX ---
//   return (
//     <>
//       <Navbar />
      
//       <section className="general dashboard">
//         <h1 className="dash-title">My <span className="highlight">Dashboard</span></h1>

//         {/* Flash Messages */}
//         {success && <div className="flash">{success}</div>}
//         {error && <div className="flash error">{error}</div>}

//         {/* User Information */}
//         <div className="section-card patient-card">
//           <p className="section-title">{isDoctor ? 'Doctor Information' : 'Patient Information'}</p>
//           <div className="patient-grid">
//             <div className="avatar">
//               {/* Use 'avatarUrl' (camelCase) */}
//               {user.avatarUrl ? (
//                 <img src={user.avatarUrl} alt="Profile photo" />
//               ) : (
//                 <img src={none} alt="" className="avatar-placeholder" />
//               )}
//             </div>

//             <ul className="patient-fields">
//               {/* Use 'firstName', 'lastName', etc. from localStorage user */}
//               <li><span className="label">Name:</span> <span>{`${user.firstName} ${user.lastName}` || '—'}</span></li>
//               <li><span className="label">Email:</span> <span>{user.email || '—'}</span></li>
//               <li><span className="label">Phone:</span> <span>{user.phone || '—'}</span></li>
//               <li><span className="label">Date of Birth:</span> <span>{formatDisplayDate(user.dob)}</span></li>
//             </ul>

//             <img src={logo} alt="Logo" />
//           </div>
//         </div>

//         {/* Appointment History */}
//         <div className="section-card history-card">
//           <p className="section-title">Appointment History</p>
          
//           {/* Show loading spinner just for the table */}
//           {isLoading ? (
//             <div>Loading appointments...</div>
//           ) : (
//             <div className="table-wrap">
//               <table className="appt-table">
//                 {/* Colgroup and Thead are unchanged... */}
//                 <colgroup>
//                   <col style={{ width: '160px' }} />
//                   <col style={{ width: '120px' }} />
//                   <col style={{ width: '90px' }} />
//                   <col style={{ width: '120px' }} />
//                   <col />
//                 </colgroup>
//                 <thead>
//                   <tr>
//                     <th>{firstColHeader}</th>
//                     <th>Date</th>
//                     <th>Time</th>
//                     <th>Status</th>
//                     <th className="actions-col">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appointments.length === 0 ? (
//                     <tr>
//                       <td colSpan="5" className="empty-row">No appointments found.</td>
//                     </tr>
//                   ) : (
//                     appointments.map(a => {
//                       const isConfirmed = a.status.toLowerCase() === 'confirmed';
//                       return (
//                         <tr key={a.id}>
//                           {/* **ASSUMPTION**: Your API returns these fields formatted.
//                             'counterpart_name', 'date_fmt', 'time_fmt'
//                           */}
//                           <td>{a.counterpart_name || '—'}</td>
//                           <td>{a.date_fmt}</td>
//                           <td>{a.time_fmt}</td>
//                           <td>
//                             <span className={getBadgeClass(a.status)}>
//                               {capitalize(a.status)}
//                             </span>
//                           </td>
//                           <td className="actions">
//                             {isConfirmed ? (
//                               <>
//                                 <Link className="btn-base btn-sm" to={`/appointment?appointmentId=${a.id}`}>
//                                   Reschedule
//                                 </Link>

//                                 {isDoctor ? (
//                                   <form onSubmit={(e) => handleAppointmentAction(e, a.id, 'complete')}>
//                                     <button type="submit" className="btn-base btn-sm btn-complete">Complete</button>
//                                   </form>
//                                 ) : (
//                                   <form onSubmit={(e) => handleAppointmentAction(e, a.id, 'cancel')}>
//                                     <button type="submit" className="btn-base btn-sm btn-danger">Cancel</button>
//                                   </form>
//                                 )}
//                               </>
//                             ) : (
//                               <span className="muted">--</span>
//                             )}
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </section>

//       <Footer />
//     </>
//   );
// };

// export default DashboardPage;