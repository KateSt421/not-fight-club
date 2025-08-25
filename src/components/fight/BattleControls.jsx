import styles from "../../styles/Fight.module.css";

export default function BattleControls({
  onAttack,
  onSurrender,
  isAttackDisabled,
  round,
}) {
  return (
    <div className={styles.buttons}>
      <button
        onClick={onAttack}
        className={styles.attack}
        disabled={isAttackDisabled}
      >
        ⚔️ Атаковать (Раунд {round})
      </button>
      <button onClick={onSurrender} className={styles.surrender}>
        🏳️ Сдаться
      </button>
    </div>
  );
}
