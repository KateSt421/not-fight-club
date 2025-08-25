import styles from "../../styles/Fight.module.css";

export default function FightHeader({ char, monster, round }) {
  return (
    <>
      <h2 className={styles.title}>
        Бой: {char.name} vs {monster.name}
      </h2>
      <p className={styles.round}>Раунд: {round}</p>
    </>
  );
}
