import { useState, useMemo } from 'react';

const CON_ADDRESS = 'EQBSQLwtqeXlA2AhnErNpA4vR6AimD81Cj5GpxIqgoXPDURX';
const KOH_TO_TON = 0.01;

export function Converter({ tonUsd }: { tonUsd?: number }) {
  const [kon, setKon] = useState('100');
  const ton = useMemo(() => {
    const n = parseFloat(kon.replace(',', '.')) || 0;
    return (n * KOH_TO_TON).toFixed(4);
  }, [kon]);
  const usd = tonUsd ? (parseFloat(ton) * tonUsd).toFixed(2) : '—';
  const swap = () => {
    const url = `https://app.ston.fi/swap?chartVisible=false&ft=${CON_ADDRESS}&tt=TON&fa=${kon}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <div id="converter" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 16 }}>
      <div style={{ fontWeight: 800, marginBottom: 10 }}>Конвертер KOH → TON</div>
      <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>Отдаёшь</div>
      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
        <input type="number" value={kon} onChange={(e) => setKon(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 18, fontWeight: 700 }} />
        <span style={{ color: '#94a3b8', fontWeight: 700 }}>KOH</span>
      </div>
      <div style={{ textAlign: 'center', color: '#64748b', fontSize: 18, marginBottom: 4 }}>↓</div>
      <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>Получаешь</div>
      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 12px' }}>
        <div style={{ flex: 1, fontSize: 18, fontWeight: 700 }}>{ton}</div>
        <span style={{ color: '#94a3b8', fontWeight: 700 }}>TON</span>
      </div>
      <div style={{ color: '#64748b', fontSize: 11, marginTop: 4, marginBottom: 10 }}>≈ ${usd}</div>
      <button onClick={swap} style={{ width: '100%', color: '#fff', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', padding: 12, borderRadius: 10, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Обменять на STON.fi</button>
    </div>
  );
}
