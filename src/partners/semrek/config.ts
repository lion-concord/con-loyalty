import { lazy } from "react";
import type { Partner } from "../_shared/types";

export const semrekConfig: Partner = {
  id: "semrek",
  title: "Семь рек",
  subtitle: "Лодки ПВХ · Конструктор · Доставка",
  accentColor: "#c77a3a",
  bgColor: "#0a2540",
  badge: "-15%",
  footnote: "Партнёр программы КОН · начисляем баллы",
  enabled: true,
  component: lazy(() => import("./index")),
};
