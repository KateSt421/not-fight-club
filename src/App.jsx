import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCharacter } from "./utils/storage";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Main from "./pages/Main";
import Character from "./pages/Character";
import Fight from "./pages/Fight";
import styles from "./styles/App.module.css";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const char = getCharacter();

    if (!char.name && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
    if (char.name && location.pathname === "/") {
      navigate("/main", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/main" element={<Main />} />
          <Route path="/character" element={<Character />} />
          <Route path="/fight" element={<Fight />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router basename="/not-fight-club">
      <AppContent />
    </Router>
  );
}
