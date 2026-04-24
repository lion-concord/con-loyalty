import { useMemo } from "react";
import type { Partner } from "../../../shared/types/models";

const PARTNERS: Partner[] = [
  {
    id: "semrek",
    title: "Семь рек",
    subtitle: "Лодки, моторы и активный отдых",
    category: "Активный отдых",
    badge: "Партнёр",
    enabled: true,
    hasModule: true,
    accentColor: "#0ea5e9",
    bgColor: "#f0f9ff",
  },
  {
    id: "kon-coffee",
    title: "КОН Coffee",
    subtitle: "Кофе, десерты и бонусы",
    category: "Кофейни",
    badge: "Кешбэк",
    enabled: true,
    hasModule: false,
    accentColor: "#b45309",
    bgColor: "#fff7ed",
  },
];

export function usePartners() {
  const partners = useMemo(() => PARTNERS.filter((item) => item.enabled !== false), []);

  return {
    partners,
  };
}
