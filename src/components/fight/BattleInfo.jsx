import styles from "../../styles/Fight.module.css";

export default function BattleInfo({ monster }) {
  return (
    <div className={styles.battleInfo}>
      <p>
        💡 Подсказка: {monster.name} атакует в {monster.attackZones} зону(ы) и
        защищает {monster.defenseZones} зону(ы)
      </p>
    </div>
  );
}
