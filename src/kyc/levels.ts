// Уровни верификации пользователя
export type KycLevel = 0 | 1 | 2 | 3;

export interface KycProfile {
  level: KycLevel;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  email?: string;
  emailVerified?: boolean;
  passportSubmitted?: boolean;
  selfieSubmitted?: boolean;
  sourceOfFundsSubmitted?: boolean;
  status: 'active' | 'under_review' | 'blocked';
  updatedAt: string;
}

export const LEVEL_INFO: Record<KycLevel, {
  title: string;
  description: string;
  features: string[];
  limits: { convert: string; withdraw: string };
}> = {
  0: {
    title: 'Анонимный',
    description: 'Базовая регистрация по телефону',
    features: ['Получение КОН', 'Траты в магазинах'],
    limits: { convert: 'Недоступно', withdraw: 'Недоступно' },
  },
  1: {
    title: 'Базовый',
    description: 'ФИО, email, дата рождения',
    features: ['Обмен КОН → CON', 'Лимит 15 000 ₽/мес'],
    limits: { convert: '15 000 ₽/мес', withdraw: 'Недоступно' },
  },
  2: {
    title: 'Стандартный',
    description: 'Паспорт + селфи',
    features: ['Полный обмен', 'Вывод в рубли', 'Стейкинг'],
    limits: { convert: '600 000 ₽/мес', withdraw: '200 000 ₽/сутки' },
  },
  3: {
    title: 'Расширенный',
    description: 'Подтверждение источника дохода',
    features: ['Без лимитов по сумме', 'VIP-функции'],
    limits: { convert: 'Без лимита', withdraw: '1 000 000 ₽/сутки' },
  },
};

const STORAGE_KEY = 'con_kyc_profile';

export function getKycProfile(): KycProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return { level: 0, status: 'active', updatedAt: new Date().toISOString() };
}

export function saveKycProfile(profile: KycProfile): void {
  profile.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function upgradeLevel(level: KycLevel, data: Partial<KycProfile>): KycProfile {
  const profile = { ...getKycProfile(), ...data, level };
  saveKycProfile(profile);
  return profile;
}
