import { useState } from "react";
import { getCharacter, setCharacter } from "../utils/storage";
import styles from "../styles/Character.module.css";
import container from "../styles/Container.module.css";

export default function Character() {
  const [char, setChar] = useState(getCharacter());

  const changeAvatar = (avatar) => {
    const updated = { ...char, avatar };
    setChar(updated);
    setCharacter(updated);
  };

  return (
    <div className={container.container}>
      <div className={styles.wrapper}>
        <img src={char.avatar} alt="avatar" className={styles.avatar} />
        <h2 className={styles.name}>{char.name}</h2>
        <p>Wins: {char.wins}</p>
        <p>Loses: {char.loses}</p>

        <h3 className={styles.choose}>Выбери аватар:</h3>
        <div className={styles.avatars}>
          <img
            src="/avatars/yoda.png"
            alt="Yoda"
            onClick={() => changeAvatar("/avatars/yoda.png")}
          />
          <img
            src="/avatars/vader.png"
            alt="Vader"
            onClick={() => changeAvatar("/avatars/vader.png")}
          />
          <img
            src="/avatars/stormtrooper.png"
            alt="Stormtrooper"
            onClick={() => changeAvatar("/avatars/stormtrooper.png")}
          />
        </div>
      </div>
    </div>
  );
}
