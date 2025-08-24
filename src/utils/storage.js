// Получить данные персонажа из localStorage
export const getCharacter = () => {
  try {
    return JSON.parse(localStorage.getItem("character")) || {};
  } catch (e) {
    console.error("Ошибка чтения персонажа из localStorage:", e);
    return {};
  }
};

// Сохранить данные персонажа в localStorage
export const setCharacter = (char) => {
  try {
    localStorage.setItem("character", JSON.stringify(char));
  } catch (e) {
    console.error("Ошибка сохранения персонажа в localStorage:", e);
  }
};

// Очистить персонажа
export const clearCharacter = () => {
  try {
    localStorage.removeItem("character");
  } catch (e) {
    console.error("Ошибка очистки персонажа в localStorage:", e);
  }
};
