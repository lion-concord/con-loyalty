import { useLoyalty } from '../../shop/useLoyalty';

const tiers = [
  { name: 'Бронза',   min: 0,     color: '#a16207', emoji: '\u{1F949}', gradient: 'linear-gradient(135deg, #78350f 0%, #a16207 50%, #78350f 100%)' },
  { name: 'Серебро',  min: 500,   color: '#94a3b8', emoji: '\u{1F948}', gradient: 'linear-gradient(135deg, #475569 0%, #cbd5e1 50%, #475569 100%)' },
  { name: 'Золото',   min: 2000,  color: '#eab308', emoji: '\u{1F947}', gradient: 'linear-gradient(135deg, #713f12 0%, #fbbf24 50%, #713f12 100%)' },
  { name: 'Платина',  min: 10000, color: '#a855f7', emoji: '\u{1F48E}', gradient: 'linear-gradient(135deg, #581c87 0%, #c084fc 50%, #581c87 100%)' },
];

const getTier = (bal) =>
  [...tiers].reverse().find((t) => bal >= t.min) || tiers[0];

export function LoyaltyCardPremium() {
  const { balance } = useLoyalty();
  const currentTier = getTier(balance);
  const currentIdx = tiers.findIndex((t) => t.name === currentTier.name);
  const nextTier = tiers[currentIdx + 1];
  const progress = nextTier
    ? Math.min(100, ((balance - currentTier.min) / (nextTier.min - currentTier.min)) * 100)
    : 100;

  return (
    <div style={{
      position: 'relative', borderRadius: 24, padding: 22,
      background: currentTier.gradient,
      boxShadow: '0 20px 50px -10px ' + currentTier.color + '55, inset 0 1px 0 rgba(255,255,255,0.25)',
      overflow: 'hidden', color: '#fff',
    }}>
      <div style={{
        position: 'absolute', top: -50, right: -50, width: 200, height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(45deg, transparent 0 20px, rgba(255,255,255,0.03) 20px 21px)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, position: 'relative' }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>
            KOH Coffee Club
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 28 }}>{currentTier.emoji}</span>
            {currentTier.name}
          </div>
        </div>
        <div style={{
          padding: '6px 10px', borderRadius: 8,
          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)',
          fontSize: 10, fontWeight: 700, letterSpacing: 1,
        }}>
          VIP STATUS
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: 18 }}>
        <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>Ваш баланс</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1 }}>
            {balance.toLocaleString('ru', { maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, opacity: 0.9 }}>{'\u2B50'} КОН</div>
        </div>
      </div>

      {nextTier && (
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 6, opacity: 0.9 }}>
            <span>До «{nextTier.name}» {nextTier.emoji}</span>
<span style={{ fontWeight: 700 }}>{Math.round(progress)}%</span>
          </div>
          <div style={{
            height: 8, borderRadius: 8,
            background: 'rgba(0,0,0,0.35)', overflow: 'hidden',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
          }}>
            <div style={{
              height: '100%', width: progress + '%',
              background: 'linear-gradient(90deg, #fef3e2, #fbbf24, #fef3e2)',
              borderRadius: 8, transition: 'width 0.8s ease',
              boxShadow: '0 0 12px rgba(251,191,36,0.6)',
            }} />
          </div>
          <div style={{ fontSize: 10, marginTop: 6, opacity: 0.8 }}>
            Осталось: <b>{(nextTier.min - balance).toFixed(0)}</b> КОН
          </div>
        </div>
      )}

      <button style={{
        marginTop: 18, width: '100%', padding: '12px', borderRadius: 12,
        background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.3)',
        color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        Показать QR-карту
      </button>
    </div>
  );
}
