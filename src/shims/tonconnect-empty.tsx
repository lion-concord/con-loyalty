// Пустая заглушка для RuStore-режима (без крипто)
import type { ReactNode } from 'react'

export function TonConnectButton() {
  return null
}

export function TonConnectUIProvider({ children }: { children: ReactNode }) {
  return children as any
}

export function useTonWallet() {
  return null
}

export function useTonAddress() {
  return ''
}

export function useTonConnectUI(): [any, any] {
  return [null, () => {}]
}
