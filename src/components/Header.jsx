import { useNavigate } from "react-router-dom";
import { getCharacter, clearCharacter } from "../utils/storage";
import styles from "../styles/Header.module.css";

export default function Header() {
  const navigate = useNavigate();
  const char = getCharacter();

  const handleLogout = () => {
    clearCharacter();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate("/main")}>
        🥊 Not Fight Club
      </div>

      <nav className={styles.nav}>
        {char.name ? (
          <>
            <button
              onClick={() => navigate("/main")}
              className={styles.navButton}
            >
              Main
            </button>
            <button
              onClick={() => navigate("/character")}
              className={styles.navButton}
            >
              Character
            </button>
            <button
              onClick={() => navigate("/fight")}
              className={styles.navButton}
            >
              Fight
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => navigate("/")} className={styles.navButton}>
            Register
          </button>
        )}
      </nav>
    </header>
  );
}
