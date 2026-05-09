import { lazy } from "react";
import type { Partner } from "../_shared/types";

export const semrekConfig: Partner = {
  id: "semrek",
  name: "Семь рек",
  title: "Семь рек",
  subtitle: "Лодки, моторы и аксессуары",
  accentColor: "#c77a3a",
  bgColor: "#0a2540",
  footnote: "Начисление баллов КОН и кешбэка партнёра",
  enabled: true,
  component: lazy(() => import("./index")),
};
