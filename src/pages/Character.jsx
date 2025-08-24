import { useState } from "react";
import { getCharacter, setCharacter } from "../utils/storage";
import styles from "../styles/Character.module.css";
import container from "../styles/Container.module.css";

export default function Character() {
  const [char, setChar] = useState(getCharacter());

  const avatars = [
    "/avatars/yoda.png",
    "/avatars/vader.png",
    "/avatars/stormtrooper.png",
    "/avatars/luke.png",
    "/avatars/leia.png",
    "/avatars/chewbacca.png",
  ];

  const changeAvatar = (avatar) => {
    const updated = { ...char, avatar };
    setChar(updated);
    setCharacter(updated);
  };

  return (
    <div className={container.container}>
      <div className={styles.wrapper}>
        <img src={char.avatar} alt="avatar" className={styles.avatarBig} />
        <h2 className={styles.name}>{char.name}</h2>
        <p>Wins: {char.wins}</p>
        <p>Loses: {char.loses}</p>

        <h3 className={styles.choose}>Сменить аватар:</h3>
        <div className={styles.avatars}>
          {avatars.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt="avatar"
              className={`${styles.avatar} ${
                char.avatar === src ? styles.active : ""
              }`}
              onClick={() => changeAvatar(src)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
