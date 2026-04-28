export interface ClubStatusItem {
  key: string;
  title: string;
  minKon: number;
  perks: string[];
  shortLabel: string;
  icon: string;
}

export const CLUB_STATUSES: ClubStatusItem[] = [
  {
    key: "newbie",
    title: "Новичок",
    shortLabel: "Новичок",
    minKon: 0,
    icon: "◌",
    perks: [
      "Доступ к клубному профилю",
      "Старт участия в программе",
      "Базовые задания и активности",
    ],
  },
  {
    key: "member",
    title: "Участник",
    shortLabel: "Участник",
    minKon: 500,
    icon: "✦",
    perks: [
      "Расширенные задания в приложении",
      "Доступ к клубным предложениям",
      "Участие в сезонных активностях",
    ],
  },
  {
    key: "resident",
    title: "Резидент КОН",
    shortLabel: "Резидент",
    minKon: 1500,
    icon: "⬢",
    perks: [
      "Приоритетный доступ к новым предложениям",
      "Специальные клубные награды",
      "Статус постоянного участника",
    ],
  },
  {
    key: "leader",
    title: "Лидер КОН",
    shortLabel: "Лидер",
    minKon: 4000,
    icon: "◆",
    perks: [
      "Доступ к расширенным клубным привилегиям",
      "Участие в закрытых активностях",
      "Повышенный вес в рейтингах и достижениях",
    ],
  },
  {
    key: "ambassador",
    title: "Амбассадор КОН",
    shortLabel: "Амбассадор",
    minKon: 8000,
    icon: "✪",
    perks: [
      "Максимальный клубный статус",
      "Особые предложения и приглашения",
      "Приоритет в эксклюзивных активностях КОН",
    ],
  },
];

export interface ClubStatusMeta {
  current: ClubStatusItem;
  next: ClubStatusItem | null;
  progress: number;
  left: number;
  currentIndex: number;
}

export function getClubStatusMeta(konBalance: number): ClubStatusMeta {
  const currentIndex = CLUB_STATUSES.reduce((acc, item, index) => {
    return konBalance >= item.minKon ? index : acc;
  }, 0);

  const current = CLUB_STATUSES[currentIndex];
  const next = CLUB_STATUSES[currentIndex + 1] ?? null;

  if (!next) {
    return {
      current,
      next: null,
      progress: 100,
      left: 0,
      currentIndex,
    };
  }

  const range = Math.max(1, next.minKon - current.minKon);
  const valueInRange = Math.max(0, konBalance - current.minKon);
  const progress = Math.max(0, Math.min(100, (valueInRange / range) * 100));
  const left = Math.max(0, next.minKon - konBalance);

  return {
    current,
    next,
    progress,
    left,
    currentIndex,
  };
}
