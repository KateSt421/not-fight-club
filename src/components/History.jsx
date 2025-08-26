import { getBattleHistory } from "../utils/storage";
import styles from "../styles/History.module.css";

export default function History({ onBack }) {
  const history = getBattleHistory();

  return (
    <div className={styles.container}>
      <h2>История боев</h2>

      {history.length === 0 ? (
        <div className={styles.emptyMessage}>
          <p>История боев пуста</p>
          <p>Сыграйте несколько боев чтобы увидеть статистику!</p>
        </div>
      ) : (
        <div className={styles.historyList}>
          {history
            .slice()
            .reverse()
            .map((battle, index) => (
              <div key={index} className={styles.battleItem}>
                <span className={styles.date}>
                  {new Date(battle.timestamp).toLocaleDateString("ru-RU")}
                  <br />
                  {new Date(battle.timestamp).toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                <span
                  className={battle.result === "win" ? styles.win : styles.lose}
                >
                  {battle.result === "win" ? "✅" : "❌"}
                  {battle.character} vs {battle.monster}
                </span>

                <div className={styles.stats}>
                  <span>Раундов: {battle.rounds}</span>
                  <span>HP: {battle.playerHP}</span>
                  <span>
                    {battle.result === "win" ? "Победа" : "Поражение"}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      {onBack && (
        <button
          onClick={onBack}
          style={{
            marginTop: "2rem",
            background: "#4b5563",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ← Назад
        </button>
      )}
    </div>
  );
}
