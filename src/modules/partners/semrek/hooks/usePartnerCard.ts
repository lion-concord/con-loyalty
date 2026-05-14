import { useState, useEffect } from "react";
import type { PartnerCard, CashbackTransaction } from "../types";

const STORAGE_KEY = "kon-partner-cards";

export function usePartnerCard(partnerId: string, userId: string = "default") {
  const [card, setCard] = useState<PartnerCard | null>(null);

  // Загрузка карты из localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const cards: PartnerCard[] = stored ? JSON.parse(stored) : [];
    const existing = cards.find((c) => c.partnerId === partnerId);

    if (existing) {
      setCard(existing);
    } else {
      // Создаём новую карту при первом запуске
      const newCard: PartnerCard = {
        partnerId,
        partnerName: getPartnerName(partnerId),
        cashbackPercent: getCashbackPercent(partnerId),
        cashbackBalance: 0,
        qrCode: `${userId}-${partnerId}`,
        gradient: getPartnerGradient(partnerId),
        icon: getPartnerIcon(partnerId),
        history: [],
      };
      cards.push(newCard);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
      setCard(newCard);
    }
  }, [partnerId, userId]);

  // Начисление кешбэка
  const earnCashback = (orderTotal: number, orderId: string) => {
    if (!card) return;

    const amount = Math.round(orderTotal * (card.cashbackPercent / 100));
    const transaction: CashbackTransaction = {
      id: `earn-${Date.now()}`,
      date: new Date().toISOString(),
      type: "earn",
      amount,
      orderId,
      description: `Заказ #${orderId} (${orderTotal.toLocaleString("ru-RU")} ₽)`,
    };

    const updatedCard = {
      ...card,
      cashbackBalance: card.cashbackBalance + amount,
      history: [transaction, ...card.history],
    };

    updateCard(updatedCard);
  };

  // Списание кешбэка
  const spendCashback = (amount: number, orderId: string) => {
    if (!card || amount > card.cashbackBalance) return false;

    const transaction: CashbackTransaction = {
      id: `spend-${Date.now()}`,
      date: new Date().toISOString(),
      type: "spend",
      amount,
      orderId,
      description: `Оплата заказа #${orderId}`,
    };

    const updatedCard = {
      ...card,
      cashbackBalance: card.cashbackBalance - amount,
      history: [transaction, ...card.history],
    };

    updateCard(updatedCard);
    return true;
  };

  // Обновление карты в localStorage
  const updateCard = (updatedCard: PartnerCard) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const cards: PartnerCard[] = stored ? JSON.parse(stored) : [];
    const index = cards.findIndex((c) => c.partnerId === partnerId);

    if (index >= 0) {
      cards[index] = updatedCard;
    } else {
      cards.push(updatedCard);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    setCard(updatedCard);
  };

  return { card, earnCashback, spendCashback };
}

// Хелперы для конфигурации партнёров
function getPartnerName(partnerId: string): string {
  const names: Record<string, string> = {
    semrek: "Семь рек",
  };
  return names[partnerId] || partnerId;
}

function getCashbackPercent(partnerId: string): number {
  const percents: Record<string, number> = {
    semrek: 3,
  };
  return percents[partnerId] || 0;
}

function getPartnerGradient(partnerId: string): [string, string] {
  const gradients: Record<string, [string, string]> = {
    semrek: ["#2a6fd6", "#3dbde0"],
  };
  return gradients[partnerId] || ["#666", "#999"];
}

function getPartnerIcon(partnerId: string): string {
  const icons: Record<string, string> = {
    semrek: "🚤",
  };
  return icons[partnerId] || "🏪";
}
