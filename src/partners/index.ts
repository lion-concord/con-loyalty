import type { Partner } from "./_shared/types";
import { semrekConfig } from "./semrek/config";

export const partners: Partner[] = [semrekConfig];

export function getPartner(id: string): Partner | undefined {
  return partners.find((p) => p.id === id);
}
