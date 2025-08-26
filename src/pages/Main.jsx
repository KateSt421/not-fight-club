import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCharacter, clearCharacter } from "../utils/storage";
import styles from "../styles/Main.module.css";
import container from "../styles/Container.module.css";
import History from "../components/History";

export default function Main() {
  const navigate = useNavigate();
  const char = getCharacter();
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!char.name) {
      navigate("/", { replace: true });
    }
  }, [char.name, navigate]);

  const handleLogout = () => {
    clearCharacter();
    navigate("/");
  };

  return (
    <div className={container.container}>
      <div className={styles.wrapper}>
        <h2 className={styles.welcome}>Welcome, {char.name}!</h2>

        {showHistory ? (
          <History onBack={() => setShowHistory(false)} />
        ) : (
          <>
            <img src={char.avatar} alt="avatar" className={styles.avatar} />
            <div className={styles.stats}>
              <p>Wins: {char.wins}</p>
              <p>Loses: {char.loses}</p>
            </div>

            <button
              onClick={() => navigate("/fight")}
              className={styles.fightButton}
            >
              Fight!
            </button>
            <button
              onClick={() => navigate("/character")}
              className={styles.charButton}
            >
              Character Page
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className={styles.historyButton}
            >
              Battle History
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
