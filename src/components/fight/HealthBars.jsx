import styles from "../../styles/Fight.module.css";

export default function HealthBars({ char, playerHP, monster, monsterHP }) {
  return (
    <div className={styles.hpWrapper}>
      <div className={styles.box}>
        <img src={char.avatar} alt="Player avatar" className={styles.avatar} />
        <p className={styles.bold}>{char.name}</p>
        <div className={styles.healthBar}>
          <div
            className={styles.healthFill}
            style={{ width: `${(playerHP / 100) * 100}%` }}
          />
          <span>HP: {playerHP}</span>
        </div>
      </div>

      <div className={styles.vs}>VS</div>

      <div className={styles.box}>
        <img
          src={monster.avatar}
          alt="Monster avatar"
          className={styles.avatar}
        />
        <p className={styles.bold}>{monster.name}</p>
        <div className={styles.healthBar}>
          <div
            className={styles.healthFill}
            style={{ width: `${(monsterHP / monster.health) * 100}%` }}
          />
          <span>HP: {monsterHP}</span>
        </div>
      </div>
    </div>
  );
}
