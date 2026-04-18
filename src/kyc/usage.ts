// Отслеживание использованного месячного лимита обмена
const USAGE_KEY = 'con_kyc_usage';

type Usage = { month: string; convertUsed: number };

const currentMonth = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export function getUsage(): Usage {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (raw) {
      const u = JSON.parse(raw) as Usage;
      // Если новый месяц — сбрасываем
      if (u.month === currentMonth()) return u;
    }
  } catch {}
  return { month: currentMonth(), convertUsed: 0 };
}

export function addConvertUsage(amountRub: number): Usage {
  const u = getUsage();
  const updated = { month: currentMonth(), convertUsed: u.convertUsed + amountRub };
  localStorage.setItem(USAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function resetUsage(): void {
  localStorage.removeItem(USAGE_KEY);
}
