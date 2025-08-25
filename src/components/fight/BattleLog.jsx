import styles from "../../styles/Fight.module.css";

export default function BattleLog({ log }) {
  return (
    <div className={styles.log}>
      <h3>📜 Журнал боя</h3>
      {log.map((entry, idx) => (
        <p key={idx}>{entry}</p>
      ))}
    </div>
  );
}
