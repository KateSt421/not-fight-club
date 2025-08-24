import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCharacter, setCharacter } from "../utils/storage";
import styles from "../styles/Character.module.css";
import container from "../styles/Container.module.css";

export default function Character() {
  const [char, setChar] = useState(getCharacter());
  const navigate = useNavigate();

  useEffect(() => {
    if (!char.name) {
      navigate("/", { replace: true });
    }
  }, [char.name, navigate]);

  const avatars = [
    "avatars/1fabe4d4-bdfc-4b0a-a295-77fb0fd4bc39.jpg",
    "avatars/yoda.jpg",
    "avatars/89c49be9-433b-41c3-a3be-8a96cf540021.jpg",
    "avatars/b8999b5e-adef-4949-9ec0-3992627e78fd.jpg",
    "avatars/dde8f914-c67d-4666-bd45-f4a6529f259c.jpg",
    "avatars/de173f5b-a12b-4002-b03e-235616bc66dd.jpg",
  ];

  const changeAvatar = (avatar) => {
    const updated = { ...char, avatar };
    setChar(updated);
    setCharacter(updated);
  };

  const handleImageError = (e) => {
    console.error("Image not found:", e.target.src);
    e.target.style.display = "none";
  };

  return (
    <div className={container.container}>
      <div className={styles.wrapper}>
        <img
          src={char.avatar}
          alt="avatar"
          className={styles.avatarBig}
          onError={handleImageError}
        />
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
              onError={handleImageError}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
