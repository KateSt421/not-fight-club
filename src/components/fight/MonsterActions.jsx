import styles from "../../styles/Fight.module.css";

export default function MonsterActions({
  monster,
  monsterAttack,
  monsterDefense,
  getZoneName,
  getZoneIcon,
}) {
  return (
    <div className={styles.monsterSection}>
      <h3>Действия {monster.name}:</h3>

      <div className={styles.monsterStats}>
        <p>⚔️ Атака: {monster.attackZones} зоны</p>
        <p>🛡️ Защита: {monster.defenseZones} зоны</p>
        <p>💢 Урон: {monster.damage}</p>
      </div>

      <div className={styles.monsterActions}>
        <h4>Атакует:</h4>
        <div className={styles.monsterZones}>
          {monsterAttack.map((zoneId) => (
            <span key={zoneId} className={styles.monsterZone}>
              {getZoneIcon(zoneId)} {getZoneName(zoneId)}
            </span>
          ))}
        </div>

        <h4>Защищает:</h4>
        <div className={styles.monsterZones}>
          {monsterDefense.map((zoneId) => (
            <span key={zoneId} className={styles.monsterZone}>
              {getZoneIcon(zoneId)} {getZoneName(zoneId)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
