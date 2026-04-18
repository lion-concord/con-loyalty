import { useEffect, useState } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';

const CON_ADDRESS = 'EQBSQLwtqeXlA2AhnErNpA4vR6AimD81Cj5GpxIqgoXPDURX';

const TON_LOGO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwODhDQyI+PHBhdGggZD0iTTEyIDBDNS4zNzMgMCAwIDUuMzczIDAgMTJzNS4zNzMgMTIgMTIgMTIgMTItNS4zNzMgMTItMTJTMTguNjI3IDAgMTIgMHptNS4zMTEgOC43MzFsLTQuNzI5IDguMDk1YTEgMSAwIDAxLTEuNzI0IDBMNi4xMjkgOC43MzFhMSAxIDAgMDEuODYyLTEuNTAyaDkuNDU4YTEgMSAwIDAxLjg2MiAxLjUwMnoiLz48L3N2Zz4=';

type ConBalance = {
  balance: string;
  decimals: number;
  symbol: string;
  name: string;
  image?: string;
};

export function WalletPanel() {
  const address = useTonAddress();
  const [tonBalance, setTonBalance] = useState<number | null>(null);
  const [con, setCon] = useState<ConBalance | null>(null);
  const [open, setOpen] = useState(false);
  const [jettons, setJettons] = useState<any[]>([]);

  useEffect(() => {
    if (!address) {
      setTonBalance(null);
      setCon(null);
      setJettons([]);
      return;
    }

    const loadTon = async () => {
      try {
        const res = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}`);
        const data = await res.json();
        const nano = parseInt(data.result || '0', 10);
        setTonBalance(nano / 1e9);
      } catch {}
    };

    const loadCon = async () => {
      try {
        const res = await fetch(`https://tonapi.io/v2/accounts/${address}/jettons/${CON_ADDRESS}`);
        const data = await res.json();
        if (data && data.balance) {
          setCon({
            balance: data.balance,
            decimals: data.jetton?.decimals ?? 9,
            symbol: data.jetton?.symbol ?? 'CON',
            name: data.jetton?.name ?? 'CON',
            image: data.jetton?.image,
          });
        } else {
          setCon({ balance: '0', decimals: 9, symbol: 'CON', name: 'CON' });
        }
      } catch {
        setCon({ balance: '0', decimals: 9, symbol: 'CON', name: 'CON' });
      }
    };

    const loadJettons = async () => {
      try {
        const res = await fetch(`https://tonapi.io/v2/accounts/${address}/jettons`);
        const data = await res.json();
        setJettons(data.balances || []);
      } catch {}
    };

    loadTon();
    loadCon();
    loadJettons();
  }, [address]);

  if (!address) return null;

  const conAmount = con ? Number(con.balance) / Math.pow(10, con.decimals) : 0;

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 14, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <img src={TON_LOGO} alt="TON" width={28} height={28} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#94a3b8', fontSize: 11 }}>Баланс TON</div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>
            {tonBalance !== null ? tonBalance.toFixed(4) : '...'} TON
          </div>
        </div>
      </div>
<div style={{ marginTop: 10, padding: 10, background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.12))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        {con?.image ? (
          <img src={con.image} alt="CON" width={28} height={28} style={{ borderRadius: '50%', flexShrink: 0 }} />
        ) : (
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>C</div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#94a3b8', fontSize: 11 }}>Баланс CON</div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>
            {con ? conAmount.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '...'} {con?.symbol || 'CON'}
          </div>
        </div>
      </div>

      <button onClick={() => setOpen(!open)} style={{ marginTop: 10, width: '100%', color: '#e2e8f0', background: 'rgba(255,255,255,0.06)', padding: 10, borderRadius: 10, fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: 13 }}>
        {open ? 'Скрыть жетоны' : `Показать все жетоны (${jettons.length})`}
      </button>

      {open && (
        <div style={{ marginTop: 8, maxHeight: 200, overflowY: 'auto', background: '#1e293b', borderRadius: 10, padding: 8 }}>
          {jettons.length === 0 && <div style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', padding: 8 }}>Жетонов нет</div>}
          {jettons.map((j) => {
            const bal = Number(j.balance) / Math.pow(10, j.jetton?.decimals ?? 9);
            return (
              <div key={j.jetton?.address} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 6, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {j.jetton?.image && <img src={j.jetton.image} alt="" width={20} height={20} style={{ borderRadius: '50%' }} />}
                <div style={{ flex: 1, fontSize: 12 }}>{j.jetton?.symbol || '—'}</div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{bal.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
