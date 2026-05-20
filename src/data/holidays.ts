import { HolidayPreset } from "../types";

export const HOLIDAY_PRESETS: HolidayPreset[] = [
  {
    id: "christmas",
    name: "Boże Narodzenie",
    date: "25 grudnia",
    description: "Czas świątecznej atmosfery, ciepła, życzeń, prezentów i podsumowań roku. Idealny na posty pełne wdzięczności i życzeń.",
    emojis: ["🎄", "🎁", "❄️", "🎅", "✨", "🦌"],
    stickers: ["🎄", "🎁", "❄️", "☃️", "✨", "🔔", "⭐", "🕯️"],
    gradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", // Evening Pine
    textPreset: {
      title: "Wesołych Świąt!",
      subtitle: "Spokojnego i magicznego czasu"
    }
  },
  {
    id: "newyear",
    name: "Sylwester & Nowy Rok",
    date: "31 grudnia / 1 stycznia",
    description: "Czas planów, postanowień noworocznych, hucznych zabaw, podsumowań i motywacji do zmian.",
    emojis: ["🍾", "🥂", "🎆", "✨", "🎉", "👑"],
    stickers: ["🥂", "🎇", "🎉", "✨", "⭐", "🍾", "🎈", "🕶️"],
    gradient: "linear-gradient(135deg, #0d0d0d, #2b2b2b, #1a1a1a)", // Midnight Gold / Dark
    textPreset: {
      title: "Szczęśliwego Nowego Roku!",
      subtitle: "Nowe cele, nowe możliwości"
    }
  },
  {
    id: "easter",
    name: "Wielkanoc",
    date: "Kwiecień / Kwiecień-Maj (Ruchome)",
    description: "Symbolika wiosny, nowego życia, Spotkań rodzinnych i tradycji wielkanocnych.",
    emojis: ["🐣", "🥚", "🐰", "🌷", "🌾"],
    stickers: ["🐰", "🐣", "🥚", "🌷", "🌸", "🦋", "🌱", "🏡"],
    gradient: "linear-gradient(135deg, #a8ff78, #78ffd6)", // Fresh Spring
    textPreset: {
      title: "Radosnych Świąt Wielkanocnych",
      subtitle: "Wiosennego ciepła i miłych chwil"
    }
  },
  {
    id: "halloween",
    name: "Halloween",
    date: "31 października",
    description: "Motywy strachu, humoru, przebrań, dyń oraz wieczornych zabaw. Świetna okazja do interakcji i luźniejszych postów.",
    emojis: ["🎃", "👻", "🦇", "🕷️", "🍬"],
    stickers: ["🎃", "👻", "🦇", "🕷️", "🕸️", "🔮", "🦉", "💀"],
    gradient: "linear-gradient(135deg, #0f0c20, #2c1a4d, #c45a00)", // Spooky Orange-Purple
    textPreset: {
      title: "Strasznie fajny czas!",
      subtitle: "Cukierek albo psikus"
    }
  },
  {
    id: "valentines",
    name: "Walentynki",
    date: "14 lutego",
    description: "Święto miłości, przyjaźni, obdarowywania bliskich osób upominkami i celebrowania relacji.",
    emojis: ["❤️", "💖", "🌹", "🍫", "💌", "🥰"],
    stickers: ["❤️", "💖", "💘", "🌹", "💌", "🧸", "🎈", "🍫"],
    gradient: "linear-gradient(135deg, #ff0844, #ffb199)", // Sweet Pink/Red
    textPreset: {
      title: "Z miłości do...",
      subtitle: "Celebruj wyjątkowe chwile"
    }
  },
  {
    id: "womensday",
    name: "Dzień Kobiet",
    date: "8 marca",
    description: "Celebrowanie siły kobiecości, praw kobiet, kultywowanie szacunku i wdzięczności.",
    emojis: ["🌸", "💐", "💄", "👑", "✨"],
    stickers: ["🌸", "💐", " Tulipany", "👑", "💅", "💝", "🎗️", "🦋"],
    gradient: "linear-gradient(135deg, #fbc2eb, #a6c1ee)", // Pastel Lavender Blue
    textPreset: {
      title: "Święto Wszystkich Kobiet",
      subtitle: "Jesteś wyjątkowa każdego dnia"
    }
  },
  {
    id: "mothersday",
    name: "Dzień Matki",
    date: "26 maja",
    description: "Najcieplejsze podziękowania dla mam za ich trud, bezgraniczną miłość i wsparcie przez całe życie.",
    emojis: ["👩‍👧‍👦", "❤️", "🌹", "🤗", "💌"],
    stickers: ["❤️", "🌹", "💐", "🤗", "💌", "🎁", "⭐", "🍼"],
    gradient: "linear-gradient(135deg, #ff9a9e, #fecfef)", // Rose Soft
    textPreset: {
      title: "Dla Najlepszej Mamy na Świecie",
      subtitle: "Dziękuję, że jesteś"
    }
  },
  {
    id: "blackfriday",
    name: "Black Friday",
    date: "Listopad (Czwarty Piątek)",
    description: "Święto zakupów, wyprzedaży, specjalnych kuponów rabatowych i ofert limitowanych.",
    emojis: ["🛍️", "🏷️", "💳", "🔥", "🤩"],
    stickers: ["🛍️", "🏷️", "🔥", "🚀", "💥", "💵", "🤑", "📢"],
    gradient: "linear-gradient(135deg, #141e30, #243b55)", // Dark Steel Blue
    textPreset: {
      title: "CZARNY PIĄTEK!",
      subtitle: "Zniżki do -50% tylko dzisiaj"
    }
  }
];

export const FONT_OPTIONS = [
  { name: "Inter (Nowoczesny)", value: "Inter, sans-serif" },
  { name: "Space Grotesk (Tech)", value: "'Space Grotesk', system-ui, sans-serif" },
  { name: "Playfair Display (Serif/Klasyczny)", value: "'Playfair Display', Georgia, serif" },
  { name: "JetBrains Mono (Kodowy)", value: "'JetBrains Mono', monospace" },
  { name: "Pacifico (Retro Pismo)", value: "'Pacifico', cursive" },
  { name: "Anton (Gruby/Plakatowy)", value: "Anton, Impact, sans-serif" }
];

export const DIMENSIONS_PRESETS = [
  { name: "Instagram Kwadrat (1:1)", width: 1080, height: 1080, icon: "Square" },
  { name: "Facebook Portret / Link (1.91:1)", width: 1200, height: 630, icon: "RectangleHorizontal" },
  { name: "Relacja / TikTok / Story (9:16)", width: 1080, height: 1920, icon: "Smartphone" }
];
