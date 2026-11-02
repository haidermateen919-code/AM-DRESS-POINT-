import React,{useMemo,useState} from 'react';
import { ArrowDownLeft, ArrowUpRight, BarChart3, Banknote, Download, HandCoins, Plus, ReceiptText, Trash2, UserRound, Users, Wallet } from 'lucide-react';
import { useShop } from './store.jsx';
import { amount, dateKey, fmtDate, money, orderBalance, orderPaid, orderTotal, shiftDay, STATUS, uid, workerTotals } from './model.js';
import { download, reportCsv } from './export.js';
import { CardHead, Empty, ErrorText, Field, Initials, Modal, ModalFooter, PageHead, StatusPill, TextLink } from './ui.jsx';

const EXPENSES=['Dhaga / samaan','Mazdoori','Kiraya','Bijli','Machine / marammat','Dusra'];
export function ExpenseForm({workerId='',onClose}) {
  const {data,mutate}=useShop();const [category,setCategory]=useState(workerId?'Mazdoori':'Dhaga / samaan'),[worker,setWorker]=useState(workerId),[value,setValue]=useState(''),[date,setDate]=useState(dateKey()),[note,setNote]=useState(''),[error,setError]=useState(''),[saving,setSaving]=useState(false);
  async function submit(e){e.preventDefault();if(!amount(value))return setError('Amount zero se zyada likhein.');setSaving(true);try{await mutate(d=>d.expenses.unshift({id:uid('e'),category,workerId:category==='Mazdoori'?worker:'',amount:amount(value),date,note:note.trim().slice(0,500)}));onClose();}catch(_){setError('Kharcha save nahi ho saka.');}finally{setSaving(false);}}
  return <Modal title={workerId?'Karigar ko payment':'Naya kharcha'} subtitle="Yeh raqam kharchon mein bhi shamil hogi." onClose={onClose}><form onSubmit={submit}><div className="form-grid"><Field label="Kharchay ki qisam"><select disabled={!!workerId} value={category} onChange={e=>setCategory(e.target.value)}>{EXPENSES.map(x=><option key={x}>{x}</option>)}</select></Field>{category==='Mazdoori'&&<Field label="Karigar"><select value={worker} disabled={!!workerId} onChange={e=>setWorker(e.target.value)}><option value="">Select nahi</option>{data.workers.map(w=><option value={w.id} key={w.id}>{w.name}</option>)}</select></Field>}<Field label="Amount (Rs.)" required><input type="number" autoFocus min="0.01" step="0.01" value={value} onChange={e=>setValue(e.target.value)} required/></Field><Field label="Date"><input type="date" value={date} onChange={e=>setDate(e.target.value)} required/></Field><Field label="Note" className="span-all"><input value={note} maxLength={500} onChange={e=>setNote(e.target.value)} placeholder="Optional"/></Field></div><ErrorText>{error}</ErrorText><ModalFooter onClose={onClose} busy={saving} save="Payment / kharcha save karein"/></form></Modal>;
}
function FinanceStat({label,value,detail,icon:Icon,tone}) {return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className={'stat-icon '+tone}><Icon size={17}/></span></div><div className="stat-value">{money(value)}</div><div className="stat-detail">{detail}</div></div>;}
export function Finance({onOrder}) {
  const {data,mutate}=useShop();const [tab,setTab]=useState('payments'),[expense,setExpense]=useState(false);
  const totals={billed:data.orders.reduce((s,o)=>s+orderTotal(o),0),received:data.orders.reduce((s,o)=>s+orderPaid(o),0),due:data.orders.reduce((s,o)=>s+orderBalance(o),0),spent:data.expenses.reduce((s,e)=>s+amount(e.amount),0)};
  const payments=data.orders.flatMap(o=>(o.payments||[]).map(p=>({...p,orderId:o.id,orderNo:o.number,customer:o.customerName}))).sort((a,b)=>String(b.date).localeCompare(a.date));
  const expenses=[...data.expenses].sort((a,b)=>String(b.date).localeCompare(a.date));
  async function removeExpense(id){if(window.confirm('Yeh kharcha / mazdoori payment delete kar dein?'))try{await mutate(d=>{d.expenses=d.expenses.filter(e=>e.id!==id)});}catch(_){window.alert('Kharcha delete save nahi ho saka.');}}
  return <div className="page"><PageHead eyebrow="HISAAB KITAAB" title={<>Paisay ka, <em>saaf hisaab.</em></>} subtitle="Wasooli, baqaya aur kharchay alag alag dekhain." actions={<button className="btn btn-green" onClick={()=>setExpense(true)}><Plus size={17}/> Kharcha add karein</button>}/>
    <div className="stats-grid"><FinanceStat label="Total bills" value={totals.billed} detail="Tamam orders ka total" icon={ReceiptText} tone="sage"/><FinanceStat label="Total wasooli" value={totals.received} detail="Receive huay paisay" icon={ArrowDownLeft} tone="mint"/><FinanceStat label="Baqaya" value={totals.due} detail="Customers se lena hai" icon={Wallet} tone="sand"/><FinanceStat label="Total kharcha" value={totals.spent} detail="Recorded kharchay" icon={ArrowUpRight} tone="rose"/></div>
    <section className="card list-card"><div className="list-toolbar"><div><h2>Raqam ki entry</h2><p>Payment lene ke liye order khol kar “Payment” dabayein.</p></div></div><div className="filter-row"><button className={tab==='payments'?'active':''} onClick={()=>setTab('payments')}>Wasooli ({payments.length})</button><button className={tab==='expenses'?'active':''} onClick={()=>setTab('expenses')}>Kharchay ({expenses.length})</button></div>
      {tab==='payments'?(payments.length?<div className="ledger-list">{payments.map(p=><button className="ledger-row" key={p.id} onClick={()=>onOrder(p.orderId)}><span className="ledger-icon in"><ArrowDownLeft size={17}/></span><span className="ledger-desc"><strong>{p.customer}</strong><small>{p.orderNo} · {fmtDate(p.date)} · {p.method}</small></span><strong className="positive">+ {money(p.amount)}</strong><ArrowUpRight size={15}/></button>)}</div>:<Empty icon={Banknote} title="Abhi payment nahi" text="Kisi order mein payment add karein."/>):(expenses.length?<div className="ledger-list">{expenses.map(e=><div className="ledger-row" key={e.id}><span className="ledger-icon out"><ArrowUpRight size={17}/></span><span className="ledger-desc"><strong>{e.category}{e.workerId?' · '+(data.workers.find(w=>w.id===e.workerId)?.name||'Karigar'):''}</strong><small>{fmtDate(e.date)}{e.note?' · '+e.note:''}</small></span><strong>− {money(e.amount)}</strong><button className="icon-btn danger-icon" onClick={()=>removeExpense(e.id)} aria-label="Kharcha delete karein"><Trash2 size={15}/></button></div>)}</div>:<Empty icon={ReceiptText} title="Abhi kharcha nahi" text="Dukaan ka kharcha ya mazdoori add karein." action={<button className="btn btn-soft" onClick={()=>setExpense(true)}>Kharcha add karein</button>}/>)}
    </section>{expense&&<ExpenseForm onClose={()=>setExpense(false)}/>}</div>;
}

function WorkerForm({worker,onClose}) {
  const {mutate}=useShop();const [name,setName]=useState(worker?.name||''),[phone,setPhone]=useState(worker?.phone||''),[error,setError]=useState(''),[saving,setSaving]=useState(false);
  async function submit(e){e.preventDefault();if(!name.trim())return setError('Karigar ka naam likhein.');setSaving(true);try{await mutate(d=>{if(worker){const w=d.workers.find(x=>x.id===worker.id);w.name=name.trim().slice(0,100);w.phone=phone.trim().slice(0,40);}else d.workers.push({id:uid('w'),name:name.trim().slice(0,100),phone:phone.trim().slice(0,40)});});onClose();}catch(_){setError('Karigar save nahi ho saka.');}finally{setSaving(false);}}
  return <Modal title={worker?'Karigar ki details':'Naya karigar'} subtitle="Karigar ko order item par assign kar sakte hain." onClose={onClose}><form onSubmit={submit}><div className="form-grid"><Field label="Naam" required><input autoFocus value={name} maxLength={100} onChange={e=>setName(e.target.value)} required/></Field><Field label="Mobile number"><input type="tel" value={phone} maxLength={40} onChange={e=>setPhone(e.target.value)} placeholder="Optional"/></Field></div><ErrorText>{error}</ErrorText><ModalFooter onClose={onClose} busy={saving} save="Karigar save karein"/></form></Modal>;
}
function WorkerDetail({id,onClose,onOrder}) {
  const {data,mutate}=useShop();const [pay,setPay]=useState(false),[edit,setEdit]=useState(false),[error,setError]=useState('');const worker=data.workers.find(w=>w.id===id);if(!worker)return null;
  const totals=workerTotals(data,id);const tasks=data.orders.flatMap(o=>(o.items||[]).filter(i=>i.workerId===id).map(i=>({order:o,item:i})));
  async function del(){if(tasks.length||data.expenses.some(e=>e.workerId===id))return setError('Is karigar ka kaam ya payment record mojood hai; delete nahi ho sakta.');if(window.confirm('Karigar ka record delete karein?')){try{await mutate(d=>{if(d.orders.some(o=>o.items.some(i=>i.workerId===id))||d.expenses.some(e=>e.workerId===id))throw new Error('Karigar ka record use ho raha hai.');d.workers=d.workers.filter(w=>w.id!==id)});onClose();}catch(_){setError('Delete save nahi ho saka.');}}}
  return <><Modal title={worker.name} subtitle={worker.phone||'Karigar ka hisaab'} onClose={onClose} wide><div className="detail-actions"><button className="btn btn-green btn-small" onClick={()=>setPay(true)}><HandCoins size={15}/> Mazdoori dein</button><button className="btn btn-soft btn-small" onClick={()=>setEdit(true)}>Details badlein</button><span className="grow"/><button className="icon-btn danger-icon" onClick={del} aria-label="Karigar delete karein"><Trash2 size={16}/></button></div><ErrorText>{error}</ErrorText>
    <div className="invoice-summary four"><div><span>Assigned kaam</span><strong>{money(totals.agreed)}</strong></div><div><span>Tayyar kaam</span><strong>{money(totals.completed)}</strong></div><div><span>Diye paisay</span><strong>{money(totals.paid)}</strong></div><div><span>Baqaya / advance</span><strong>{totals.advance?`+ ${money(totals.advance)}`:money(totals.due)}</strong></div></div><p className="muted-small">Tayyar kaam sirf “Tayyar” aur “Diya gaya” items par gina jata hai. Advance ko + se dikhaya gaya hai.</p>
    <div className="detail-section-title"><div><span className="mini-eyebrow">ASSIGNED WORK</span><h3>Karigar ka kaam</h3></div></div>{tasks.length?<div className="ledger-list">{tasks.map(({order,item})=><button className="ledger-row" key={item.id} onClick={()=>{onClose();onOrder(order.id);}}><span className="ledger-icon in"><UserRound size={16}/></span><span className="ledger-desc"><strong>{order.number} · {item.personName}</strong><small>{item.quantity} × {item.type} · {money(item.wage)} / piece</small></span><StatusPill status={item.status}/><ArrowUpRight size={15}/></button>)}</div>:<p className="muted-small">Abhi koi kaam assign nahi hua.</p>}</Modal>
    {pay&&<ExpenseForm workerId={id} onClose={()=>setPay(false)}/>} {edit&&<WorkerForm worker={worker} onClose={()=>setEdit(false)}/>}</>;
}
export function Workers({onOrder}) {
  const {data}=useShop();const [add,setAdd]=useState(false),[selected,setSelected]=useState('');
  return <div className="page"><PageHead eyebrow="KARIGAR" title={<>Saath kaam, <em>saaf hisaab.</em></>} subtitle="Karigar ka assigned kaam aur mazdoori dekhain." actions={<button className="btn btn-primary" onClick={()=>setAdd(true)}><Plus size={17}/> Naya karigar</button>}/>
    <section className="card list-card"><div className="list-toolbar"><div><h2>Karigar register</h2><p>Order banate waqt har item par karigar select karein.</p></div></div>
      {data.workers.length?<div className="worker-grid">{data.workers.map(w=>{const t=workerTotals(data,w.id);return <button className="worker-card" key={w.id} onClick={()=>setSelected(w.id)}><div className="worker-top"><Initials name={w.name}/><ArrowUpRight size={17}/></div><strong>{w.name}</strong><span>{w.phone||'Phone number nahi'}</span><div className="worker-finance"><div><small>Tayyar kaam</small><b>{money(t.completed)}</b></div><div><small>{t.advance?'Advance':'Baqaya'}</small><b>{money(t.advance||t.due)}</b></div></div></button>})}</div>:<Empty icon={Users} title="Abhi koi karigar nahi" text="Agar aap akelay kaam karte hain to yeh optional hai." action={<button className="btn btn-soft" onClick={()=>setAdd(true)}>Karigar add karein</button>}/>}
    </section>{add&&<WorkerForm onClose={()=>setAdd(false)}/>} {selected&&<WorkerDetail id={selected} onClose={()=>setSelected('')} onOrder={onOrder}/>}</div>;
}

function monthKey(day){return day.slice(0,7);}

const MIX_COLORS={naya:'#98a2b3',cutting:'#f5a524',silai:'#fb7d3c',fitting:'#6366f1',tayyar:'#0f9d6e',diya:'#0e7490'};
const DONUT_COLORS=['#0f9d6e','#f5a524','#6366f1','#fb7d3c','#0e7490','#98a2b3','#e11d48'];

function smoothPath(points) {
  if (!points.length) return '';
  if (points.length === 1) return `M ${points[0][0]} ${points[0][1]}`;
  let d=`M ${points[0][0]} ${points[0][1]}`;
  for (let i=0;i<points.length-1;i++) {
    const p0=points[i-1]||points[i], p1=points[i], p2=points[i+1], p3=points[i+2]||p2;
    const c1=[p1[0]+(p2[0]-p0[0])/6, p1[1]+(p2[1]-p0[1])/6];
    const c2=[p2[0]-(p3[0]-p1[0])/6, p2[1]-(p3[1]-p1[1])/6];
    d+=` C ${c1[0].toFixed(2)} ${c1[1].toFixed(2)}, ${c2[0].toFixed(2)} ${c2[1].toFixed(2)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function TrendChart({points,daysLabel}) {
  const W=320,H=116,pad=9;
  const values=points.map(p=>p.value);
  const max=Math.max(1,...values);
  const n=points.length;
  const coords=points.map((p,i)=>[pad+(n===1?(W-pad*2)/2:i*(W-pad*2)/(n-1)), H-pad-(p.value/max)*(H-pad*2)]);
  const line=smoothPath(coords);
  const area=coords.length?`${line} L ${coords[coords.length-1][0].toFixed(2)} ${H-pad} L ${coords[0][0].toFixed(2)} ${H-pad} Z`:'';
  const peak=values.indexOf(Math.max(...values));
  const label=points[0]?.from&&points[points.length-1]?.to
    ? `${fmtDate(points[0].from)} — ${fmtDate(points[points.length-1].to)}`
    : daysLabel;
  return <div className="trend-wrap">
    <svg className="trend-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Wasooli ka rujhan: ${label}`}>
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12b981" stopOpacity=".3"/>
          <stop offset="100%" stopColor="#12b981" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0,1,2].map(i=><line key={i} className="trend-grid-line" x1={pad} x2={W-pad} y1={pad+i*(H-pad*2)/2} y2={pad+i*(H-pad*2)/2}/>)}
      {area&&<path className="trend-area" d={area}/>}
      {line&&<path className="trend-line" d={line}/>}
      {coords.map(([x,y],i)=>(n<=14||i===peak)&&<circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r={i===peak?3.8:2.4} className={i===peak?'trend-dot-peak':'trend-dot'}/>)}
    </svg>
    <div className="trend-labels"><span>{points[0]?fmtDate(points[0].from):''}</span><span>{points.length>2?fmtDate(points[Math.floor(points.length/2)].from):''}</span><span>{points.length?fmtDate(points[points.length-1].to):''}</span></div>
  </div>;
}

function Donut({items,total}) {
  const R=54,C=2*Math.PI*R;
  let offset=0;
  return <div className="donut-box">
    <svg className="donut" viewBox="0 0 140 140" role="img" aria-label="Kharchon ki taqseem">
      <circle className="donut-track" cx="70" cy="70" r={R}/>
      {items.map((item,index)=>{
        const len=C*(item.value/(total||1));
        const dash=Math.max(len-3,0.5);
        const circle=<circle key={item.name} className="donut-seg" cx="70" cy="70" r={R} stroke={item.color} strokeDasharray={`${dash.toFixed(2)} ${(C-dash).toFixed(2)}`} strokeDashoffset={(-offset).toFixed(2)}/>;
        offset+=len;
        return circle;
      })}
    </svg>
    <div className="donut-center"><small>Kul kharcha</small><strong>{money(total)}</strong></div>
  </div>;
}

export function Reports() {
  const {data}=useShop();const [range,setRange]=useState('30');const today=dateKey(), start=range==='all'?'0000-01-01':shiftDay(today,1-Number(range));
  const payments=data.orders.flatMap(o=>o.payments||[]).filter(p=>p.date>=start&&p.date<=today);const expenses=data.expenses.filter(e=>e.date>=start&&e.date<=today);
  const received=payments.reduce((s,p)=>s+amount(p.amount),0),spent=expenses.reduce((s,e)=>s+amount(e.amount),0),created=data.orders.filter(o=>o.createdDate>=start&&o.createdDate<=today).length;
  const dates=Array.from({length:6},(_,i)=>{const d=new Date();return dateKey(new Date(d.getFullYear(),d.getMonth()-(5-i),1,12));});
  const rawPayments=data.orders.flatMap(o=>o.payments||[]);const monthly=dates.map(day=>({day,in:rawPayments.filter(p=>monthKey(p.date)===monthKey(day)).reduce((s,p)=>s+amount(p.amount),0),out:data.expenses.filter(e=>monthKey(e.date)===monthKey(day)).reduce((s,e)=>s+amount(e.amount),0)}));
  const max=Math.max(1,...monthly.flatMap(x=>[x.in,x.out]));
  const categories=Object.entries(expenses.reduce((obj,e)=>({...obj,[e.category]:(obj[e.category]||0)+amount(e.amount)}),{})).sort((a,b)=>b[1]-a[1])
    .map(([name,value],index)=>({name,value,color:DONUT_COLORS[index%DONUT_COLORS.length]}));

  const days=range==='all'?30:Number(range);const bucketDays=days>31?7:1;const trend=[];
  for(let end=days;end>0;end-=bucketDays){
    const from=shiftDay(today,-(end-1));
    const to=end-bucketDays<0?today:shiftDay(today,-(end-bucketDays));
    trend.push({from,to,value:payments.filter(p=>p.date>=from&&p.date<=to).reduce((s,p)=>s+amount(p.amount),0)});
  }
  const trendDays=range==='all'?'Pichlay 30 din':`Pichlay ${range} din`;
  const half=Math.ceil(trend.length/2);
  const firstHalf=trend.slice(0,half).reduce((s,p)=>s+p.value,0),secondHalf=trend.slice(half).reduce((s,p)=>s+p.value,0);
  const change=firstHalf?Math.round((secondHalf-firstHalf)/firstHalf*100):(secondHalf>0?100:0);
  const mix=STATUS.map(status=>{
    const pieces=data.orders.reduce((sum,order)=>sum+(order.items||[]).filter(item=>item.status===status.id).reduce((n,item)=>n+Math.max(1,Number(item.quantity)||1),0),0);
    return {...status,color:MIX_COLORS[status.id],pieces};
  });
  const mixTotal=mix.reduce((s,x)=>s+x.pieces,0);
  const activeMix=mix.filter(x=>x.pieces>0);

  const exportCsv=kind=>download(`am-dress-point-${kind}-${today}.csv`,reportCsv(data,kind),'text/csv;charset=utf-8');
  return <div className="page"><PageHead eyebrow="REPORTS & ANALYTICS" title={<>Dukaan ki, <em>poori tasveer.</em></>} subtitle="Numbers ko samajhna ab mushkil nahi." actions={<select className="header-select" value={range} onChange={e=>setRange(e.target.value)} aria-label="Report period"><option value="7">Pichlay 7 din</option><option value="30">Pichlay 30 din</option><option value="90">Pichlay 90 din</option><option value="all">Shuru se ab tak</option></select>}/>
    <div className="stats-grid"><FinanceStat label="Wasooli" value={received} detail="Selected waqt mein" icon={ArrowDownLeft} tone="mint"/><FinanceStat label="Kharchay" value={spent} detail="Selected waqt mein" icon={ArrowUpRight} tone="rose"/><FinanceStat label="Net cash" value={received-spent} detail="Wasooli minus recorded kharchay" icon={Wallet} tone={received-spent>=0?'mint':'rose'}/><div className="stat-card"><div className="stat-top"><span>Naye orders</span><span className="stat-icon sand"><ReceiptText size={17}/></span></div><div className="stat-value">{created}</div><div className="stat-detail">Selected waqt mein</div></div></div>

    <div className="report-grid">
      <section className="card chart-shell">
        <CardHead eyebrow="WASOOLI KA RUJHAN" title="Paisay kab aa rahe hain?" subtitle={`${trendDays} · sirf received payments`} action={<span className={'chart-pill '+(change>0?'':change<0?'down':'flat')}>{change>0?'▲':change<0?'▼':'•'} {Math.abs(change)}%</span>}/>
        <div className="trend-caption"><div><strong>{money(received)}</strong><span> selected waqt mein wasooli</span></div><span className="muted-small">{trendDays}</span></div>
        <TrendChart points={trend} daysLabel={trendDays}/>
      </section>
      <section className="card chart-shell">
        <CardHead eyebrow="SELECTED WAQT" title="Kharchay kahan huay?" subtitle="Sirf woh kharchay jo aap ne likhe."/>
        {categories.length?<div className="donut-wrap"><Donut items={categories} total={spent}/>
          <div className="donut-legend">{categories.map(item=><div className="legend-row" key={item.name}><i style={{background:item.color}}/><span>{item.name}</span><strong>{money(item.value)}</strong><small>{Math.round(item.value/(spent||1)*100)}%</small></div>)}</div>
        </div>:<Empty icon={BarChart3} title="Abhi kharcha nahi" text="Kharcha likhne par chart nazar aayega."/>}
      </section>
    </div>

    <div className="report-grid">
      <section className="card chart-shell">
        <CardHead eyebrow="MAHANA NAZAR" title="Wasooli aur kharchay" subtitle="Pichlay 6 calendar mahinay · selected filter se alag"/>
        <div className="chart-legend"><span><i className="in-dot"/> Wasooli</span><span><i className="out-dot"/> Kharchay</span></div>
        <div className="month-chart">{monthly.map(x=><div className="month-col" key={x.day} title={`${fmtDate(x.day,{month:'long',year:'numeric'})}: ${money(x.in)} received, ${money(x.out)} kharcha`}><div className="month-bars"><i className="bar-in" style={{height:`${Math.max(2,x.in/max*100)}%`}}/><i className="bar-out" style={{height:`${Math.max(2,x.out/max*100)}%`}}/></div><span>{fmtDate(x.day,{month:'short'})}</span></div>)}</div>
      </section>
      <section className="card chart-shell">
        <CardHead eyebrow="MAUJOODA KAAM" title="Kaam kis stage par hai?" subtitle="Tamam orders ke joray, status ke hisaab se."/>
        {mixTotal?<>
          <div className="mix-bar" role="img" aria-label="Kaam ka status breakdown">{activeMix.map(item=><i key={item.id} style={{flexBasis:`${item.pieces/mixTotal*100}%`,background:item.color}} title={`${item.label}: ${item.pieces}`}/>)}</div>
          <div className="mix-legend">{activeMix.map(item=><span key={item.id}><i style={{background:item.color}}/>{item.label} <strong>{item.pieces}</strong></span>)}</div>
          <div className="mix-total"><span>Kul joray register mein</span><strong>{mixTotal}</strong></div>
        </>:<Empty icon={BarChart3} title="Abhi koi kaam nahi" text="Order add karne par status breakdown yahan aayega."/>}
      </section>
    </div>

    <p className="report-disclaimer">Net cash profit nahi hai: stock, udhaar aur jo kharchay record nahi huay, woh is mein shamil nahi.</p>
    <section className="card export-card"><div className="export-icon"><Download size={19}/></div><div><div className="mini-eyebrow">POWER BI READY</div><h2>Apna data CSV mein lein</h2><p>Yeh files Excel ya Power BI mein manually import hoti hain. Live Power BI connection is version mein nahi hai.</p><div className="export-buttons"><button onClick={()=>exportCsv('orders')}>Orders CSV</button><button onClick={()=>exportCsv('items')}>Items CSV</button><button onClick={()=>exportCsv('payments')}>Payments CSV</button><button onClick={()=>exportCsv('expenses')}>Expenses CSV</button></div></div></section>
  </div>;
}
