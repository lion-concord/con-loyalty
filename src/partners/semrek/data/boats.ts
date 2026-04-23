import type { Boat } from "../types";

export const BOATS: Boat[] = [
  {
    id: "sr-300",
    name: "Семирек 300",
    length: 3.0,
    capacity: 2,
    maxMotor: 5,
    weight: 24,
    price: 45900,
    emoji: "🛶",
    tag: "Старт",
  },
  {
    id: "sr-330",
    name: "Семирек 330",
    length: 3.3,
    capacity: 3,
    maxMotor: 9.9,
    weight: 31,
    price: 58500,
    emoji: "🚣",
  },
  {
    id: "sr-360",
    name: "Семирек 360 Люкс",
    length: 3.6,
    capacity: 4,
    maxMotor: 15,
    weight: 42,
    price: 79900,
    emoji: "⛵",
    tag: "Хит",
  },
  {
    id: "sr-400",
    name: "Семирек 400 Турист",
    length: 4.0,
    capacity: 4,
    maxMotor: 20,
    weight: 51,
    price: 98500,
    emoji: "🛥️",
  },
  {
    id: "sr-420",
    name: "Семирек 420 Рыбак",
    length: 4.2,
    capacity: 5,
    maxMotor: 25,
    weight: 58,
    price: 119900,
    emoji: "🎣",
    tag: "Новинка",
  },
  {
    id: "sr-460",
    name: "Семирек 460 Капитан",
    length: 4.6,
    capacity: 6,
    maxMotor: 30,
    weight: 72,
    price: 149900,
    emoji: "⚓",
    tag: "Премиум",
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
];

export const FLOORS = [
  { id: "none", label: "Без настила", price: 0 },
  { id: "plywood", label: "Фанерный", price: 7500 },
  { id: "aluminium", label: "Алюминиевый", price: 18900 },
];

export const EXTRAS = [
  { id: "oars", label: "Весла", price: 2500, emoji: "🚣" },
  { id: "pump", label: "Насос", price: 3200, emoji: "💨" },
  { id: "anchor", label: "Якорь", price: 4800, emoji: "⚓" },
  { id: "tent", label: "Тент", price: 12500, emoji: "⛺" },
];

export const BASE_PRICE_BY_LENGTH: Record<number, number> = {
  3.0: 42000,
  3.3: 55000,
  3.6: 72000,
  4.0: 92000,
};

export const REGIONS = [
  { id: "msk", label: "Москва и МО", pickup: 0, courier: 2500, transport: 8900 },
  { id: "spb", label: "Санкт-Петербург и ЛО", pickup: 0, courier: 2800, transport: 9500 },
  { id: "south", label: "Юг России (Краснодар, Ростов)", pickup: 0, courier: 3500, transport: 11500 },
  { id: "central", label: "Центральный регион", pickup: 0, courier: 3200, transport: 10800 },
  { id: "ural", label: "Урал и Сибирь", pickup: 0, courier: 4500, transport: 16500 },
  { id: "far", label: "Дальний Восток", pickup: 0, courier: 6800, transport: 28000 },
];
