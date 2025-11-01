// App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";             // includes Navbar
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DoctorPage from "./pages/DoctorPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <Routes>
      {/* No navbar on auth */}
      <Route path="/auth/*" element={<AuthPage />} />

      {/* Everything else uses the navbar */}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        {/* <Route path="appointment" element={<AppointmentPage />} /> */}
        <Route path="doctors" element={<DoctorPage />} />
        {/* <Route path="services" element={<ServicesPage />} /> */}
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}
