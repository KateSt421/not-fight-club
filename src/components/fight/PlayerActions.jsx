import styles from "../../styles/Fight.module.css";

export default function PlayerActions({
  attackZones,
  playerAttack,
  playerDefense,
  onZoneSelect,
}) {
  return (
    <div className={styles.playerSection}>
      <h3>Ваши действия:</h3>

      <div className={styles.zoneSelection}>
        <h4>Атака (выберите 1 зону):</h4>
        <div className={styles.zones}>
          {attackZones.map((zone) => (
            <button
              key={zone.id}
              className={`${styles.zoneButton} ${
                playerAttack.includes(zone.id) ? styles.selectedAttack : ""
              }`}
              onClick={() => onZoneSelect(zone.id, "attack")}
              disabled={
                playerAttack.length >= 1 && !playerAttack.includes(zone.id)
              }
            >
              {zone.icon} {zone.name}
              {playerAttack.includes(zone.id) && " ✅"}
            </button>
          ))}
        </div>
        <p className={styles.selectionInfo}>Выбрано: {playerAttack.length}/1</p>
      </div>

      <div className={styles.zoneSelection}>
        <h4>Защита (выберите 2 зоны):</h4>
        <div className={styles.zones}>
          {attackZones.map((zone) => (
            <button
              key={zone.id}
              className={`${styles.zoneButton} ${
                playerDefense.includes(zone.id) ? styles.selectedDefense : ""
              }`}
              onClick={() => onZoneSelect(zone.id, "defense")}
              disabled={
                playerDefense.length >= 2 && !playerDefense.includes(zone.id)
              }
            >
              {zone.icon} {zone.name}
              {playerDefense.includes(zone.id) && " ✅"}
            </button>
          ))}
        </div>
        <p className={styles.selectionInfo}>
          Выбрано: {playerDefense.length}/2
        </p>
      </div>
    </div>
  );
}
