// ====== CONTRIBUTION GRAPH ======
// Seeded PRNG so the graph looks the same on every visit (per day)
function seededRand(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
(function buildContribGraph(){
  const grid=document.getElementById('contrib-grid');
  const months=document.getElementById('contrib-months');
  const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today=new Date(); today.setHours(0,0,0,0);
  const start=new Date(today); start.setDate(start.getDate()-364-start.getDay()); // align to Sunday
  const rand=seededRand(4269);
  let total=0, week=0, lastMonth=-1;
  for(let d=new Date(start); d<=today; d.setDate(d.getDate()+1)){
    const dow=d.getDay();
    if(dow===0){
      if(d.getMonth()!==lastMonth){
        const m=document.createElement('span');
        m.style.gridColumn=(week+1)+'';
        m.textContent=MONTHS[d.getMonth()];
        months.appendChild(m);
        lastMonth=d.getMonth();
      }
      week++;
    }
    // Weekends and Fridays are heavy, summer is heavier, Mondays recovering
    let base=[0.75,0.35,0.5,0.55,0.6,0.9,0.95][dow];
    if(d.getMonth()>=5&&d.getMonth()<=8) base+=0.1;
    const r=rand();
    const count=r>base?0:Math.round(Math.pow(rand(),1.5)*base*16);
    total+=count;
    const lvl=count===0?0:count<3?1:count<6?2:count<10?3:4;
    const cell=document.createElement('div');
    cell.className='contrib-cell lvl'+lvl;
    cell.style.gridRow=(dow+1)+'';
    cell.style.gridColumn=week+'';
    cell.title=(count===0?'No rakia (suspicious)':count+' rakia')+' on '+DAYS[dow]+', '+MONTHS[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear();
    grid.appendChild(cell);
  }
  document.getElementById('contrib-total').textContent=total.toLocaleString();
  const sc=grid.parentElement; sc.scrollLeft=sc.scrollWidth; // show most recent weeks first on small screens
})();

// ====== STATUS PAGE UPTIME BARS ======
(function buildUptime(){
  const body=document.getElementById('status-body');
  const anchor=body.querySelector('.incidents-title');
  const rand=seededRand(1337);
  const COMPONENTS=[
    { name:'🛁 Jacuzzi',            p:()=>'' },
    { name:'🥃 Rakia supply',       p:i=>i===62?'warn':'' },
    { name:'🧍 Standup attendance', p:()=>rand()<0.96?'down':(rand()<0.5?'warn':'') },
    { name:'💻 Desk presence',      p:()=>'down' },
  ];
  COMPONENTS.forEach(c=>{
    const states=Array.from({length:90},(_,i)=>c.p(i));
    const up=states.filter(s=>s==='').length + states.filter(s=>s==='warn').length*0.5;
    const pct=(up/90*100);
    const color=pct>99?'#3fb950':pct>50?'#e3b341':'#ff7b72';
    const row=document.createElement('div');
    row.innerHTML=
      `<div class="uptime-row-head"><span>${c.name}</span><span class="pct" style="color:${color}">${pct.toFixed(2)}% uptime</span></div>`+
      `<div class="uptime-bars">${states.map((s,i)=>`<i class="${s}" title="${90-i} days ago: ${s==='down'?'outage':s==='warn'?'degraded':'operational'}"></i>`).join('')}</div>`+
      `<div class="uptime-foot"><span>90 days ago</span><span>today</span></div>`;
    body.insertBefore(row,anchor);
  });
})();

// ====== MATCH STATS (head to head) ======
(function buildMatchStats(){
  const STATS=[
    { label:'🎫 Tickets processed',           home:3,    away:41 },
    { label:'🥃 Drinks per ticket processed', home:47.3, away:0.2 },
    { label:'⚽ xD (expected drinks)',         home:142,  away:8 },
    { label:'🎯 Shots on target (rakia)',     home:118,  away:5 },
    { label:'🧍 Standups attended',           home:0,    away:58 },
    { label:'🟨 Yellow cards (HR tickets)',   home:12,   away:0 },
  ];
  const wrap=document.getElementById('cmp-rows');
  STATS.forEach(s=>{
    const max=Math.max(s.home,s.away)||1;
    const row=document.createElement('div');
    row.className='cmp-row';
    row.innerHTML=
      `<span class="cmp-val home">${s.home}</span>`+
      `<div class="cmp-mid"><div class="cmp-label">${s.label}</div>`+
      `<div class="cmp-bars"><span class="h"><i style="width:${s.home/max*100}%"></i></span><span class="a"><i style="width:${s.away/max*100}%"></i></span></div></div>`+
      `<span class="cmp-val away">${s.away}</span>`;
    wrap.appendChild(row);
  });
  wrap.style.cssText='display:flex;flex-direction:column;gap:9px';
})();
