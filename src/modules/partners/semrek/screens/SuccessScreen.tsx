import{useEffect,useState}from"react";import type{OrderData}from"./CheckoutScreen";import{companyInfo}from"../data/store";
interface Props{order:OrderData;total:number;konEarn:number;onHome:()=>void;onAddKon?:(n:number)=>void}
export default function SuccessScreen({order,total,konEarn,onHome,onAddKon}:Props){
const[show,setShow]=useState(false);const[count,setCount]=useState(0);
useEffect(()=>{setTimeout(()=>setShow(true),100);if(onAddKon){const t=setInterval(()=>{setCount(c=>{if(c>=konEarn){clearInterval(t);return konEarn;}onAddKon(1);return c+1;});},80);return()=>clearInterval(t);}},[konEarn,onAddKon]);
return(<div className="sr-container"style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"80vh",textAlign:"center"}}>
<div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#2a6fd6,#3dbde0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,marginBottom:24,transform:show?"scale(1)":"scale(0)",transition:"transform .5s cubic-bezier(.175,.885,.32,1.275)"}}>✓</div>
<h2 style={{color:"#fff",fontSize:24,marginBottom:8,opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all .4s .2s"}}>Заказ оформлен!</h2>
<p style={{color:"rgba(200,225,255,0.7)",fontSize:14,marginBottom:24,opacity:show?1:0,transition:"opacity .4s .3s"}}>Менеджер свяжется с вами в ближайшее время</p>
<div style={{background:"rgba(42,111,214,0.15)",borderRadius:16,padding:20,width:"100%",maxWidth:360,marginBottom:24,border:"1px solid rgba(120,170,255,0.15)",opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all .4s .4s"}}>
<div style={{fontSize:13,color:"rgba(200,225,255,0.6)",marginBottom:12}}>Детали заказа</div>
<div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:"#fff",marginBottom:6}}><span>Способ оплаты</span><span>{order.payment==="card"?"Карта":order.payment==="sbp"?"СБП":"Наличные"}</span></div>
<div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:"#fff",marginBottom:6}}><span>Сумма</span><span>{total.toLocaleString("ru-RU")} ₽</span></div>
<div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:"#7cc1ff",fontWeight:700,marginTop:10,paddingTop:10,borderTop:"1px solid rgba(120,170,255,0.2)"}}><span>Начислено КОН</span><span>+{count}</span></div>
</div>
<div style={{fontSize:13,color:"rgba(140,170,210,0.5)",marginBottom:24,opacity:show?1:0,transition:"opacity .4s .5s"}}>
{companyInfo.phone}<br/>{companyInfo.address}
</div>
<button onClick={onHome}className="sr-btn sr-btn--primary"style={{opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all .4s .6s",padding:"14px 32px"}}>Вернуться в магазин</button>
</div>);}
