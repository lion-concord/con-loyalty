import { WalletPanel } from "./WalletPanel";
import { useState, useEffect } from 'react'
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react'

const fade = { animation: 'fadeIn 0.6s ease-out both' }

function App() {
  // @ts-ignore
  let tgUser: any = null
  try { const W = (window as any).Telegram?.WebApp; if(W){W.ready();W.expand();tgUser=W.initDataUnsafe?.user; console.log("TG DATA:",JSON.stringify(W.initDataUnsafe))} } catch(e){console.error("TG ERR:",e)}

  const [kon, setKon] = useState(100)
  const ton = (kon * 0.01).toFixed(2)
  const wallet = useTonWallet()
  const [prices, setPrices] = useState<{ton:number|null,btc:number|null,con:number|null}>({ton:null,btc:null,con:null})

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

  const share = () => {
    if (navigator.share) {
      navigator.share({title:'Токен КОН',text:'Лояльность теперь в крипте!',url:window.location.href})
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Ссылка скопирована!')
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(to bottom,#0f172a,#111827 45%,#020617)',color:'white',fontFamily:'system-ui,sans-serif',padding:'24px 16px'}}>
      <style>{"@keyframes fadeIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}"}</style>
      <div style={{maxWidth:900,margin:'0 auto',display:'grid',gap:20}}>
        <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.5rem 0',...fade}}>
          <div>
            <div style={{fontSize:28,fontWeight:800}}>Токен КОН</div>
            <div style={{color:'#94a3b8',marginTop:6}}>Лояльность на КОН</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}><WalletPanel /><TonConnectButton /></div>
        </header>
        {tgUser && <div style={{fontSize:18,color:"#a78bfa",marginTop:4,marginBottom:4}}>Привет, {tgUser.first_name}! 👋</div>}
        <section style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,...fade,animationDelay:'0.05s'}}>
          <PriceCard name="TON" price={prices.ton}/>
          <PriceCard name="BTC" price={prices.btc}/>
          <PriceCard name="CON" price={prices.con}/>
        </section>
        {wallet && (
          <section style={{border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.04)',borderRadius:20,padding:20,display:'flex',alignItems:'center',gap:12,...fade}}>
            <div style={{width:10,height:10,borderRadius:'50%',background:'#22c55e'}}/>
            <div>
              <div style={{fontWeight:700}}>Кошелёк подключён</div>
              <div style={{color:'#94a3b8',fontSize:13}}>...{wallet.account.address.slice(-6)}</div>
            </div>
          </section>
        )}
        <section style={{border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.04)',borderRadius:24,padding:24,...fade,animationDelay:'0.1s'}}>
          <h2 style={{fontSize:26,fontWeight:800,margin:0}}>Твоя лояльность теперь в крипте</h2>
<p style={{fontSize:16,lineHeight:1.7,color:'#cbd5e1',marginTop:12}}>КОН — токен системы лояльности. Получай бонусы, копи награды и обменивай на КОН.</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:24}}>
            <a href="https://app.ston.fi/swap?chartVisible=false&ft=TON&tt=EQBSQLwtqeXlA2AhnErNpA4vR6AimD81Cj5GpxIqgoXPDURX" target="_blank" rel="noreferrer" style={{textDecoration:'none',color:'white',background:'linear-gradient(135deg,#2563eb,#7c3aed)',padding:'14px 20px',borderRadius:14,fontWeight:700}}>Купить КОН</a>
            <a href="#converter" style={{textDecoration:'none',color:'white',border:'1px solid rgba(255,255,255,0.14)',background:'rgba(255,255,255,0.04)',padding:'14px 20px',borderRadius:14,fontWeight:700}}>Конвертер</a>
            <button onClick={share} style={{cursor:'pointer',color:'white',border:'1px solid rgba(255,255,255,0.14)',background:'rgba(255,255,255,0.04)',padding:'14px 20px',borderRadius:14,fontWeight:700,fontSize:16}}>Поделиться</button>
          </div>
        </section>
        <section id="converter" style={{border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.04)',borderRadius:24,padding:24,...fade,animationDelay:'0.2s'}}>
          <div style={{fontSize:24,fontWeight:800,marginBottom:18}}>Конвертер КОН - TON</div>
          <div style={{display:'grid',gap:16}}>
            <label style={{display:'grid',gap:8}}>
              <span style={{color:'#cbd5e1'}}>Количество КОН</span>
              <input type="number" value={kon} onChange={(e)=>setKon(Number(e.target.value))} style={{width:'100%',padding:'14px 16px',borderRadius:14,border:'1px solid rgba(255,255,255,0.14)',background:'rgba(15,23,42,0.8)',color:'white',fontSize:18,outline:'none',boxSizing:'border-box'}}/>
            </label>
            <div style={{padding:'16px 18px',borderRadius:14,background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.18)',fontSize:18}}>
              Это примерно <b>{ton} TON</b>
            </div>
          </div>
        </section>
        <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,...fade,animationDelay:'0.3s'}}>
          <Card title="Бонусы" text="Начисляй награды за покупки."/>
          <Card title="Рефералы" text="Приглашай друзей и получай бонус."/>
          <Card title="Безопасность" text="Операции через TON и STON.fi."/>
        </section>
        <footer style={{padding:'18px 0 6px',color:'#94a3b8',fontSize:14,textAlign:'center'}}>Токен КОН — Лояльность на КОН</footer>
      </div>
    </div>
  )
}

function PriceCard({name,price}:{name:string;price:number|null}) {
  return (
    <div style={{border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.04)',borderRadius:18,padding:16,textAlign:'center'}}>
      <div style={{color:'#94a3b8',fontSize:13}}>{name}</div>
      <div style={{fontSize:22,fontWeight:800,marginTop:6}}>{price!==null?'$'+(name==='BTC'?price.toFixed(0):price<1?price.toFixed(4):price.toFixed(2)):'...'}</div>
    </div>
  )
}

function Card({title,text}:{title:string;text:string}) {
  return (
    <div style={{border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.04)',borderRadius:20,padding:20}}>
      <div style={{fontSize:20,fontWeight:800}}>{title}</div>
      <div style={{marginTop:10,color:'#cbd5e1',lineHeight:1.6}}>{text}</div>
    </div>
  )
}

export default App
