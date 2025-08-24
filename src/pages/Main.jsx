import { useNavigate } from "react-router-dom";
import { getCharacter } from "../utils/storage";
import styles from "../styles/Main.module.css";
import container from "../styles/Container.module.css";

export default function Main() {
  const navigate = useNavigate();
  const char = getCharacter();

  return (
    <div className={container.container}>
      <div className={styles.wrapper}>
        <h2 className={styles.welcome}>Welcome, {char.name}!</h2>
        <button
          onClick={() => navigate("/fight")}
          className={styles.fightButton}
        >
          Fight!
        </button>
        <button
          onClick={() => navigate("/character")}
          className={styles.charButton}
        >
          Character Page
        </button>
      </div>
    </div>
  );
}
