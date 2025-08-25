export const monsters = [
  {
    id: 1,
    name: "Гоблин",
    avatar: "avatars/1fabe4d4-bdfc-4b0a-a295-77fb0fd4bc39.jpg",
    health: 80,
    attackZones: 1, // бьет в 1 зону
    defenseZones: 2, // блокирует 2 зоны
    damage: 15,
  },
  {
    id: 2,
    name: "Паук",
    avatar: "avatars/89c49be9-433b-41c3-a3be-8a96cf540021.jpg",
    health: 70,
    attackZones: 2, // бьет в 2 зоны
    defenseZones: 1, // блокирует 1 зону
    damage: 12,
  },
  {
    id: 3,
    name: "Тролль",
    avatar: "avatars/b8999b5e-adef-4949-9ec0-3992627e78fd.jpg",
    health: 120,
    attackZones: 1, // бьет в 1 зону
    defenseZones: 3, // блокирует 3 зоны
    damage: 20,
  },
];

export const attackZones = [
  { id: "head", name: "Голова", icon: "🧠" },
  { id: "torso", name: "Торс", icon: "💪" },
  { id: "legs", name: "Ноги", icon: "🦵" },
  { id: "arms", name: "Руки", icon: "✋" },
];
