export const companyInfo = {
  name: "Семь рек",
  fullName: 'Лодочный центр «Семь рек»',
  address: "Красноярск, ул. Туристская, стр. 126",
  phone: "+7 (904) 892-84-57",
  email: "info@semrek.ru",
  workHours: "Ежедневно 9:00–20:00",
  about: [
    "Лодочный центр «Семь рек» — крупнейший в Красноярске специализированный магазин по продаже, ремонту и тюнингу лодок ПВХ.",
    "Мы работаем с 2015 года и за это время обслужили более 1200 клиентов.",
    "Предлагаем полный цикл услуг: от подбора лодки до её доработки под ваши задачи."
  ],
  stats: [
    { value: "511", label: "Отремонтировано лодок" },
    { value: "341", label: "Забронировано днищ" },
    { value: "394", label: "Доработано лодок" },
    { value: "1246", label: "Довольных клиентов" },
  ],
};

export interface Product {
  id: string;
  category: "boat" | "motor" | "accessory";
  name: string;
  description: string;
  price: number;
  image: string;
  specs: Record<string, string>;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "solar-420-jet",
    category: "boat",
    name: "SOLAR 420 Jet Tunnel",
    description: "Надувная моторная лодка с водомётным тоннелем. Грузоподъёмность 800 кг, длина 4.2 м, ширина 2 м, диаметр баллона 0.5 м. Вес 80 кг.",
    price: 139900,
    image: "/partners/semrek/boats/solar-420-jet.jpg",
    specs: { Длина: "4,2 м", Ширина: "2,0 м", "Грузоподъёмность": "800 кг", Мотор: "до 80 кг на транце" },
    inStock: true,
  },
  {
    id: "solar-430-sjt-fb",
    category: "boat",
    name: "SOLAR 430 Super Jet Tunnel с фальшбортом",
    description: "Надувная моторная лодка с водомётным тоннелем, фальшбортом и камуфляжным окрасом. Грузоподъёмность 700 кг, длина 4.3 м, ширина 1.75 м. Вес 75 кг.",
    price: 167100,
    image: "/partners/semrek/boats/solar-430-sjt-fb.jpg",
    specs: { Длина: "4,3 м", Ширина: "1,75 м", "Грузоподъёмность": "700 кг", Мотор: "до 80 кг на транце" },
    inStock: true,
  },
  {
    id: "solar-470-sjt",
    category: "boat",
    name: "SOLAR 470 Super Jet Tunnel",
    description: "Надувная моторная лодка с водомётным тоннелем. Грузоподъёмность 900 кг, длина 4.7 м, ширина 1.9 м.",
    price: 186800,
    image: "/partners/semrek/boats/solar-470-sjt.jpg",
    specs: { Длина: "4,7 м", Ширина: "1,9 м", "Грузоподъёмность": "900 кг", Мотор: "до 100 кг на транце" },
    inStock: true,
  },
  {
    id: "mercury-5",
    category: "motor",
    name: "Mercury 5 М",
    description: "Надёжный четырёхтактный мотор 5 л.с. Лёгкий, экономичный, идеален для лодок до 3,6 м.",
    price: 36950,
    image: "/partners/semrek/motors/mercury-5.jpg",
    specs: { Мощность: "5 л.с.", Тактность: "4-тактный", Вес: "25 кг", "Объём бака": "1,5 л", Запуск: "Ручной" },
    inStock: true,
  },
  {
    id: "mercury-9.9",
    category: "motor",
    name: "Mercury F 9.9 ML",
    description: "Популярный мотор 9,9 л.с. с длинной ногой. Отличное сочетание мощности и экономичности.",
    price: 58900,
    image: "/partners/semrek/motors/mercury-9.9.jpg",
    specs: { Мощность: "9,9 л.с.", Тактность: "4-тактный", Вес: "38 кг", "Объём бака": "2,5 л", Запуск: "Ручной" },
    inStock: true,
  },
  {
    id: "mercury-15",
    category: "motor",
    name: "Mercury F 15 MH",
    description: "Мотор 15 л.с. для средних лодок ПВХ. Короткая нога, высокая тяга, низкий расход топлива.",
    price: 72900,
    image: "/partners/semrek/motors/mercury-15.jpg",
    specs: { Мощность: "15 л.с.", Тактность: "4-тактный", Вес: "42 кг", "Объём бака": "3,0 л", Запуск: "Ручной/электро" },
    inStock: true,
  },
  {
    id: "tent",
    category: "accessory",
    name: "Тент ходовой Sibriver",
    description: "Прочный тент из оксфорда 600D с прозрачными вставками. Защита от дождя и ветра.",
    price: 12400,
    image: "/partners/semrek/accessories/tent.jpg",
    specs: { Материал: "Оксфорд 600D", "Тип крепления": "На трубы", Вес: "4,5 кг", Цвет: "Серый/хаки", Гарантия: "1 год" },
    inStock: true,
  },
  {
    id: "trailer",
    category: "accessory",
    name: "Прицеп МЗСА 81771G",
    description: "Лодочный прицеп для транспортировки лодок до 4,5 м. Оцинкованный кузов, рессорная подвеска.",
    price: 136200,
    image: "/partners/semrek/accessories/trailer.jpg",
    specs: { "Грузоподъёмность": "450 кг", "Длина кузова": "3,8 м", Подвеска: "Рессорная", Тормоза: "Нет", Ось: "Одноосный" },
    inStock: true,
  },
];

export interface Service {
  id: string;
  name: string;
  description: string;
  priceFrom: number;
  image: string;
  duration: string;
}

export const services: Service[] = [
  {
    id: "repair",
    name: "Ремонт лодок ПВХ",
    description: "Профессиональный ремонт порезов, швов, замена транцев, ремонт брони. Письменная гарантия.",
    priceFrom: 2500,
    image: "/partners/semrek/services/repair.jpg",
    duration: "1–2 дня",
  },
  {
    id: "armor",
    name: "Бронирование днища",
description: "Защита днища лодки от абразивного износа. Увеличивает срок службы в 3–5 раз.",
    priceFrom: 8500,
    image: "/partners/semrek/services/armor.jpg",
    duration: "2–3 дня",
  },
  {
    id: "tuning",
    name: "Тюнинг лодок",
    description: "Установка фальшбортов, транцевых колёс, якорных устройств, дополнительных сидений.",
    priceFrom: 3500,
    image: "/partners/semrek/services/tuning.jpg",
    duration: "1–3 дня",
  },
  {
    id: "tent-sew",
    name: "Пошив тентов",
    description: "Индивидуальный пошив тентов, чехлов, сумок для лодок любых размеров.",
    priceFrom: 4500,
    image: "/partners/semrek/services/tent-sew.jpg",
    duration: "3–5 дней",
  },
];
