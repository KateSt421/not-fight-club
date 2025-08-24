import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCharacter, setCharacter } from "../utils/storage";
import styles from "../styles/Register.module.css";
import container from "../styles/Container.module.css";

export default function Register() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("/not-fight-club/avatars/yoda.jpg");
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const char = getCharacter();
    if (char.name) {
      navigate("/main", { replace: true });
    }
  }, [navigate]);

  const handleCreate = () => {
    if (!name.trim()) return alert("Введите имя!");
    const character = {
      name: name.trim(),
      avatar,
      wins: 0,
      loses: 0,
    };
    setCharacter(character);
    navigate("/main");
  };

  const avatars = [
    "/not-fight-club/avatars/1fabe4d4-bdfc-4b0a-a295-77fb0fd4bc39.jpg",
    "/not-fight-club/avatars/yoda.jpg",
    "/not-fight-club/avatars/89c49be9-433b-41c3-a3be-8a96cf540021.jpg",
    "/not-fight-club/avatars/b8999b5e-adef-4949-9ec0-3992627e78fd.jpg",
    "/not-fight-club/avatars/dde8f914-c67d-4666-bd45-f4a6529f259c.jpg",
    "/not-fight-club/avatars/de173f5b-a12b-4002-b03e-235616bc66dd.jpg",
  ];

  const handleImageError = (e, src) => {
    console.error("Image not found:", src);
    e.target.style.display = "none";
    setLoadedImages((prev) => ({ ...prev, [src]: false }));
  };

  const handleImageLoad = (e, src) => {
    console.log("Image loaded successfully:", src);
    e.target.style.display = "block";
    setLoadedImages((prev) => ({ ...prev, [src]: true }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      console.log("Loaded images status:", loadedImages);
    }, 1000);

    return () => clearTimeout(timer);
  }, [loadedImages]);

  return (
    <div className={container.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Create Your Character</h1>

        <input
          className={styles.input}
          placeholder="Character Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleCreate()}
        />

        <h3 className={styles.choose}>Выберите аватар:</h3>

        {loading && <p className={styles.loading}>Loading avatars...</p>}

        <div className={styles.avatars}>
          {avatars.map((src, idx) => (
            <div key={idx} className={styles.avatarContainer}>
              <img
                src={src}
                alt="avatar"
                className={`${styles.avatar} ${
                  avatar === src ? styles.active : ""
                }`}
                onClick={() => setAvatar(src)}
                onError={(e) => handleImageError(e, src)}
                onLoad={(e) => handleImageLoad(e, src)}
              />
              {!loadedImages[src] && loadedImages[src] !== undefined && (
                <div className={styles.error}>Not found</div>
              )}
            </div>
          ))}
        </div>

        {avatar && (
          <div className={styles.selectedAvatar}>
            <p>Selected avatar:</p>
            <img
              src={avatar}
              alt="selected"
              className={styles.preview}
              onError={(e) => handleImageError(e, avatar)}
              onLoad={(e) => handleImageLoad(e, avatar)}
            />
          </div>
        )}

        <button
          onClick={handleCreate}
          className={styles.button}
          disabled={!name.trim()}
        >
          Create Character
        </button>
      </div>
    </div>
  );
}
