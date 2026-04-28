import type { Boat } from "../types";

export const BOATS: Boat[] = [
  {
    id: "solar-380-jet",
    name: "SOLAR-380 Jet tunnel",
    length: 3.8,
    capacity: 4,
    maxMotor: 15,
    weight: 45,
    price: 136100,
    emoji: "🛶",
    tag: "Компактная",
    image: "/images/partners/semrek/boats/solar-380-jet.jpg",
  },
  {
    id: "solar-420-jet",
    name: "SOLAR-420 Jet tunnel",
    length: 4.2,
    capacity: 5,
    maxMotor: 20,
    weight: 52,
    price: 161700,
    emoji: "🚣",
    tag: "Хит",
    image: "/images/partners/semrek/boats/solar-420-jet.jpg",
  },
  {
    id: "solar-450-jet",
    name: "SOLAR-450 Jet tunnel",
    length: 4.5,
    capacity: 6,
    maxMotor: 30,
    weight: 62,
    price: 189500,
    emoji: "⛵",
    image: "/images/partners/semrek/boats/solar-450-jet.jpg",
  },
  {
    id: "solar-470-strela",
    name: "SOLAR-470 Strela Jet",
    length: 4.7,
    capacity: 6,
    maxMotor: 40,
    weight: 68,
    price: 215800,
    emoji: "🛥️",
    tag: "Скоростная",
    image: "/images/partners/semrek/boats/solar-470-strela.jpg",
  },
  {
    id: "solar-500-jet",
    name: "SOLAR-500 Jet tunnel",
    length: 5.0,
    capacity: 7,
    maxMotor: 50,
    weight: 78,
    price: 245600,
    emoji: "⚓",
    tag: "Флагман",
    image: "/images/partners/semrek/boats/solar-500-jet.jpg",
  },
  {
    id: "solar-520-strela",
    name: "SOLAR-520 Strela Jet",
    length: 5.2,
    capacity: 8,
    maxMotor: 60,
    weight: 85,
    price: 289900,
    emoji: "🚤",
    tag: "Премиум",
    image: "/images/partners/semrek/boats/solar-520-strela.jpg",
  },
];

export const COLORS = [
  { id: "grey", label: "Серый", hex: "#6b7280" },
  { id: "khaki", label: "Хаки", hex: "#78716c" },
  { id: "black", label: "Чёрный", hex: "#1f2937" },
  { id: "blue", label: "Синий", hex: "#1e40af" },
];

export const MOTORS = [
  { id: 0, label: "Без мотора", price: 0 },
  { id: 5, label: "5 л.с.", price: 45000 },
  { id: 9.9, label: "9.9 л.с.", price: 78000 },
  { id: 15, label: "15 л.с.", price: 125000 },
  { id: 20, label: "20 л.с.", price: 165000 },
  { id: 30, label: "30 л.с.", price: 245000 },
];

export const FLOORS = [
  { id: "none", label: "Без настила", price: 0 },
  { id: "plywood", label: "Фанерный", price: 7500 },
  { id: "aluminium", label: "Алюминиевый", price: 22000 },
];

export const EXTRAS = [
  { id: "oars", label: "Весла усиленные", price: 1800, emoji: "🚣" },
  { id: "pump", label: "Электронасос 12В", price: 3500, emoji: "💨" },
  { id: "anchor", label: "Якорь складной 3 кг", price: 2200, emoji: "⚓" },
  { id: "bag", label: "Сумка-рюкзак", price: 4500, emoji: "🎒" },
  { id: "repair", label: "Ремкомплект", price: 1200, emoji: "🔧" },
];

export const BASE_PRICE_BY_LENGTH: Record<number, number> = {
  3.8: 136100,
  4.2: 161700,
  4.5: 189500,
  4.7: 215800,
  5.0: 245600,
  5.2: 289900,
};

export const REGIONS = [
  { id: "msk", label: "Москва и МО", pickup: 0, courier: 0, transport: 0 },
  { id: "spb", label: "Санкт-Петербург", pickup: 0, courier: 1500, transport: 1500 },
  { id: "nsk", label: "Новосибирск", pickup: 0, courier: 3500, transport: 3500 },
  { id: "ekb", label: "Екатеринбург", pickup: 0, courier: 3000, transport: 3000 },
  { id: "kzn", label: "Казань", pickup: 0, courier: 2500, transport: 2500 },
  { id: "nng", label: "Нижний Новгород", pickup: 0, courier: 2000, transport: 2000 },
  { id: "other", label: "Другой регион", pickup: 0, courier: 5000, transport: 5000 },
];
