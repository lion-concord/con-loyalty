import { useMemo } from "react";
import type { Partner } from "../../../shared/types/models";

const PARTNERS: Partner[] = [
  // Семь рек теперь встроен баннером в PartnersListScreen
  // Здесь будут другие партнёры без собственных модулей
];

export function usePartners() {
  const partners = useMemo(() => PARTNERS.filter((item) => item.enabled !== false), []);

  return {
    partners,
  };
}
