export const getCharacter = () => {
  try {
    const char = JSON.parse(localStorage.getItem("character")) || {};
    return {
      name: char.name || "",
      avatar: char.avatar || "avatars/yoda.jpg",
      wins: char.wins || 0,
      loses: char.loses || 0,
    };
  } catch (e) {
    console.error("Ошибка чтения персонажа из localStorage:", e);
    return { name: "", avatar: "avatars/yoda.jpg", wins: 0, loses: 0 };
  }
};

export const setCharacter = (char) => {
  try {
    localStorage.setItem(
      "character",
      JSON.stringify({
        name: char.name || "",
        avatar: char.avatar || "avatars/yoda.jpg",
        wins: char.wins || 0,
        loses: char.loses || 0,
      })
    );
  } catch (e) {
    console.error("Ошибка сохранения персонажа в localStorage:", e);
  }
};

export const clearCharacter = () => {
  try {
    localStorage.removeItem("character");
  } catch (e) {
    console.error("Ошибка очистки персонажа в localStorage:", e);
  }
};
