// История операций обмена
const HISTORY_KEY = 'con_tx_history';
const MAX_ITEMS = 50;

export type Transaction = {
  id: string;
  type: 'convert';
  timestamp: number;
  konAmount: number;
  conAmount: number;
  rubAmount: number;
};

export function getHistory(): Transaction[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw) as Transaction[];
  } catch {}
  return [];
}

export function addTransaction(tx: Omit<Transaction, 'id' | 'timestamp'>): Transaction[] {
  const newTx: Transaction = {
    ...tx,
    id: Math.random().toString(36).slice(2, 10),
    timestamp: Date.now(),
  };
  const list = [newTx, ...getHistory()].slice(0, MAX_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  return list;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  const hour = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (min < 1) return 'только что';
  if (min < 60) return `${min} мин назад`;
  if (hour < 24) return `${hour} ч назад`;
  if (day === 1) return 'вчера';
  if (day < 7) return `${day} дн назад`;
  const d = new Date(ts);
  return d.toLocaleDateString('ru', { day: '2-digit', month: 'short' });
}
