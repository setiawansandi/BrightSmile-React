import { useEffect, useState } from "react";
import styles from "../css/DoctorPage.module.css";

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
        if (!res.ok)
          throw new Error((await res.text()) || `HTTP ${res.status}`);
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
  }, []);

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
      <div className={styles["hero"]}>
        <h1>Meet Our Expert Team</h1>
        <p>
          Our highly skilled dental professionals are committed to providing
          <br />
          exceptional care with the latest techniques.
        </p>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading…</p>}
      {!loading && error && (
        <p style={{ textAlign: "center", color: "crimson" }}>{error}</p>
      )}

      {!loading && !error && (
        <div className={styles["team"]}>
          {doctors.length === 0 ? (
            <p>No doctors found.</p>
          ) : (
            doctors.map((d) => {
              // Use API fields directly
              const id = d.doctor_id; // unique, fixes duplicate key warning
              const baseName = d.doctor_name ?? "";
              const name = baseName ? `Dr ${baseName}` : "Dr";
              const specialty = d.specialization ?? "General";
              const description = d.bio ?? "";
              const image = d.avatar_url ?? "assets/images/default-doctor.png";

              const docObj = { id, name, specialty, description, image };

              return (
                <article
                  key={id ?? `${name}-${specialty}`} // id should exist; fallback is just a guard
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
                      className={`btn-base ${styles["btn-book"]}`}
                      href={`appointment.php?doctor=${encodeURIComponent(id)}`}
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
                  className={`btn-base ${styles["btn-bookmodal"]}`}
                  href={`appointment.php?doctor=${encodeURIComponent(
                    active.id
                  )}`}
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
