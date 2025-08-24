import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCharacter } from "../utils/storage";
import styles from "../styles/Register.module.css";
import container from "../styles/Container.module.css";

export default function Register() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("/avatars/yoda.jpg");
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!name) return alert("Введите имя!");
    const character = { name, avatar, wins: 0, loses: 0 };
    setCharacter(character);
    navigate("/main");
  };

  const avatars = [
    "/avatars/1fabe4d4-bdfc-4b0a-a295-77fb0fd4bc39.jpg",
    "/avatars/yoda.jpg",
    "/avatars/89c49be9-433b-41c3-a3be-8a96cf540021.jpg",
    "/avatars/b8999b5e-adef-4949-9ec0-3992627e78fd.jpg",
    "/avatars/dde8f914-c67d-4666-bd45-f4a6529f259c.jpg",
    "/avatars/de173f5b-a12b-4002-b03e-235616bc66dd.jpg",
  ];

  return (
    <div className={container.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Create Your Character</h1>

        <input
          className={styles.input}
          placeholder="Character Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <h3 className={styles.choose}>Выберите аватар:</h3>
        <div className={styles.avatars}>
          {avatars.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt="avatar"
              className={`${styles.avatar} ${
                avatar === src ? styles.active : ""
              }`}
              onClick={() => setAvatar(src)}
            />
          ))}
        </div>

        <button onClick={handleCreate} className={styles.button}>
          Create Character
        </button>
      </div>
    </div>
  );
}
