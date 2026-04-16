import { useState, useEffect, useRef } from 'react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { getTonBalance, getJettonBalances } from './lib/ton-balance';
import type { TokenBalance } from './lib/ton-balance';

export function WalletPanel() {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [tonBal, setTonBal] = useState<string | null>(null);
  const [jettons, setJettons] = useState<TokenBalance[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!address) { setTonBal(null); setJettons([]); return; }
    setLoading(true);
    Promise.all([getTonBalance(address), getJettonBalances(address)])
      .then(([ton, tokens]) => { setTonBal(ton); setJettons(tokens); })
      .finally(() => setLoading(false));
  }, [address]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  if (!address) return null; // TonConnectButton уже есть

  const short = address.slice(0, 4) + '…' + address.slice(-4);

  const card: React.CSSProperties = {
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 16, padding: '10px 16px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
  };

  const dropdown: React.CSSProperties = {
    position: 'absolute', right: 0, top: '110%', width: 280,
    background: '#1e293b', borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 100,
    overflow: 'hidden',
  };

  const row: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)',
  };

  const img: React.CSSProperties = {
    width: 32, height: 32, borderRadius: '50%', background: '#334155',
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={card} onClick={() => setOpen(!open)}>
<div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
        <span style={{ color: '#94a3b8', fontSize: 13 }}>{short}</span>
        <span style={{ color: '#00ff88', fontWeight: 700, fontSize: 14 }}>
          {tonBal ?? '…'} TON
        </span>
        <span style={{ color: '#64748b', fontSize: 11 }}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div style={dropdown}>
          {}
          <div style={row}>
            <img src="https://ton.org/download/ton_symbol.svg" alt="TON" style={img} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#fff' }}>TON</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Toncoin</div>
            </div>
            <div style={{ fontWeight: 700, color: '#00ff88' }}>{tonBal}</div>
          </div>

          {}
          {loading ? (
            <div style={{ padding: 16, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
              Загрузка…
            </div>
          ) : jettons.length === 0 ? (
            <div style={{ padding: 16, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
              Нет других токенов
            </div>
          ) : (
            <div style={{ maxHeight: 240, overflowY: 'auto' }}>
              {jettons.map((t) => (
                <div key={t.address} style={row}>
                  {t.image ? (
                    <img src={t.image} alt={t.symbol} style={img} />
                  ) : (
                    <div style={{ ...img, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#94a3b8' }}>
                      {t.symbol.slice(0, 2)}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{t.symbol}</div>
                    <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{t.balance}</div>
                </div>
              ))}
            </div>
          )}

          {}
          <div
            onClick={() => { tonConnectUI.disconnect(); setOpen(false); }}
            style={{ padding: '12px 16px', textAlign: 'center', color: '#ef4444', fontSize: 13, cursor: 'pointer', borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            Отключить кошелёк
          </div>
        </div>
      )}
    </div>
  );
}
