import { useEffect, useState } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';

const CON_ADDRESS = 'EQBSQLwtqeXlA2AhnErNpA4vR6AimD81Cj5GpxIqgoXPDURX';

// Кошельки проекта — не учитываются в топе холдеров
const EXCLUDED_WALLETS = new Set<string>([
  // TODO: вставить сюда адреса 4 кошельков проекта в raw-формате
  // 'EQ...',
  // 'EQ...',
  // 'EQ...',
  // 'EQ...',
]);

const tiers = [
  { name: 'Алмаз', min: 1000000, color: '#a855f7', emoji: '💎' },
  { name: 'Золото', min: 500000, color: '#eab308', emoji: '🥇' },
  { name: 'Серебро', min: 100000, color: '#94a3b8', emoji: '🥈' },
  { name: 'Бронза', min: 10000, color: '#a16207', emoji: '🥉' },
  { name: 'Старт', min: 0, color: '#22c55e', emoji: '🌱' },
];

const getTier = (bal: number) => tiers.find((t) => bal >= t.min) || tiers[tiers.length - 1];
const shortAddr = (a: string) => (a ? a.slice(0, 4) + '...' + a.slice(-4) : '—');

export function Leaderboard() {
  const address = useTonAddress();
  const [holders, setHolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://tonapi.io/v2/jettons/${CON_ADDRESS}/holders?limit=50`)
      .then((r) => r.json())
      .then((d) => setHolders((d.addresses || []).slice(4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const myRank = address ? holders.findIndex((h) => h.owner?.address === address) + 1 : 0;

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 14, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>🏆 Топ холдеров CON</div>
        {myRank > 0 && (
          <div style={{ fontSize: 11, color: '#a855f7', fontWeight: 700, background: 'rgba(168,85,247,0.15)', padding: '4px 8px', borderRadius: 8 }}>
            Вы на #{myRank}
          </div>
        )}
      </div>

      {loading && <div style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', padding: 20 }}>Загрузка...</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 420, overflowY: 'auto' }}>
        {holders.map((h, i) => {
          const bal = Number(h.balance) / 1e9;
          const tier = getTier(bal);
          const isMe = h.owner?.address === address;
          const borderColor = i === 0 ? '#eab308' : i === 1 ? '#cbd5e1' : i === 2 ? '#a16207' : 'transparent';
          const rankIcon = i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;

          return (
            <div
              key={h.owner?.address || i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: 10,
                borderRadius: 10,
                background: isMe
                  ? 'linear-gradient(135deg, rgba(37,99,235,0.35), rgba(124,58,237,0.35))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isMe ? 'rgba(168,85,247,0.6)' : borderColor !== 'transparent' ? borderColor : 'rgba(255,255,255,0.05)'}`,
                boxShadow: i < 3 ? `0 0 12px ${borderColor}55` : isMe ? '0 0 15px rgba(124,58,237,0.4)' : 'none',
              }}
            >
              <div style={{ width: 36, textAlign: 'center', fontWeight: 800, fontSize: i < 3 ? 18 : 14, flexShrink: 0 }}>
                {rankIcon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
<div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {shortAddr(h.owner?.address || '')} {isMe && '⭐'}
                </div>
                <div style={{ fontSize: 10, color: tier.color, fontWeight: 700, marginTop: 2 }}>
                  {tier.emoji} {tier.name}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 13 }}>
                  {bal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>CON</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
