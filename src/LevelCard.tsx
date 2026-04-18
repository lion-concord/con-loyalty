import { useMemo } from 'react';

const LEVELS = [
  { name: 'Новичок', icon: '👶', min: 0, max: 99, cashback: 1, color: '#94a3b8' },
  { name: 'Бронза', icon: '🥉', min: 100, max: 499, cashback: 2, color: '#cd7f32' },
  { name: 'Серебро', icon: '🥈', min: 500, max: 1999, cashback: 3, color: '#c0c0c0' },
  { name: 'Золото', icon: '🥇', min: 2000, max: 9999, cashback: 5, color: '#fbbf24' },
  { name: 'Бриллиант', icon: '💎', min: 10000, max: Infinity, cashback: 7, color: '#38bdf8' },
];

interface Props {
  totalKon: number;
}

export function LevelCard({ totalKon }: Props) {
  const level = useMemo(() => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (totalKon >= LEVELS[i].min) return { ...LEVELS[i], index: i };
    }
    return { ...LEVELS[0], index: 0 };
  }, [totalKon]);

  const nextLevel = LEVELS[level.index + 1] ?? null;
  const progress = nextLevel
    ? Math.min(((totalKon - level.min) / (nextLevel.min - level.min)) * 100, 100)
    : 100;
  const remaining = nextLevel ? nextLevel.min - totalKon : 0;

  const perks: Record<number, string> = {
    1: ' – Колесо удачи',
    2: ' – Эксклюзивные акции',
    3: ' – Ранний доступ – NFT-бейдж',
    4: ' – DAO-голосование – VIP',
  };

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '16px 18px',
        marginBottom: 12,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>{level.icon}</span>
          <div>
            <div style={{ color: level.color, fontWeight: 800, fontSize: 16 }}>{level.name}</div>
            <div style={{ color: '#64748b', fontSize: 11 }}>Кэшбэк {level.cashback}%</div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>{totalKon.toLocaleString()}</div>
          <div style={{ color: '#64748b', fontSize: 11 }}>КОН всего</div>
        </div>
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 8,
          height: 10,
          overflow: 'hidden',
          marginBottom: 8,
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: 8,
            width: `${progress}%`,
            background: nextLevel
              ? `linear-gradient(90deg, ${level.color}, ${nextLevel.color})`
              : level.color,
            transition: 'width 0.6s ease',
            boxShadow: `0 0 8px ${level.color}44`,
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
        <span style={{ color: '#64748b' }}>
          {nextLevel ? `До «${nextLevel.name}» — ${remaining.toLocaleString()} КОН` : 'Максимальный уровень 🏆'}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{Math.round(progress)}%</span>
      </div>

      {nextLevel && (
        <div
          style={{
            marginTop: 12,
            padding: '10px 12px',
background: 'rgba(255,255,255,0.03)',
            borderRadius: 10,
            border: `1px solid ${nextLevel.color}22`,
          }}
        >
          <div style={{ color: '#94a3b8', fontSize: 11 }}>
            {nextLevel.icon} Следующий уровень —{' '}
            <span style={{ color: nextLevel.color, fontWeight: 700 }}>{nextLevel.name}</span>
          </div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>
            Кэшбэк {nextLevel.cashback}%{perks[level.index + 1] || ''}
          </div>
        </div>
      )}
    </div>
  );
}
