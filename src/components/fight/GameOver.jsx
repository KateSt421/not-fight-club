import styles from "../../styles/Fight.module.css";

export default function GameOver({ playerHP, onBackToMain }) {
  return (
    <div className={styles.gameOver}>
      <h2>{playerHP > 0 ? "🎉 Победа!" : "💀 Поражение"}</h2>
      <button onClick={onBackToMain} className={styles.back}>
        На главную
      </button>
    </div>
  );
}
