// Doctors.jsx
import { useEffect, useState } from "react";
import styles from "../css/DoctorPage.module.css"; // CSS Modules (use bracket syntax)

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal state
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null); // { id, name, specialty, description, image }

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:3000/api/doctor");
        if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
        const json = await res.json();
        if (!json?.data || !Array.isArray(json.data)) {
          throw new Error("Unexpected response format.");
        }
        if (alive) setDoctors(json.data);
      } catch (e) {
        if (alive) setError(e.message || "Failed to fetch doctors.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []); // no token/apiBase deps

  const handleInfo = (doc) => {
    setActive(doc);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setActive(null);
  };

  return (
    <section>
      {/* Hero — EXACT TEXT */}
      <div className={styles["hero"]}>
        <h1>Meet Our Expert Team</h1>
        <p>
          Our highly skilled dental professionals are committed to providing<br />
          exceptional care with the latest techniques.
        </p>
      </div>

      {/* Loading / Error */}
      {loading && <p style={{ textAlign: "center" }}>Loading…</p>}
      {!loading && error && (
        <p style={{ textAlign: "center", color: "crimson" }}>{error}</p>
      )}

      {/* Grid */}
      {!loading && !error && (
        <div className={styles["team"]}>
          {doctors.length === 0 ? (
            <p>No doctors found.</p>
          ) : (
            doctors.map((d) => {
              // Mirror PHP naming & fallbacks
              const id = d.user_id ?? d.id ?? d.userId ?? d.doctorId;
              const first = d.first_name ?? d.firstName ?? d.given_name ?? "";
              const last = d.last_name ?? d.lastName ?? d.family_name ?? "";
              const rawName =
                first || last ? `${first} ${last}`.trim() : d.name ?? "";
              const name = rawName ? `Dr ${rawName}` : "Dr";
              const specialty =
                d.specialization ?? d.speciality ?? d.specialty ?? "General";
              const description = d.bio ?? d.description ?? "";
              const image =
                d.avatar_url ??
                d.avatarUrl ??
                d.image ??
                "assets/images/default-doctor.png";

              const docObj = { id, name, specialty, description, image };

              return (
                <article
                  key={id ?? `${name}-${specialty}`}
                  className={styles["card"]}
                  data-name={name}
                  data-specialty={specialty}
                  data-description={description}
                >
                  <img src={image} alt={name} />
                  <h3>{name}</h3>
                  <p>{specialty}</p>
                  <div className={styles["actions"]}>
                    <button
                      type="button"
                      className={styles["btn-info"]}
                      onClick={() => handleInfo(docObj)}
                    >
                      Info
                    </button>
                    <a
                      className={styles["btn-book"]}
                      href={
                        id
                          ? `appointment.php?doctor=${encodeURIComponent(id)}`
                          : "appointment.php"
                      }
                    >
                      Book
                    </a>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}

      {/* Modal — EXACT TITLE & layout */}
      {open && active && (
        <div
          className={styles["modal"]}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={styles["modal-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              className={styles["close"]}
              onClick={handleClose}
            >
              &times;
            </button>

            <h2>Doctor Info</h2>

            <div className={styles["modal-body"]}>
              <div className={styles["modal-left"]}>
                <img
                  src={active.image}
                  alt="Doctor"
                  className={styles["modalImage"]}
                />
                <h3 className={styles["modalName"]}>{active.name}</h3>
                <p className={styles["modalSpecialty"]}>{active.specialty}</p>
              </div>
              <div className={styles["modal-right"]}>
                <p className={styles["modalDescription"]}>
                  {active.description}
                </p>
                <a
                  className={styles["btn-book"]}
                  href={
                    active.id
                      ? `appointment.php?doctor=${encodeURIComponent(active.id)}`
                      : "appointment.php"
                  }
                >
                  Book
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
