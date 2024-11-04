import { fruitData } from "../mocks/fruitData";

// Base emoji mappings for common fruits
const baseEmojis: Record<string, string> = {
  Apple: "🍎",
  GreenApple: "🍏",
  Pear: "🍐",
  Orange: "🍊",
  Lemon: "🍋",
  Banana: "🍌",
  Watermelon: "🍉",
  Grape: "🍇",
  Melon: "🈲",
  Strawberry: "🍓",
  Cherry: "🍒",
  Peach: "🍑",
  Mango: "🥭",
  Pineapple: "🍍",
  Coconut: "🥥",
  Kiwi: "🥝",
  Kiwifruit: "🥝",
  Avocado: "🥑",
  Blueberry: "🫐",
  Tomato: "🍅",
};

// Extended emoji mappings for other fruits
const extendedEmojis: Record<string, string> = {
  Persimmon: "🍊",
  Durian: "🥝",
  Blackberry: "🫐",
  Lingonberry: "🫐",
  Lychee: "🔴",
  Fig: "🟣",
  Gooseberry: "🫐",
  Passionfruit: "🟡",
  Plum: "🟣",
  Raspberry: "🔴",
  Guava: "🟢",
  Apricot: "🟠",
  Tangerine: "🍊",
  Pitahaya: "🔴",
  Lime: "🟢",
  Pomegranate: "🔴",
  Dragonfruit: "🔴",
  Morus: "🫐",
  Feijoa: "🟢",
  Cranberry: "🔴",
  Jackfruit: "🟡",
  "Horned Melon": "🟡",
  Hazelnut: "🟤",
  Pomelo: "🟡",
  Mangosteen: "🟣",
  Pumpkin: "🎃",
  "Japanese Persimmon": "🟠",
  Papaya: "🟠",
  Annona: "🟢",
  "Ceylon Gooseberry": "🟡",
};

// Generate complete emoji mapping from fruitData
export const fruitEmojis: Record<string, string> = fruitData.reduce((acc, fruit) => {
  acc[fruit.name] = baseEmojis[fruit.name] || extendedEmojis[fruit.name] || "🍎";
  return acc;
}, {} as Record<string, string>);

// Default emoji for unknown fruits
fruitEmojis.default = "🍎";

