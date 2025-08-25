import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCharacter, setCharacter } from "../utils/storage";
import styles from "../styles/Settings.module.css";
import container from "../styles/Container.module.css";

export default function Settings() {
  const [char, setChar] = useState(getCharacter());
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setNewName(char.name || "");
  }, [char.name]);

  const handleSave = () => {
    if (!newName.trim()) {
      setMessage("Имя не может быть пустым!");
      return;
    }

    if (newName.trim() === char.name) {
      setMessage("Это уже ваше текущее имя!");
      return;
    }

    const updated = { ...char, name: newName.trim() };
    setChar(updated);
    setCharacter(updated);
    setMessage("Имя успешно изменено!");

    setTimeout(() => setMessage(""), 3000);
  };

  const handleCancel = () => {
    navigate("/main");
  };

  return (
    <div className={container.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Настройки</h1>

        <div className={styles.currentInfo}>
          <img src={char.avatar} alt="avatar" className={styles.avatar} />
          <p>
            Текущий игрок: <strong>{char.name}</strong>
          </p>
        </div>

        <div className={styles.form}>
          <label htmlFor="name" className={styles.label}>
            Новое имя игрока:
          </label>
          <input
            id="name"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={styles.input}
            placeholder="Введите новое имя"
            maxLength={20}
          />

          {message && (
            <div
              className={`${styles.message} ${
                message.includes("успешно") ? styles.success : styles.error
              }`}
            >
              {message}
            </div>
          )}

          <div className={styles.buttons}>
            <button
              onClick={handleSave}
              className={styles.saveButton}
              disabled={!newName.trim() || newName.trim() === char.name}
            >
              Сохранить
            </button>
            <button onClick={handleCancel} className={styles.cancelButton}>
              Отмена
            </button>
          </div>
        </div>

        <div className={styles.stats}>
          <h3>Статистика:</h3>
          <p>Побед: {char.wins}</p>
          <p>Поражений: {char.loses}</p>
        </div>
      </div>
    </div>
  );
}
