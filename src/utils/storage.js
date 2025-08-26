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

export const getBattleState = () => {
  try {
    return JSON.parse(localStorage.getItem("battleState")) || null;
  } catch (e) {
    console.error("Ошибка чтения состояния боя из localStorage:", e);
    return null;
  }
};

export const setBattleState = (battleState) => {
  try {
    if (battleState) {
      localStorage.setItem("battleState", JSON.stringify(battleState));
    } else {
      localStorage.removeItem("battleState");
    }
  } catch (e) {
    console.error("Ошибка сохранения состояния боя в localStorage:", e);
  }
};

export const clearBattleState = () => {
  try {
    localStorage.removeItem("battleState");
  } catch (e) {
    console.error("Ошибка очистки состояния боя в localStorage:", e);
  }
};

export const getBattleHistory = () => {
  try {
    return JSON.parse(localStorage.getItem("battleHistory")) || [];
  } catch (e) {
    console.error("Ошибка чтения истории боев из localStorage:", e);
    return [];
  }
};

export const addBattleToHistory = (battle) => {
  try {
    const history = getBattleHistory();
    history.push({
      timestamp: new Date().toISOString(),
      ...battle,
    });
    localStorage.setItem("battleHistory", JSON.stringify(history));
  } catch (e) {
    console.error("Ошибка сохранения истории боев в localStorage:", e);
  }
};

export const clearCharacter = () => {
  try {
    localStorage.removeItem("character");
    localStorage.removeItem("battleState");
    localStorage.removeItem("battleHistory");
  } catch (e) {
    console.error("Ошибка очистки персонажа в localStorage:", e);
  }
};
