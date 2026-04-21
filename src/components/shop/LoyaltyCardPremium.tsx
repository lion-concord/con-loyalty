import { useState, useMemo } from 'react';
import { useLoyalty } from '../../shop/useLoyalty';

const tierStyle: Record<string, { emoji: string; color: string; gradient: string }> = {
  bronze:   { emoji: '\u{1F949}', color: '#a16207', gradient: 'linear-gradient(135deg, #78350f 0%, #a16207 50%, #78350f 100%)' },
  silver:   { emoji: '\u{1F948}', color: '#94a3b8', gradient: 'linear-gradient(135deg, #475569 0%, #cbd5e1 50%, #475569 100%)' },
  gold:     { emoji: '\u{1F947}', color: '#eab308', gradient: 'linear-gradient(135deg, #713f12 0%, #fbbf24 50%, #713f12 100%)' },
  platinum: { emoji: '\u{1F48E}', color: '#a855f7', gradient: 'linear-gradient(135deg, #581c87 0%, #c084fc 50%, #581c87 100%)' },
};

const CARD_CODE_KEY = 'kon_coffee_card_code';

function getOrCreateCardCode(): string {
  try {
    const saved = localStorage.getItem(CARD_CODE_KEY);
    if (saved) return saved;
    const newCode = 'KOH-' + Date.now().toString(36).toUpperCase().slice(-8);
    localStorage.setItem(CARD_CODE_KEY, newCode);
    return newCode;
  } catch {
    return 'KOH-' + Date.now().toString(36).toUpperCase().slice(-8);
  }
}

export function LoyaltyCardPremium() {
  const { state, levelInfo, nextLevelInfo, progressToNext, konToNext } = useLoyalty();
  const [showQR, setShowQR] = useState(false);

  const balance = state?.balanceKon ?? 0;
  const levelId = levelInfo?.id ?? 'bronze';
  const style = tierStyle[levelId] ?? tierStyle.bronze;
  const nextStyle = nextLevelInfo ? tierStyle[nextLevelInfo.id] : null;
  const cardCode = useMemo(() => getOrCreateCardCode(), []);

  const balanceFormatted = Number(balance).toLocaleString('ru', { maximumFractionDigits: 2 });

  return (
    <>
      <div style={{
        position: 'relative', borderRadius: 24, padding: 22,
        background: style.gradient,
        boxShadow: '0 20px 50px -10px ' + style.color + '55, inset 0 1px 0 rgba(255,255,255,0.25)',
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
              <span style={{ fontSize: 28 }}>{style.emoji}</span>
              {levelInfo?.name ?? 'Бронза'}
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
              {balanceFormatted}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, opacity: 0.9 }}>{'\u2B50'} КОН</div>
          </div>
          <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>
            Кешбэк: <b>{levelInfo?.cashbackPct ?? 2}%</b>
          </div>
        </div>

        {nextLevelInfo && nextStyle && (
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 6, opacity: 0.9 }}>
              <span>До «{nextLevelInfo.name}» {nextStyle.emoji}</span><span style={{ fontWeight: 700 }}>{Math.round(progressToNext ?? 0)}%</span>
            </div>
            <div style={{
              height: 8, borderRadius: 8,
              background: 'rgba(0,0,0,0.35)', overflow: 'hidden',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
            }}>
              <div style={{
                height: '100%', width: (progressToNext ?? 0) + '%',
                background: 'linear-gradient(90deg, #fef3e2, #fbbf24, #fef3e2)',
                borderRadius: 8, transition: 'width 0.8s ease',
                boxShadow: '0 0 12px rgba(251,191,36,0.6)',
              }} />
            </div>
            <div style={{ fontSize: 10, marginTop: 6, opacity: 0.8 }}>
              Осталось: <b>{Number(konToNext ?? 0).toFixed(0)}</b> КОН
            </div>
          </div>
        )}

        <button
          onClick={() => setShowQR(true)}
          style={{
            marginTop: 18, width: '100%', padding: '12px', borderRadius: 12,
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          Показать QR-карту
        </button>
      </div>

      {showQR && (
        <div
          onClick={() => setShowQR(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 340, borderRadius: 20, padding: 24,
              background: '#fff', color: '#000', textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>
              KOH Coffee Club
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, marginTop: 4 }}>
              Карта лояльности
            </div>
            <div style={{
              margin: '20px auto', width: 220, height: 220,
              background: '#f5f5f5', borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px dashed #ccc', position: 'relative',
            }}>
              <div style={{ fontSize: 72 }}>{'\u{1F4F1}'}</div>
              <div style={{
                position: 'absolute', bottom: 8, left: 0, right: 0,
                fontSize: 10, color: '#666',
              }}>
                QR-код карты
              </div>
            </div>
<div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Номер карты</div>
            <div style={{
              fontSize: 16, fontWeight: 800, letterSpacing: 2,
              padding: '8px 12px', background: '#f5f5f5', borderRadius: 8,
              fontFamily: 'monospace',
            }}>
              {cardCode}
            </div>
            <div style={{
              marginTop: 16, fontSize: 11, color: '#666',
              display: 'flex', justifyContent: 'space-around',
            }}>
              <span>Уровень: <b>{levelInfo?.name ?? 'Бронза'}</b></span>
              <span>Баланс: <b>{balanceFormatted} КОН</b></span>
            </div>
            <button
              onClick={() => setShowQR(false)}
              style={{
                marginTop: 20, width: '100%', padding: 12,
                borderRadius: 10, border: 'none',
                background: '#000', color: '#fff',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}
