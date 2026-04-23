import { WalletPanel } from "./WalletPanel";
import { apiFetch } from './hooks/useApi';
import { useState, useEffect, lazy, Suspense } from 'react'
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react'
const KycScreen = lazy(() => import('./kyc/KycScreen').then(m => ({ default: m.KycScreen })))
import { getKycProfile, LEVEL_INFO } from './kyc/levels'
import { getUsage, addConvertUsage } from './kyc/usage'
import { getHistory, addTransaction, clearHistory, formatRelativeTime, type Transaction } from './kyc/history'
import { LevelCard } from './LevelCard'
const Leaderboard = lazy(() => import('./Leaderboard').then(m => ({ default: m.Leaderboard })))

const fade = { animation: 'fadeIn 0.6s ease-out both' }


function fmtCompact(n: number): string {
  if (n >= 1e12) return (n/1e12).toFixed(1).replace(/\.0$/,'') + ' трлн';
  if (n >= 1e9)  return (n/1e9 ).toFixed(1).replace(/\.0$/,'') + ' млрд';
  if (n >= 1e6)  return (n/1e6 ).toFixed(1).replace(/\.0$/,'') + ' млн';
  if (n >= 1e4)  return Math.round(n/1e3) + ' тыс';
  return n.toLocaleString('ru');
}

function openBuyCon() {
  const url = 'https://app.ston.fi/swap?ft=TON&tt=EQBSQLwtqeXlA2AhnErNpA4vR6AimD81Cj5GpxIqgoXPDURX';
  const tg = (window as any).Telegram?.WebApp;
  if (tg && typeof tg.openLink === 'function') {
    tg.openLink(url, { try_instant_view: false });
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

const parseLimit = (limitStr: string): number => {
  if (/без\s*лимит/i.test(limitStr)) return Infinity;
  if (/недоступ/i.test(limitStr)) return 0;
  return parseInt(limitStr.replace(/\s/g, '').replace('₽', '')) || 0;
};


function openBusinessBot() {
  const url = 'https://t.me/con_business_bot?start=biz';
  const tg = (window as any).Telegram?.WebApp;
  if (tg && typeof tg.openTelegramLink === 'function') {
    tg.openTelegramLink(url);
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

function App() {
  // @ts-ignore
  let tgUser: any = null
  try { const W = (window as any).Telegram?.WebApp; if(W){W.ready();W.expand();tgUser=W.initDataUnsafe?.user} } catch(e){console.error("TG ERR:",e)}

  const [kon, setKon] = useState('100')
  useEffect(() => {
    apiFetch<{ userId: number; kon: number; level: string }>('/api/balance')
      .then(d => {
        setKon(String(d.kon));
        console.log('[API] balance loaded:', d);
      })
      .catch(e => console.warn('[API] balance failed:', e.message));
  }, []);
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const konNum = Number(kon) || 0
  const ton = (konNum * 0.01).toFixed(2)
  const wallet = useTonWallet()
  const [prices, setPrices] = useState<{ton:number|null,btc:number|null,con:number|null}>({ton:null,btc:null,con:null})
  const [showKyc, setShowKyc] = useState(false)
  const [kycProfile, setKycProfile] = useState(getKycProfile())
  const [usage, setUsage] = useState(getUsage())
  const [history, setHistory] = useState<Transaction[]>(getHistory())
  const totalKon = 142

  useEffect(() => { if (!showKyc) { setKycProfile(getKycProfile()); setUsage(getUsage()); setHistory(getHistory()) } }, [showKyc])

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network,bitcoin&vs_currencies=usd')
        const d = await r.json()
        const tonPrice = d['the-open-network']?.usd || null
        const btcPrice = d['bitcoin']?.usd || null
        const conPrice = tonPrice ? tonPrice * 0.01 : null
        setPrices({ton:tonPrice,btc:btcPrice,con:conPrice})
      } catch(e) { console.error(e) }
    }
    load()
    const i = setInterval(load, 30000)
    return () => clearInterval(i)
  }, [])

  // @ts-ignore
  const currentKyc = LEVEL_INFO[kycProfile.level];
  const convertLimitRub = parseLimit(currentKyc.limits.convert);
  const currentValRub = konNum * (prices.con || 1.3);
  const remainingLimit = Math.max(0, convertLimitRub - usage.convertUsed);
  const isOverLimit = currentValRub > remainingLimit;

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(to bottom,#0f172a,#111827 45%,#020617)',color:'white',fontFamily:'system-ui,sans-serif',padding:'12px 10px',boxSizing:'border-box'}}>
      <style>{"@keyframes fadeIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}} @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}} @keyframes kycPulse{0%{box-shadow:0 0 0 0 rgba(234,179,8,0.5)}70%{box-shadow:0 0 0 8px rgba(234,179,8,0)}100%{box-shadow:0 0 0 0 rgba(234,179,8,0)}} *{box-sizing:border-box} body{margin:0}"}</style>
      <div style={{maxWidth:900,margin:'0 auto',display:'grid',gap:12,width:'100%'}}>
        <header style={{display:"flex",flexDirection:"column",gap:10,padding:"8px 0",...fade}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
            <div style={{minWidth:0,flex:"1 1 auto",overflow:"hidden"}}>
              <div style={{fontSize:20,fontWeight:800,lineHeight:1.1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Токен КОН</div>
              <div style={{color:"#94a3b8",marginTop:2,fontSize:12,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Лояльность на КОН</div>
            </div>
            <div style={{flexShrink:0}}>
              <KycBadge profile={kycProfile} onClick={() => setShowKyc(true)} />
            </div>
          </div>
          <div style={{width:"100%"}}><WalletPanel /></div>
          <div style={{width:"100%",display:"flex",justifyContent:"center"}}><TonConnectButton /></div>
        </header>

        <section style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,...fade,animationDelay:'0.05s'}}>
          <PriceCard name="TON" price={prices.ton}/>
          <PriceCard name="BTC" price={prices.btc}/>
<PriceCard name="CON" price={prices.con}/>
        </section>

        <button
          type="button"
          onClick={openBuyCon}
          style={{
            width: '100%',
            padding: '14px 16px',
            marginTop: 10,
            marginBottom: 14,
            background: 'linear-gradient(135deg,#10b981,#06b6d4)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: '0 6px 20px rgba(6,182,212,0.35)',
          }}
        >
          <span style={{ fontSize: 18 }}>💎</span>
          <span>Купить CON</span>
          <span style={{ fontSize: 12, opacity: 0.85 }}>↗</span>
        </button>
        <section style={{...fade,animationDelay:'0.08s'}}>
          <LevelCard totalKon={totalKon} />
        </section>

        <section
          onClick={openBusinessBot}
          style={{
            cursor: 'pointer',
            background: 'linear-gradient(135deg,#f59e0b 0%,#b45309 60%,#78350f 100%)',
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            boxShadow: '0 8px 24px rgba(245,158,11,0.25)',
            position: 'relative',
            overflow: 'hidden',
            ...fade, animationDelay: '0.09s'
          }}
        >
          {new Date() < new Date('2026-05-01T00:00:00+03:00') && (
            <div style={{position:'absolute',top:10,right:10,background:'#dc2626',color:'#fff',fontSize:10,fontWeight:800,padding:'4px 9px',borderRadius:6,letterSpacing:0.3,boxShadow:'0 2px 8px rgba(220,38,38,0.5)'}}>− 30% до 1 мая</div>
          )}
          <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.85)',letterSpacing:1,marginBottom:4}}>🏪 ДЛЯ БИЗНЕСА</div>
          <div style={{fontSize:17,fontWeight:900,color:'#fff',marginBottom:10,lineHeight:1.2}}>Подключите лояльность на КОН</div>
          <div style={{fontSize:12.5,color:'#fff',opacity:0.95,marginBottom:12,lineHeight:1.55}}>
            ✓ Запуск за 15 минут — без разработки<br/>
            ✓ +22% повторных визитов за 3 месяца<br/>
            ✓ Без абонплаты — платите за результат
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(255,255,255,0.18)',borderRadius:10,padding:'10px 14px'}}>
            <span style={{color:'#fff',fontSize:14,fontWeight:800}}>🚀 Оставить заявку</span>
            <span style={{color:'#fff',fontSize:16,fontWeight:900}}>→</span>
          </div>
        </section>


        <KycSection profile={kycProfile} usage={usage} onOpen={() => setShowKyc(true)} />

        <section id="converter" style={{border:isOverLimit ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.04)',borderRadius:16,padding:16,...fade,animationDelay:'0.1s'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{fontSize:18,fontWeight:800}}>Конвертер КОН → CON</div>
            <div style={{fontSize:11,color:'#94a3b8',fontWeight:600}}>
              1 КОН ≈ {prices.con ? prices.con.toFixed(2) : '—'} ₽
            </div>
          </div>

          {kycProfile.level === 0 ? (
            <div style={{padding:20,borderRadius:12,background:'rgba(234,179,8,0.08)',border:'1px solid rgba(234,179,8,0.25)',textAlign:'center'}}>
              <div style={{fontSize:32,marginBottom:8}}>🔒</div>
              <div style={{fontWeight:700,marginBottom:6}}>Обмен недоступен</div>
              <div style={{color:'#cbd5e1',fontSize:13,lineHeight:1.5,marginBottom:14}}>
                Пройдите базовую верификацию (ФИО + email),<br/>
                чтобы открыть обмен до 15 000 ₽/мес.
              </div>
              <button onClick={() => setShowKyc(true)} style={{padding:'10px 20px',background:'linear-gradient(135deg,#eab308,#f59e0b)',color:'#0f172a',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontSize:14}}>Пройти верификацию</button>
            </div>
          ) : (
            <>
              {convertLimitRub !== Infinity && (
                <div style={{marginBottom:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#94a3b8',marginBottom:6}}>
                    <span>Использовано в этом месяце</span>
                    <span style={{fontWeight:700,color:'#e2e8f0'}}>
                      {Math.round(usage.convertUsed).toLocaleString('ru')} / {Math.round(convertLimitRub).toLocaleString('ru')} ₽
                    </span>
                  </div>
                  <div style={{height:6,background:'rgba(255,255,255,0.08)',borderRadius:3,overflow:'hidden'}}>
                    <div style={{width:`${Math.min(100,(usage.convertUsed/convertLimitRub)*100)}%`,height:'100%',background:(usage.convertUsed/convertLimitRub)>0.9?'linear-gradient(90deg,#ef4444,#f87171)':(usage.convertUsed/convertLimitRub)>0.7?'linear-gradient(90deg,#eab308,#f59e0b)':'linear-gradient(90deg,#22c55e,#16a34a)',transition:'width 0.4s ease'}}/>
                  </div>
                </div>
              )}

              <div style={{display:'grid',gap:10}}>
                <label style={{display:'grid',gap:6}}>
                  <span style={{color:'#cbd5e1',fontSize:13}}>Количество КОН</span>
<input type="number" value={kon} onChange={(e)=>setKon(e.target.value.replace(/^0+(?=\d)/, ''))} onFocus={(e)=>{if(e.target.value==='0')setKon('')}} style={{width:'100%',padding:'12px 14px',borderRadius:12,border:isOverLimit ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.14)',background:'rgba(15,23,42,0.8)',color:'white',fontSize:16,outline:'none',boxSizing:'border-box'}}/>
                </label>

                {convertLimitRub !== Infinity && remainingLimit > 0 && (
                  <div style={{display:'flex',gap:6}}>
                    {[0.25,0.5,1].map(pct => {
                      const maxKon = remainingLimit / (prices.con || 1.3);
                      const val = Math.floor(maxKon * pct);
                      return (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setKon(String(val))}
                          style={{flex:1,padding:'6px 0',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#cbd5e1',fontSize:12,fontWeight:700,cursor:'pointer'}}
                        >{pct === 1 ? 'MAX' : `${pct*100}%`}</button>
                      );
                    })}
                  </div>
                )}

                <div style={{padding:'12px 14px',borderRadius:12,background:isOverLimit ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.12)',border:isOverLimit ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(59,130,246,0.18)',fontSize:15}}>
                  {isOverLimit ? (
                    <div style={{color:'#fca5a5'}}>
                      <b>Превышен лимит!</b><br/>
                      <span style={{fontSize:12}}>Осталось: {remainingLimit === Infinity ? 'безлимит' : Math.round(remainingLimit).toLocaleString('ru') + ' ₽'}. Вы хотите: ~{Math.round(currentValRub).toLocaleString('ru')} ₽</span>
                    </div>
                  ) : (
                    <div>Это примерно <b>{ton} CON</b> (~{Math.round(currentValRub).toLocaleString('ru')} ₽)</div>
                  )}
                </div>

                <button
                  disabled={isOverLimit || konNum <= 0}
                  onClick={() => {
                    if (isOverLimit || konNum <= 0) return;
                    const updated = addConvertUsage(currentValRub);
                    setUsage(updated);
                    const newHistory = addTransaction({ type: 'convert', konAmount: konNum, conAmount: Number(ton), rubAmount: currentValRub });
                    setHistory(newHistory);
                    setKon('');
                    setToastMsg('✓ Обмен на ~' + Math.round(currentValRub).toLocaleString('ru') + ' ₽ записан');
                    setTimeout(() => setToastMsg(null), 2500);
                  }}
                  style={{width:'100%',padding:'14px',borderRadius:12,fontWeight:700,border:'none',background: (isOverLimit || konNum <= 0) ? '#334155' : 'linear-gradient(135deg,#2563eb,#7c3aed)',color: (isOverLimit || konNum <= 0) ? '#94a3b8' : '#fff',cursor: (isOverLimit || konNum <= 0) ? 'not-allowed' : 'pointer',marginTop: 4}}
                >
                  {isOverLimit ? 'Повысьте уровень KYC' : konNum <= 0 ? 'Введите сумму' : 'Обменять'}
                </button>
              </div>
            </>
          )}
        </section>

        <HistorySection history={history} onClear={() => { clearHistory(); setHistory([]) }} />
<section style={{...fade,animationDelay:'0.15s'}}>
          <Suspense fallback={<div style={{padding:20,textAlign:'center',color:'#94a3b8'}}>Загрузка…</div>}><Leaderboard /></Suspense>
        </section>

        <footer style={{padding:'14px 0 80px',color:'#94a3b8',fontSize:13,textAlign:'center'}}>Токен КОН — Лояльность на КОН</footer>
      </div>
      {toastMsg && (
<div id="toast-notify" style={{position:'fixed',bottom:20,left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#16a34a,#22c55e)',color:'#fff',padding:'12px 20px',borderRadius:12,fontSize:14,fontWeight:700,zIndex:10000,boxShadow:'0 10px 30px rgba(34,197,94,0.3)',animation:'fadeIn 0.3s ease-out'}}>{toastMsg}</div>
      )}
      {showKyc && (<Suspense fallback={<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',zIndex:9999}}>Загрузка KYC…</div>}><KycScreen onClose={() => setShowKyc(false)} /></Suspense>)}
    </div>
  )
}

function KycSection({ profile, usage, onOpen }: { profile: any; usage: any; onOpen: () => void }) {
  // @ts-ignore
  const current = LEVEL_INFO[profile.level];
  const nextLvl = profile.level < 3 ? profile.level + 1 : null;
  // @ts-ignore
  const next = nextLvl !== null ? LEVEL_INFO[nextLvl] : null;

  const levels = [
    { n: 0, icon: '👤', short: 'Аноним' },
    { n: 1, icon: '📧', short: 'Базовый' },
    { n: 2, icon: '🪪', short: 'Стандарт' },
    { n: 3, icon: '💎', short: 'VIP' },
  ];

  return (
    <section style={{position: 'relative', border: '1px solid rgba(139,92,246,0.3)', background: 'linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95))', borderRadius: 18, padding: 16, overflow: 'hidden', ...fade, animationDelay: '0.12s'}}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
<div style={{ fontSize: 22, width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛡</div>
        <div>
          <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase' }}>Верификация</div>
          <div style={{ fontSize: 17, fontWeight: 800 }}>{current.title}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
        {levels.map((lv, i) => {
          const done = lv.n < profile.level;
          const active = lv.n === profile.level;
          return (
            <div key={lv.n} style={{ display: 'flex', alignItems: 'center', flex: i === levels.length - 1 ? '0 0 auto' : 1 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: active ? 'linear-gradient(135deg, #6366f1, #a855f7)' : done ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)', border: active ? '2px solid #a78bfa' : '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {done ? '✓' : lv.icon}
              </div>
              {i < levels.length - 1 && <div style={{ flex: 1, height: 2, background: done ? '#22c55e' : 'rgba(255,255,255,0.1)', margin: '0 4px' }} />}
            </div>
          );
        })}
      </div>

      {}
      {(() => {
        const limit = current.limits.convert.includes('Безлимит') ? Infinity : parseInt(current.limits.convert.replace(/\s/g, '').replace('₽', '')) || 0;
        const used = usage?.convertUsed || 0;
        const realPct = limit === Infinity ? 0 : Math.min(100, (used / limit) * 100);
        // Минимальная видимая ширина 3% когда использовано > 0
        const pct = used > 0 && realPct < 3 ? 3 : realPct;
        const remaining = limit === Infinity ? '∞' : Math.max(0, limit - used).toLocaleString('ru', {maximumFractionDigits: 0}) + ' ₽';
        const barColor = realPct > 90 ? '#ef4444' : realPct > 70 ? '#eab308' : '#22c55e';
        const pctLabel = realPct < 0.01 ? '<0.01%' : realPct < 1 ? realPct.toFixed(2) + '%' : Math.round(realPct) + '%';
        if (limit === 0) return null;
        return (
          <div style={{ marginBottom: 14, padding: '12px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>💱 Обмен за месяц</span>
              <span style={{ fontSize: 11, color: barColor, fontWeight: 700 }}>Осталось: {remaining}</span>
            </div>
            <div style={{ position: 'relative', width: '100%', height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 5, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)' }}>
              <div style={{
                width: `${pct}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${barColor}aa, ${barColor})`,
                borderRadius: 5,
                transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 0 8px ${barColor}80, inset 0 1px 0 rgba(255,255,255,0.2)`,
                minWidth: used > 0 ? 4 : 0,
              }} />
            </div>
            <div style={{ textAlign: 'right', fontSize: 10, color: barColor, fontWeight: 700, marginTop: 4 }}>
              {pctLabel} использовано
            </div>
<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: '#64748b' }}>
              <span>Использовано: {used.toLocaleString('ru')} ₽</span>
              <span>Лимит: {current.limits.convert}</span>
            </div>
          </div>
        );
      })()}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 10}}>
          <span>💱</span>
          <div>
            <div style={{fontSize: 10, color: '#94a3b8'}}>Обмен</div>
            <div style={{fontSize: 12, fontWeight: 700}}>{current.limits.convert}</div>
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 10}}>
          <span>💸</span>
          <div>
            <div style={{fontSize: 10, color: '#94a3b8'}}>Вывод</div>
            <div style={{fontSize: 12, fontWeight: 700}}>{current.limits.withdraw}</div>
          </div>
        </div>
      </div>

      <button onClick={onOpen} style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', color: '#fff', fontWeight: 700, background: next ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(34,197,94,0.2)', cursor: 'pointer' }}>
        {next ? `Перейти на уровень ${nextLvl} →` : 'Максимальный уровень'}
      </button>
    </section>
  );
}



function HistorySection({ history, onClear }: { history: Transaction[]; onClear: () => void }) {
  const [expanded, setExpanded] = useState(false);
  if (history.length === 0) return null;
  const visible = expanded ? history : history.slice(0, 3);

  return (
    <section style={{
      border: '1px solid rgba(255,255,255,0.1)',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 16, padding: 16,
      ...fade, animationDelay: '0.14s'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>

        <div style={{ fontSize: 16, fontWeight: 800 }}>📜 История обменов</div>
        <button
          onClick={() => { if (confirm('Очистить историю?')) onClear() }}
          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', fontSize: 11, padding: '4px 8px', borderRadius: 6, cursor: 'pointer' }}
        >
          Очистить
        </button>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        {visible.map((tx) => (
          <div key={tx.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '10px 12px',
            background: 'rgba(15,23,42,0.6)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(124,58,237,0.2))',
              border: '1px solid rgba(124,58,237,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, flexShrink: 0,
            }}>🔄</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
<span title={tx.konAmount.toLocaleString('ru') + ' КОН'}>{fmtCompact(tx.konAmount)} КОН</span>
                <span style={{ color: '#64748b', fontSize: 11 }}>→</span>
                <span style={{ color: '#a78bfa' }} title={tx.conAmount.toLocaleString('ru') + ' CON'}>{fmtCompact(tx.conAmount)} CON</span>
                <span style={{
                  fontSize: 9, fontWeight: 700,
                  padding: '2px 6px', borderRadius: 5,
                  background: 'rgba(34,197,94,0.15)',
                  color: '#86efac',
                  border: '1px solid rgba(34,197,94,0.3)',
                  marginLeft: 'auto',
                }}>✓</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }} title={'~' + Math.round(tx.rubAmount).toLocaleString('ru') + ' ₽'}>
                {formatRelativeTime(tx.timestamp)} · ~{fmtCompact(Math.round(tx.rubAmount))} ₽
              </div>
            </div>
          </div>
        ))}
      </div>

      {history.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: '100%', marginTop: 10, padding: '8px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', fontSize: 12, fontWeight: 600,
            borderRadius: 8, cursor: 'pointer',
          }}
        >
          {expanded ? `Свернуть ↑` : `Показать все (${history.length}) ↓`}
        </button>
      )}
    </section>
  );
}

function KycBadge({ profile, onClick }: { profile: any; onClick: () => void }) {
  const lvl = profile.level;
  const cfg = lvl === 0
    ? { icon: '👤', color: '#64748b', bg: 'rgba(100,116,139,0.15)', border: 'rgba(100,116,139,0.4)', label: 'Lv.0' }
    : lvl === 1
    ? { icon: '📧', color: '#60a5fa', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)', label: 'Lv.1' }
    : lvl === 2
    ? { icon: '🪪', color: '#a78bfa', bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)', label: 'Lv.2' }
    : { icon: '💎', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.5)', label: 'VIP' };

  const pulse = profile.status === 'under_review';

  return (
    <button
      onClick={onClick}
      title={`KYC уровень ${lvl}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '6px 10px',
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 10,
        color: cfg.color,
        fontSize: 12,
        fontWeight: 800,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        boxShadow: pulse ? `0 0 0 0 ${cfg.color}` : 'none',
        animation: pulse ? 'kycPulse 2s infinite' : 'none',
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <span style={{ fontSize: 14 }}>{cfg.icon}</span>
      <span>{cfg.label}</span>
    </button>
  );
}

function PriceCard({name,price}:{name:string;price:number|null}) {
  const fmt = (p:number) => {
    if (name==='BTC') return '$'+Math.round(p).toLocaleString('en-US')
    return '$'+p.toFixed(p<1?4:2)
  }
  return (
    <div style={{border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.04)',borderRadius:12,padding:'10px 8px',textAlign:'center'}}>
      <div style={{color:'#94a3b8',fontSize:11}}>{name}</div>
      <div style={{fontSize:15,fontWeight:800,marginTop:4}}>{price!==null?fmt(price):'...'}</div>
    </div>
  )
}

export default App
