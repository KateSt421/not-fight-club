import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getCharacter, setCharacter } from "../utils/storage";
import styles from "../styles/Fight.module.css";

export default function Fight() {
  const navigate = useNavigate();
  const [char, setChar] = useState(getCharacter());
  const [playerHP, setPlayerHP] = useState(100);
  const [botHP, setBotHP] = useState(100);
  const [log, setLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);

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

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Бой: {char.name} vs 🤖 Бот</h2>

      <div className={styles.hpWrapper}>
        <div className={styles.box}>
          <p className={styles.bold}>{char.name}</p>
          <p>HP: {playerHP}</p>
        </div>
        <div className={styles.box}>
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
