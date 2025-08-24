import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCharacter, setCharacter } from "../utils/storage";
import styles from "../styles/Fight.module.css";

export default function Fight() {
  const navigate = useNavigate();
  const [char, setChar] = useState(getCharacter());
  const [playerHP, setPlayerHP] = useState(100);
  const [botHP, setBotHP] = useState(100);
  const [log, setLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [botAvatar, setBotAvatar] = useState("");

  useEffect(() => {
    if (!char.name) {
      navigate("/", { replace: true });
    }
  }, [char.name, navigate]);

  useEffect(() => {
    const avatars = [
      "avatars/1fabe4d4-bdfc-4b0a-a295-77fb0fd4bc39.jpg",
      "avatars/yoda.jpg",
      "avatars/89c49be9-433b-41c3-a3be-8a96cf540021.jpg",
      "avatars/b8999b5e-adef-4949-9ec0-3992627e78fd.jpg",
      "avatars/dde8f914-c67d-4666-bd45-f4a6529f259c.jpg",
      "avatars/de173f5b-a12b-4002-b03e-235616bc66dd.jpg",
    ];

    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    setBotAvatar(randomAvatar);
  }, []);

  const addLog = (msg) => setLog((prev) => [msg, ...prev]);

  const attack = () => {
    if (gameOver) return;

    const playerDmg = Math.floor(Math.random() * 20) + 5;
    const botDmg = Math.floor(Math.random() * 20) + 5;

    setBotHP((hp) => {
      const newHP = Math.max(hp - playerDmg, 0);
      addLog(`${char.name} ударил бота на ${playerDmg}`);
      if (newHP <= 0) endFight(true);
      return newHP;
    });

    setPlayerHP((hp) => {
      const newHP = Math.max(hp - botDmg, 0);
      if (!gameOver) addLog(`Бот ударил ${char.name} на ${botDmg}`);
      if (newHP <= 0) endFight(false);
      return newHP;
    });
  };

  const surrender = () => {
    if (gameOver) return;
    addLog(`${char.name} сдался`);
    endFight(false);
  };

  const endFight = (won) => {
    setGameOver(true);
    const updated = { ...char };
    if (won) {
      updated.wins++;
      addLog(`${char.name} победил!`);
    } else {
      updated.loses++;
      addLog(`${char.name} проиграл...`);
    }
    setChar(updated);
    setCharacter(updated);
  };

  const handleImageError = (e) => {
    console.error("Image not found:", e.target.src);
    e.target.style.display = "none";
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Бой: {char.name} vs 🤖 Бот</h2>

      <div className={styles.hpWrapper}>
        <div className={styles.box}>
          <img
            src={char.avatar}
            alt="Player avatar"
            className={styles.avatar}
            onError={handleImageError}
          />
          <p className={styles.bold}>{char.name}</p>
          <p>HP: {playerHP}</p>
        </div>

        <div className={styles.vs}>VS</div>

        <div className={styles.box}>
          <img
            src={botAvatar}
            alt="Bot avatar"
            className={styles.avatar}
            onError={handleImageError}
          />
          <p className={styles.bold}>🤖 Бот</p>
          <p>HP: {botHP}</p>
        </div>
      </div>

      {!gameOver && (
        <div className={styles.buttons}>
          <button onClick={attack} className={styles.attack}>
            Attack
          </button>
          <button onClick={surrender} className={styles.surrender}>
            Surrender
          </button>
        </div>
      )}

      {gameOver && (
        <button onClick={() => navigate("/main")} className={styles.back}>
          Back to Main
        </button>
      )}

      <div className={styles.log}>
        <h3>Battle Log</h3>
        {log.map((entry, idx) => (
          <p key={idx}>{entry}</p>
        ))}
      </div>
    </div>
  );
}
