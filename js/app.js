// ── Per-resident baseline profiles (unique metrics per person) ──────────
const RESIDENT_PROFILES = [
  // 0: George Mitchell — stable, well-managed
  { ph:{mob:84,fr:14,slp:78,bath:88,act:72,str:92}, mn:{sent:80,well:76,comp:74,lat:1.8},
    cl:{bp:'118/76',hr:68,med:94,tv:2,cr:18},
    tx:'"Good morning. Feeling well today, slept nicely last night."',
    devs:[{m:'Mobility Score',b:'82-88',v:84,ok:true},{m:'Sleep Quality',b:'74-82',v:78,ok:true},{m:'Sentiment Score',b:'72-84',v:80,ok:true},{m:'Bathroom Routine',b:'84-92',v:88,ok:true},{m:'Fall Risk Index',b:'10-18',v:14,ok:true,inv:true}] },
  // 1: Harold Brennan — watch, COPD affecting mobility
  { ph:{mob:61,fr:48,slp:58,bath:65,act:44,str:66}, mn:{sent:55,well:50,comp:58,lat:3.1},
    cl:{bp:'134/84',hr:82,med:78,tv:1,cr:49},
    tx:'"Morning... okay I suppose. Legs feel heavy, breathing a bit tight today."',
    devs:[{m:'Mobility Score',b:'70-80',v:61,ok:false},{m:'Sleep Quality',b:'65-75',v:58,ok:false},{m:'Sentiment Score',b:'60-72',v:55,ok:false},{m:'Bathroom Routine',b:'78-88',v:65,ok:false},{m:'Fall Risk Index',b:'12-22',v:48,ok:false,inv:true}] },
  // 2: Dorothy Santos — stable, osteoporosis managed
  { ph:{mob:79,fr:18,slp:82,bath:91,act:68,str:74}, mn:{sent:85,well:80,comp:78,lat:1.5},
    cl:{bp:'122/78',hr:64,med:96,tv:3,cr:14},
    tx:'"Good morning! Slept wonderfully. Looking forward to my walk today."',
    devs:[{m:'Mobility Score',b:'76-84',v:79,ok:true},{m:'Sleep Quality',b:'78-86',v:82,ok:true},{m:'Sentiment Score',b:'80-90',v:85,ok:true},{m:'Bathroom Routine',b:'88-96',v:91,ok:true},{m:'Fall Risk Index',b:'14-22',v:18,ok:true,inv:true}] },
  // 3: Robert Kim — critical, heart failure + diabetes
  { ph:{mob:28,fr:84,slp:32,bath:38,act:18,str:34}, mn:{sent:24,well:22,comp:28,lat:6.8},
    cl:{bp:'158/96',hr:88,med:52,tv:0,cr:88},
    tx:'"I do not feel good... balance is off. Took a long time to get up this morning."',
    devs:[{m:'Mobility Score',b:'72-82',v:28,ok:false},{m:'Sleep Quality',b:'68-78',v:32,ok:false},{m:'Sentiment Score',b:'62-74',v:24,ok:false},{m:'Bathroom Routine',b:'80-90',v:38,ok:false},{m:'Fall Risk Index',b:'10-20',v:84,ok:false,inv:true}] },
  // 4: Eleanor Pham — stable, hypertension well controlled
  { ph:{mob:82,fr:16,slp:74,bath:85,act:76,str:88}, mn:{sent:77,well:74,comp:72,lat:2.0},
    cl:{bp:'126/80',hr:70,med:92,tv:2,cr:22},
    tx:'"Good morning. Feeling pretty good, a little tired but managing well."',
    devs:[{m:'Mobility Score',b:'80-88',v:82,ok:true},{m:'Sleep Quality',b:'70-80',v:74,ok:true},{m:'Sentiment Score',b:'70-82',v:77,ok:true},{m:'Bathroom Routine',b:'82-92',v:85,ok:true},{m:'Fall Risk Index',b:'12-20',v:16,ok:true,inv:true}] },
  // 5: James Wilson — watch, Parkinson's + insomnia
  { ph:{mob:58,fr:52,slp:44,bath:62,act:40,str:55}, mn:{sent:48,well:44,comp:52,lat:3.8},
    cl:{bp:'136/86',hr:78,med:72,tv:1,cr:56},
    tx:'"Not great... hands are shaky this morning. Couldn\'t sleep again last night."',
    devs:[{m:'Mobility Score',b:'65-76',v:58,ok:false},{m:'Sleep Quality',b:'55-68',v:44,ok:false},{m:'Sentiment Score',b:'55-70',v:48,ok:false},{m:'Bathroom Routine',b:'72-84',v:62,ok:false},{m:'Fall Risk Index',b:'18-30',v:52,ok:false,inv:true}] },
  // 6: Ruth Martinez — stable, COPD managed
  { ph:{mob:76,fr:22,slp:70,bath:82,act:64,str:78}, mn:{sent:72,well:68,comp:66,lat:2.2},
    cl:{bp:'128/82',hr:72,med:88,tv:2,cr:26},
    tx:'"Morning. Feeling alright, chest is clear today which is nice."',
    devs:[{m:'Mobility Score',b:'74-82',v:76,ok:true},{m:'Sleep Quality',b:'66-76',v:70,ok:true},{m:'Sentiment Score',b:'68-80',v:72,ok:true},{m:'Bathroom Routine',b:'78-88',v:82,ok:true},{m:'Fall Risk Index',b:'16-26',v:22,ok:true,inv:true}] },
  // 7: Frank Nguyen — stable, dementia early stage
  { ph:{mob:72,fr:26,slp:76,bath:80,act:60,str:70}, mn:{sent:66,well:62,comp:55,lat:2.6},
    cl:{bp:'130/84',hr:74,med:84,tv:1,cr:32},
    tx:'"Good morning. I think I slept okay. What day is it today?"',
    devs:[{m:'Mobility Score',b:'70-80',v:72,ok:true},{m:'Sleep Quality',b:'72-82',v:76,ok:true},{m:'Sentiment Score',b:'60-74',v:66,ok:true},{m:'Bathroom Routine',b:'76-86',v:80,ok:true},{m:'Fall Risk Index',b:'18-28',v:26,ok:true,inv:true}] },
];

// ── Scenario multipliers applied on top of per-resident baselines ────────
const SC={
  stable:{
    riskScore:18,riskLabel:'STABLE',riskCol:'#15803D',
    trend:'&rarr; Stable. All metrics within personal baseline.',action:'No action needed',actionCol:'var(--gsoft)',actionTxtCol:'var(--green)',
    signals:[{t:'Mobility Normal',c:'var(--green)',bc:'var(--gsoft)'},{t:'Sleep Quality Good',c:'var(--green)',bc:'var(--gsoft)'},{t:'Sentiment Positive',c:'var(--purple)',bc:'var(--psoft)'}],
    nlp:[['Positive Sentiment','t-green'],['Normal Complexity','t-blue'],['Latency Normal','t-blue'],['No Risk Keywords','t-green']],
    alerts:[{type:'ok',title:'All residents &mdash; normal status',desc:'No active alerts. All monitored signals within personal baseline ranges.',time:'All clear &middot; System monitoring continuously',act:'No action required',actC:'act-green'}],
    predMult:{fr:1.0,er:1.0},
    recs:['Maintain current activity and sleep schedule. All metrics are within the normal baseline.','Schedule a routine check-in within 12 days.','Continue monitoring medication adherence.'],
    scHint:'All signals within normal range',
  },
  declining:{
    riskScore:54,riskLabel:'WATCH',riskCol:'#B45309',
    trend:'&darr; Declining. Early warning signals detected.',action:'Review within 24 hours',actionCol:'var(--asoft)',actionTxtCol:'var(--amber)',
    signals:[{t:'Mobility Declining',c:'var(--amber)',bc:'var(--asoft)'},{t:'Sleep Disrupted',c:'var(--amber)',bc:'var(--asoft)'},{t:'Sentiment Negative',c:'var(--red)',bc:'var(--rsoft)'}],
    nlp:[['Neutral Negative','t-amber'],['Low Complexity','t-amber'],['Latency Elevated','t-red'],['Fatigue Keyword Detected','t-amber']],
    alerts:[
      {type:'watch',title:'Mobility Declining: Early Signals Detected',desc:'Mobility score has dropped below the personal baseline over 6 consecutive days. Stride length is shortened.',time:'Detected 08:42 AM &middot; Day 6 of decline',act:'Schedule Physical Assessment',actC:'act-amber'},
      {type:'watch',title:'Sleep Disruption: Irregular Pattern Flagged',desc:'Sleep quality has been below the personal baseline for 5 consecutive nights. Bathroom visit timing is irregular.',time:'Flagged 06:15 AM &middot; 5-night trend',act:'Review Sleep Protocol',actC:'act-amber'},
    ],
    predMult:{fr:3.5,er:4.5},
    recs:['Schedule a physical therapy assessment within 48 hours. Mobility has been declining for 6 consecutive days.','Review current medications for potential sedation side effects.','Increase morning check-in frequency to twice daily.','Notify the family contact of the watch status. Early intervention is still possible.'],
    scHint:'Early decline signals detected',
  },
  critical:{
    riskScore:86,riskLabel:'INTERVENE',riskCol:'#B91C1C',
    trend:'&uarr; Critical. Immediate action required.',action:'Dispatch care team now',actionCol:'var(--rsoft)',actionTxtCol:'var(--red)',
    signals:[{t:'Fall Risk Critical',c:'var(--red)',bc:'var(--rsoft)'},{t:'5 Signals Below Baseline',c:'var(--red)',bc:'var(--rsoft)'},{t:'Balance Instability Detected',c:'var(--red)',bc:'var(--rsoft)'}],
    nlp:[['Distressed','t-red'],['Very Low Complexity','t-red'],['Latency Critical','t-red'],['Balance Keyword Detected','t-red'],['Fall Risk Language','t-amber']],
    alerts:[
      {type:'critical',title:'Critical: Immediate Intervention Required',desc:'EDT risk score is 86 out of 100. Five signals are simultaneously below the personal baseline. The morning check-in flagged balance instability.',time:'NOW &middot; 09:14 AM &middot; Alert triggered automatically',act:'Dispatch Care Team Immediately',actC:'act-red'},
      {type:'critical',title:'Medication Non-Adherence: Blood Pressure Elevated',desc:'Medication adherence has been critically low over the past 7 days. Blood pressure is dangerously elevated. No check-in visit has occurred in 18 days.',time:'09:10 AM &middot; 7-day trend',act:'Contact Prescribing Physician',actC:'act-red'},
      {type:'watch',title:'Three Consecutive Nights Below 3 Hours of Sleep',desc:'IR sensor data shows restless movement throughout the night. Bathroom visits are occurring at irregular intervals.',time:'Yesterday 11:48 PM',act:'Pain Assessment Recommended',actC:'act-amber'},
    ],
    predMult:{fr:6.0,er:15.0},
    recs:['Urgent: A physical assessment is required today. The fall risk trajectory projects a critical event within 48 hours.','Contact the emergency contact and prescribing physician. Blood pressure is dangerously elevated.','Do not leave the resident unassisted. Assign one-to-one monitoring immediately.','Schedule a check-in consultation within 2 hours. The last visit was 18 days ago.'],
    scHint:'Immediate intervention required',
  },
};

const RESIDENTS=[
  {id:0,name:'George Mitchell',ini:'GM',unit:'214',age:78,cond:'Hypertension, T2 Diabetes',col:'#2563EB',sc:'stable'},
  {id:1,name:'Harold Brennan',ini:'HB',unit:'087',age:82,cond:'COPD, Mild Cognitive Imp.',col:'#B45309',sc:'watch'},
  {id:2,name:'Dorothy Santos',ini:'DS',unit:'133',age:71,cond:'Osteoporosis, Arthritis',col:'#15803D',sc:'stable'},
  {id:3,name:'Robert Kim',ini:'RK',unit:'156',age:85,cond:'Heart Failure, Diabetes',col:'#B91C1C',sc:'critical'},
  {id:4,name:'Eleanor Pham',ini:'EP',unit:'201',age:74,cond:'Hypertension, Anxiety',col:'#15803D',sc:'stable'},
  {id:5,name:'James Wilson',ini:'JW',unit:'062',age:79,cond:'Parkinsons, Insomnia',col:'#B45309',sc:'watch'},
  {id:6,name:'Ruth Martinez',ini:'RM',unit:'118',age:76,cond:'COPD, Depression',col:'#15803D',sc:'stable'},
  {id:7,name:'Frank Nguyen',ini:'FN',unit:'245',age:81,cond:'Dementia, Hypertension',col:'#15803D',sc:'stable'},
];

// Compute per-resident pred data from baseline + scenario multiplier
function getResidentPred(resIdx, scKey) {
  const prof = RESIDENT_PROFILES[resIdx];
  const mult = SC[scKey].predMult;
  const baseFR = prof.ph.fr;
  const baseER = Math.round(baseFR * 0.3);
  const frArr = Array.from({length:7},(_,i)=>Math.min(99,Math.round(baseFR*mult.fr + i*(scKey==='stable'?0:scKey==='declining'?4:6))));
  const erArr = Array.from({length:7},(_,i)=>Math.min(99,Math.round(baseER*mult.er + i*(scKey==='stable'?0:scKey==='declining'?4:7))));
  return {fr:frArr,er:erArr};
}

// Apply scenario degradation to resident baseline metrics
function getResidentMetrics(resIdx, scKey) {
  const prof = JSON.parse(JSON.stringify(RESIDENT_PROFILES[resIdx]));
  if(scKey==='stable') return prof;
  const deg = scKey==='declining' ? 0.72 : 0.35;
  const invDeg = scKey==='declining' ? 3.2 : 6.0;
  prof.ph.mob = Math.round(prof.ph.mob*deg);
  prof.ph.slp = Math.round(prof.ph.slp*deg);
  prof.ph.bath = Math.round(prof.ph.bath*deg);
  prof.ph.act = Math.round(prof.ph.act*deg);
  prof.ph.str = Math.round(prof.ph.str*deg);
  prof.ph.fr = Math.min(98,Math.round(prof.ph.fr*invDeg));
  prof.mn.sent = Math.round(prof.mn.sent*deg);
  prof.mn.well = Math.round(prof.mn.well*deg);
  prof.mn.comp = Math.round(prof.mn.comp*deg);
  prof.mn.lat = parseFloat((prof.mn.lat*(scKey==='declining'?1.9:3.8)).toFixed(1));
  prof.cl.med = Math.round(prof.cl.med*deg);
  prof.cl.tv = scKey==='critical'?0:Math.max(0,prof.cl.tv-1);
  prof.cl.cr = Math.min(98,Math.round(prof.cl.cr*invDeg*0.5));
  prof.devs = prof.devs.map(d=>({...d,v:d.inv?Math.min(98,Math.round(d.v*invDeg)):Math.round(d.v*deg),ok:false}));
  if(scKey==='declining'){prof.tx='"Morning... not great. Feeling heavy and did not sleep well last night."';}
  else{prof.tx='"I do not feel good... balance is off. Took a long time to get up this morning."';}
  return prof;
}

const RPM_FRAMES=[
  {r:'Bedroom',s:'IR-BED',t:'07:00 AM',sid:'IR-BED',what:'George is resting in his bedroom',why:'IR-BED sensor detects presence \u2014 event logged to cloud at 07:00 AM \u2014 data pipeline begins processing'},
  {r:'Bedroom',s:'IR-BED',t:'07:12 AM',sid:'IR-BED',what:'George wakes up and gets out of bed',why:'IR-BED registers movement change \u2014 wearable detects rising posture \u2014 morning activity sequence begins'},
  {r:'Corridor',s:'IR-HALL',t:'07:25 AM',sid:'IR-HALL',what:'George walks through the corridor toward the living room',why:'IR-HALL corridor sensor activates \u2014 movement pattern confirms walking gait \u2014 GAIT score computed'},
  {r:'Living room',s:'IR-LIVING',t:'07:35 AM',sid:'IR-LIVING',what:'George is in the living room near the sofa',why:'IR-LIVING sensor triggered \u2014 dwell time logged \u2014 activity level and location pattern recorded'},
  {r:'Dining area',s:'IR-DINING',t:'08:02 AM',sid:'IR-DINING',what:'George sits at the dining table for breakfast',why:'IR-DINING detects stationary presence \u2014 meal time pattern matches 30-day baseline \u2014 routine confirmed'},
  {r:'Kitchen',s:'IR-KITCHEN',t:'08:28 AM',sid:'IR-KITCHEN',what:'George is at the kitchen counter',why:'IR-KITCHEN triggered \u2014 activity sequence logged \u2014 mobility and independence score updated'},
  {r:'Bathroom',s:'IR-BATH',t:'09:05 AM',sid:'IR-BATH',what:'George enters the bathroom',why:'IR-BATH sensor activated \u2014 bathroom visit frequency and timing compared against personal baseline'},
];
const RPM_SENSORS=[
  {id:'IR-BED',x:.76,y:.17},{id:'IR-HALL',x:.52,y:.33},
  {id:'IR-LIVING',x:.40,y:.53},{id:'IR-DINING',x:.24,y:.35},
  {id:'IR-KITCHEN',x:.70,y:.45},{id:'IR-BATH',x:.44,y:.17},
];
let scenario='stable',selRes=0,charts={},rc=0,ra=true,rp=0,rpt=0,rlt=null;
const RDUR=3000;
const rcv=document.getElementById('sc'),rctx=rcv.getContext('2d'),rstg=document.getElementById('stg');
function rrz(){rcv.width=rstg.clientWidth;rcv.height=rstg.clientHeight;}
window.addEventListener('resize',rrz);
function init(){
  rrz();
  buildSidebar();buildFacGrid();updateDash();rup();
  setInterval(upClock,1000);upClock();
  requestAnimationFrame(rloop);
  upFrameCounter();
}
function rup(){
  const f=RPM_FRAMES[rc];
  document.getElementById('ovR').textContent=f.r;
  document.getElementById('ovS').textContent=f.s+' triggered';
  document.getElementById('ovT').textContent=f.t;
  document.getElementById('fcWhat').textContent=f.what;
  document.getElementById('fcWhy').textContent=f.why;
  document.getElementById('sLoc').textContent=f.r;
  document.getElementById('sSen').textContent=f.s+' active';
  document.getElementById('sAct').textContent=f.what;
  document.getElementById('sTm').textContent=f.t;
}
function rsh(i){document.querySelectorAll('.fimg').forEach((img,idx)=>img.classList.toggle('on',idx===i));}
function rg(i){rc=i;rp=0;rsh(i);rup();upFrameCounter();}
function rds(pt){
  const W=rcv.width,H=rcv.height;rctx.clearRect(0,0,W,H);
  const aid=RPM_FRAMES[rc].sid;
  RPM_SENSORS.forEach(s=>{
    const sx=s.x*W,sy=s.y*H,ia=s.id===aid;
    if(ia){
      const g=rctx.createRadialGradient(sx,sy,0,sx,sy,W*.17);
      g.addColorStop(0,'rgba(37,99,235,.20)');g.addColorStop(.5,'rgba(37,99,235,.07)');g.addColorStop(1,'rgba(37,99,235,0)');
      rctx.beginPath();rctx.arc(sx,sy,W*.17,0,Math.PI*2);rctx.fillStyle=g;rctx.fill();
      [0,.42].forEach(off=>{
        const pp=(pt+off)%1;
        rctx.beginPath();rctx.arc(sx,sy,8+pp*W*.09,0,Math.PI*2);
        rctx.strokeStyle=`rgba(37,99,235,${(1-pp)*.5})`;rctx.lineWidth=1.5;rctx.stroke();
      });
    }
    rctx.beginPath();rctx.arc(sx,sy,ia?7:5,0,Math.PI*2);
    rctx.fillStyle=ia?'#2563EB':'rgba(180,195,215,.8)';rctx.fill();
    rctx.strokeStyle=ia?'rgba(37,99,235,.7)':'rgba(160,180,200,.5)';rctx.lineWidth=1.5;rctx.stroke();
    rctx.save();rctx.font=`600 ${Math.max(9,Math.round(W*.011))}px monospace`;
    rctx.fillStyle=ia?'#2563EB':'rgba(100,120,150,.7)';rctx.textAlign='center';
    rctx.fillText(s.id,sx,sy-11);rctx.restore();
  });
}
function rloop(ts){
  if(!rlt)rlt=ts;const dt=ts-rlt;rlt=ts;rpt+=dt/1100;
  if(ra){rp=Math.min(100,rp+dt/RDUR*100);document.getElementById('pf').style.width=rp+'%';if(rp>=100){rp=0;rg((rc+1)%RPM_FRAMES.length);}}
  rds(rpt);requestAnimationFrame(rloop);
  upFrameCounter();
}

// ── Playback controls ────────────────────────────────────────────────────
function ctrlPlayPause(){
  ra=!ra;
  const btn=document.getElementById('btnPlay');
  btn.textContent=ra?'⏸ Pause':'▶ Play';
  btn.classList.toggle('primary',ra);
}
function ctrlPrev(){
  ra=false;
  document.getElementById('btnPlay').textContent='▶ Play';
  document.getElementById('btnPlay').classList.remove('primary');
  rg((rc-1+RPM_FRAMES.length)%RPM_FRAMES.length);
  upFrameCounter();
}
function ctrlNext(){
  ra=false;
  document.getElementById('btnPlay').textContent='▶ Play';
  document.getElementById('btnPlay').classList.remove('primary');
  rg((rc+1)%RPM_FRAMES.length);
  upFrameCounter();
}
function upFrameCounter(){
  const el=document.getElementById('frameCounter');
  if(el) el.textContent='Frame '+(rc+1)+' / '+RPM_FRAMES.length;
}
function upClock(){
  const n=new Date(),h=n.getHours()%12||12,m=String(n.getMinutes()).padStart(2,'0'),s=String(n.getSeconds()).padStart(2,'0'),ap=n.getHours()>=12?'PM':'AM',ts=h+':'+m+':'+s+' '+ap;
  ['clk'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=ts;});
}
function setScenario(s){
  scenario=s;
  document.querySelectorAll('.sc-btn').forEach(b=>b.classList.toggle('active',b.classList.contains('sc-'+s)));
  document.getElementById('scHint').textContent=SC[s].scHint;
  RESIDENTS[selRes].sc=s;
  buildFacGrid();updateDash();buildSidebar();
}
function buildSidebar(){
  const el=document.getElementById('sidebarList');
  el.innerHTML=RESIDENTS.map((r,i)=>{
    const st=i===selRes?scenario:r.sc;
    const bc=st==='stable'?'b-stable':st==='watch'?'b-watch':'b-critical';
    const pc=st==='stable'?'var(--green)':st==='watch'?'var(--amber)':'var(--red)';
    const sl=st==='stable'?'Stable':st==='watch'?'Watch':'Critical';
    return `<div class="res-card s-${st}${i===selRes?' active':''}" onclick="selResident(${i})">
      <div class="rc-av" style="background:${r.col}22;color:${r.col}">${r.ini}</div>
      <div class="rc-info"><div class="rc-name">${r.name}</div><div class="rc-unit">Unit ${r.unit}</div></div>
      <div class="rc-badge ${bc}">${sl}</div>
      <div class="rc-pulse" style="background:${pc}"></div>
    </div>`;
  }).join('');
}
function buildFacGrid(){
  let st=0,wt=0,cr=0;
  const el=document.getElementById('facGrid');
  el.innerHTML=RESIDENTS.map((r,i)=>{
    const s=i===selRes?scenario:r.sc;
    if(s==='stable')st++;else if(s==='watch')wt++;else cr++;
    const prof=RESIDENT_PROFILES[i];
    const risk=s==='stable'?Math.round(10+prof.ph.fr*0.8):s==='watch'?Math.round(40+prof.ph.fr*0.6):Math.round(72+prof.ph.fr*0.3);
    const col=s==='stable'?'var(--green)':s==='watch'?'var(--amber)':'var(--red)';
    const mob=s==='stable'?prof.ph.mob:s==='watch'?Math.round(prof.ph.mob*0.72):Math.round(prof.ph.mob*0.35);
    const fr=s==='stable'?prof.ph.fr:s==='watch'?Math.round(prof.ph.fr*3.2):Math.round(prof.ph.fr*6.0);
    return `<div class="fac-card f-${s}" onclick="selResident(${i});switchTab('profile',document.querySelectorAll('.tab-btn')[1])">
      <div class="fc-click-hint">click to view &rarr;</div>
      <div class="fc-name">${r.name}</div>
      <div class="fc-unit">Unit ${r.unit} &middot; Age ${r.age}</div>
      <div class="fc-metrics">
        <span class="fc-m" style="background:var(--bsoft);color:var(--blue)">MOB ${mob}</span>
        <span class="fc-m" style="background:var(--rsoft);color:var(--red)">FR ${Math.min(99,fr)}</span>
      </div>
      <div class="fc-risk" style="color:${col}">${Math.min(99,risk)}<span style="font-size:11px;font-weight:400;color:var(--txt3)">/100</span></div>
    </div>`;
  }).join('');
  // Inflated facility-scale numbers for presentation
  const STABLE_OFFSET=130, WATCH_OFFSET=3, CRIT_OFFSET=1;
  document.getElementById('cntStable').textContent=st+STABLE_OFFSET;
  document.getElementById('cntWatch').textContent=wt+WATCH_OFFSET;
  document.getElementById('cntCrit').textContent=cr+CRIT_OFFSET;
  document.getElementById('cntTotal').textContent=st+wt+cr+STABLE_OFFSET+WATCH_OFFSET+CRIT_OFFSET;
}
function selResident(i){
  selRes=i;
  document.querySelectorAll('.res-card').forEach((c,idx)=>c.classList.toggle('active',idx===i));
  const r=RESIDENTS[i];
  document.getElementById('drAvatar').textContent=r.ini;
  document.getElementById('drAvatar').style.background=r.col+'22';
  document.getElementById('drAvatar').style.color=r.col;
  document.getElementById('drName').textContent=r.name;
  document.getElementById('drUnit').textContent='Unit '+r.unit;
  updateDash();
  // Refresh activity log if it's the active tab
  const activeTab = document.querySelector('.tab-content.active');
  if (activeTab && activeTab.id === 'tab-actlog') {
    alRender();
  }
}
function animNum(el,target,dur,col){
  if(!el)return;
  const start=parseInt(el.textContent)||0,diff=target-start,t0=performance.now();
  function step(t){
    const p=Math.min(1,(t-t0)/dur),ease=1-Math.pow(1-p,3);
    el.textContent=Math.round(start+diff*ease);
    if(col)el.style.color=col;
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function updateDash(){
  const sc=SC[scenario],r=RESIDENTS[selRes];
  const metrics=getResidentMetrics(selRes,scenario);
  const pred=getResidentPred(selRes,scenario);
  const p=metrics.ph,mn=metrics.mn,cl=metrics.cl;

  document.getElementById('rhName').textContent=r.name;
  document.getElementById('rhMeta').textContent='Age '+r.age+' \u00b7 Unit '+r.unit+' \u00b7 '+r.cond;
  animNum(document.getElementById('rhScore'),sc.riskScore,800,sc.riskCol);
  document.getElementById('rhLabel').textContent=sc.riskLabel;
  document.getElementById('rhLabel').style.color=sc.riskCol;
  document.getElementById('rhTrend').innerHTML=sc.trend;
  document.getElementById('rhAction').textContent=sc.action;
  document.getElementById('rhAction').style.background=sc.actionCol;
  document.getElementById('rhAction').style.color=sc.actionTxtCol;
  const ring=document.getElementById('ringFill');
  ring.style.stroke=sc.riskCol;
  ring.style.strokeDashoffset=239-(sc.riskScore/100)*239;
  document.getElementById('rhSignals').innerHTML=sc.signals.map(s=>`<span class="rh-signal" style="color:${s.c};border-color:${s.c}44;background:${s.bc}">${s.t}</span>`).join('');

  // Physical KPIs
  document.getElementById('physKPIs').innerHTML=[
    {l:'Mobility',v:p.mob,inv:false},{l:'Fall risk',v:p.fr,inv:true},
    {l:'Sleep quality',v:p.slp,inv:false},{l:'Bathroom',v:p.bath,inv:false},
    {l:'Activity',v:p.act,inv:false},{l:'Stride score',v:p.str,inv:false}
  ].map(k=>{
    const bad=k.inv?k.v>60:k.v<55,warn=k.inv?k.v>35:k.v<72,col=bad?'var(--red)':warn?'var(--amber)':'var(--green)',sub=bad?(k.inv?'Elevated':'Declining'):warn?'Watch':'Normal';
    return `<div class="kpi-item"><div class="ki-lbl">${k.l}</div><div class="ki-val" style="color:${col}">${k.v}</div><div class="ki-sub" style="color:${col}">${sub}</div><div class="ki-bar"><div class="ki-fill" style="width:${k.inv?k.v:k.v}%;background:${col}"></div></div></div>`;
  }).join('');

  // Mental KPIs
  document.getElementById('mentalKPIs').innerHTML=[
    {l:'Sentiment',v:mn.sent},{l:'Wellness',v:mn.well},{l:'Complexity',v:mn.comp},{l:'Latency',v:mn.lat+'s',raw:mn.lat,isLat:true}
  ].map(k=>{
    const bad=k.isLat?k.raw>5:k.v<45,warn=k.isLat?k.raw>3:k.v<65,col=bad?'var(--red)':warn?'var(--amber)':'var(--purple)';
    return `<div class="kpi-item"><div class="ki-lbl">${k.l}</div><div class="ki-val" style="color:${col}">${k.v}</div><div class="ki-bar"><div class="ki-fill" style="width:${k.isLat?Math.min(100,k.raw/8*100):k.v}%;background:${col}"></div></div></div>`;
  }).join('');

  document.getElementById('txBox').textContent=metrics.tx;
  document.getElementById('txBox').style.borderLeftColor=scenario==='critical'?'var(--red)':scenario==='declining'?'var(--amber)':'var(--purple)';
  document.getElementById('nlpTags').innerHTML=sc.nlp.map(t=>`<span class="ntag ${t[1]}">${t[0]}</span>`).join('');

  // Clinical KPIs
  const bpCol=scenario==='stable'?'var(--blue)':scenario==='declining'?'var(--amber)':'var(--red)';
  document.getElementById('clinKPIs').innerHTML=[
    {l:'Blood pressure',v:cl.bp,c:bpCol},
    {l:'Heart rate',v:cl.hr+' bpm',c:cl.hr<80?'var(--blue)':'var(--amber)'},
    {l:'Med adherence',v:cl.med+'%',c:cl.med>85?'var(--green)':cl.med>65?'var(--amber)':'var(--red)'},
    {l:'Check-in visits',v:cl.tv,c:cl.tv>0?'var(--blue)':'var(--red)'},
    {l:'Chronic risk',v:cl.cr+'/100',c:scenario==='stable'?'var(--green)':scenario==='declining'?'var(--amber)':'var(--red)'},
    {l:'Data sync',v:'Live',c:'var(--green)'},
  ].map(k=>`<div class="kpi-item"><div class="ki-lbl">${k.l}</div><div class="ki-val" style="color:${k.c};font-size:15px">${k.v}</div></div>`).join('');

  // Deviation rows
  document.getElementById('devRows').innerHTML=metrics.devs.map(d=>{
    const col=d.ok?'var(--green)':d.v<40?'var(--red)':'var(--amber)',arr=d.ok?'&rarr;':d.inv?'&uarr;':'&darr;',arrCol=d.ok?'var(--txt3)':'var(--red)';
    return `<div class="dev-row"><div class="dev-metric">${d.m}</div><div class="dev-baseline">baseline: ${d.b}</div><div class="dev-arr" style="color:${arrCol}">${arr}</div><div class="dev-curr" style="color:${col}">${d.v}</div><div class="dev-bar-wrap"><div class="dev-bar" style="width:${Math.min(100,d.v)}%;background:${col}"></div></div></div>`;
  }).join('');

  // Predictive section (now in profile tab)
  const lastFR=pred.fr[6],lastER=pred.er[6];
  const frCol=lastFR>70?'var(--red)':lastFR>35?'var(--amber)':'var(--green)';
  const erCol=lastER>60?'var(--red)':lastER>25?'var(--amber)':'var(--green)';
  document.getElementById('tdFall').style.background=frCol;
  document.getElementById('tlFall').innerHTML=`Projected fall risk in 7 days: <strong style="color:${frCol}">${lastFR}/100</strong>`;
  document.getElementById('tdER').style.background=erCol;
  document.getElementById('tlER').innerHTML=`ER transfer probability in 7 days: <strong style="color:${erCol}">${lastER}%</strong>`;

  // Recommendations
  const isUrgent=scenario==='critical';
  document.getElementById('recs').innerHTML=sc.recs.map((rec,i)=>`<div class="rec-item${isUrgent&&i===0?' urgent':''}">${rec}</div>`).join('');

  // Alerts tab
  document.getElementById('alertsList').innerHTML=sc.alerts.map(a=>{
    const cls=a.type==='critical'?'ac-crit':a.type==='watch'?'ac-watch':'ac-ok',icon=a.type==='critical'?'&#128680;':a.type==='watch'?'&#9888;&#65039;':'&#9989;',tcol=a.type==='critical'?'var(--red)':a.type==='watch'?'var(--amber)':'var(--green)';
    return `<div class="alert-card ${cls}"><div class="ac-icon">${icon}</div><div class="ac-body"><div class="ac-title" style="color:${tcol}">${a.title}</div><div class="ac-desc">${a.desc}</div><div class="ac-time">${a.time}</div><button class="ac-action ${a.actC}">${a.act} &rarr;</button></div></div>`;
  }).join('');

  rebuildCharts(metrics,pred);
}
function clrChart(id){if(charts[id]){charts[id].destroy();delete charts[id];}}
function gen30(base,noise,dec){return Array.from({length:30},(_,i)=>Math.max(2,Math.min(99,Math.round(base+(dec?-i*0.9:0)+(Math.random()-.5)*noise))));}
function rebuildCharts(metrics,pred){
  if(!metrics){metrics=getResidentMetrics(selRes,scenario);}
  if(!pred){pred=getResidentPred(selRes,scenario);}
  const p=metrics.ph,mn=metrics.mn;
  const days=Array.from({length:30},(_,i)=>'D'+(i+1)),dec=scenario!=='stable';
  const gridCol='rgba(15,28,46,.06)',tickCol='#7A92AC',legendCol='#3D5470';
  const opts={responsive:true,maintainAspectRatio:false,animation:{duration:500},
    plugins:{legend:{display:true,position:'top',labels:{boxWidth:8,font:{size:10},color:legendCol}}},
    scales:{x:{ticks:{font:{size:9},color:tickCol,maxTicksLimit:8},grid:{color:gridCol}},
            y:{min:0,max:100,ticks:{font:{size:10},color:tickCol},grid:{color:gridCol}}}};

  clrChart('physChart');
  const pc=document.getElementById('physChart');
  if(pc)charts['physChart']=new Chart(pc,{type:'line',data:{labels:days,datasets:[
    {label:'Mobility',data:gen30(p.mob,6,dec),borderColor:'#2563EB',backgroundColor:'rgba(37,99,235,.08)',fill:true,tension:0.35,borderWidth:2,pointRadius:1},
    {label:'Fall risk',data:gen30(p.fr,5,false),borderColor:'#B91C1C',fill:false,borderDash:[4,3],tension:0.35,borderWidth:1.5,pointRadius:1},
    {label:'Sleep',data:gen30(p.slp,7,dec),borderColor:'#5B21B6',fill:false,borderDash:[2,2],tension:0.35,borderWidth:1.5,pointRadius:1}
  ]},options:opts});

  clrChart('sentChart');
  const sc2=document.getElementById('sentChart');
  if(sc2)charts['sentChart']=new Chart(sc2,{type:'line',data:{labels:days,datasets:[
    {label:'Sentiment',data:gen30(mn.sent,8,dec),borderColor:'#5B21B6',backgroundColor:'rgba(91,33,182,.08)',fill:true,tension:0.35,borderWidth:2,pointRadius:1}
  ]},options:{...opts,plugins:{legend:{display:false}}}});

  const pdays=['Today','D+1','D+2','D+3','D+4','D+5','D+7'];
  const popts={responsive:true,maintainAspectRatio:false,animation:{duration:500},
    plugins:{legend:{display:true,position:'top',labels:{boxWidth:8,font:{size:10},color:legendCol}}},
    scales:{x:{ticks:{font:{size:9},color:tickCol},grid:{color:gridCol}},
            y:{min:0,max:100,ticks:{font:{size:10},color:tickCol},grid:{color:gridCol}}}};

  clrChart('predFall');
  const pfc=document.getElementById('predFall');
  if(pfc)charts['predFall']=new Chart(pfc,{type:'line',data:{labels:pdays,datasets:[
    {label:'Fall risk',data:pred.fr,borderColor:'#B91C1C',backgroundColor:'rgba(185,28,28,.08)',fill:true,tension:0.3,borderWidth:2,pointRadius:3},
    {label:'Safe baseline',data:Array(7).fill(20),borderColor:'rgba(21,128,61,.4)',borderDash:[5,4],borderWidth:1,pointRadius:0,fill:false}
  ]},options:popts});

  clrChart('predER');
  const perc=document.getElementById('predER');
  if(perc)charts['predER']=new Chart(perc,{type:'line',data:{labels:pdays,datasets:[
    {label:'ER probability %',data:pred.er,borderColor:'#B45309',backgroundColor:'rgba(180,83,9,.08)',fill:true,tension:0.3,borderWidth:2,pointRadius:3}
  ]},options:popts});
}
function switchTab(name,btn){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
  if(btn)btn.classList.add('active');
  else document.querySelectorAll('.tab-btn')[['overview','profile','actlog','alerts'].indexOf(name)].classList.add('active');
  document.getElementById('tab-'+name).classList.add('active');
  if(name==='profile'||name==='predict')rebuildCharts();
}
let storyRunning=false,storyTimer=null,storyStep=0;
const STORY_STEPS=[
  {action:()=>{window.scrollTo({top:0,behavior:'smooth'});ra=true;},label:'Step 1: Showing RPM simulation...',dur:12000},
  {action:()=>{window.scrollTo({top:document.getElementById('dashboard').offsetTop-52,behavior:'smooth'});setScenario('stable');switchTab('overview',null);},label:'Step 2: Facility overview with all residents stable',dur:4000},
  {action:()=>{switchTab('profile',null);selResident(0);},label:'Step 3: George Mitchell resident profile',dur:5000},
  {action:()=>{setScenario('declining');switchTab('alerts',null);},label:'Step 4: Simulating decline with alerts firing',dur:5000},
  {action:()=>{setScenario('critical');switchTab('alerts',null);},label:'Step 5: Critical state requiring intervention',dur:5000},
  {action:()=>{switchTab('profile',null);},label:'Step 6: 7 day predictive trajectory',dur:5000},
  {action:()=>{setScenario('stable');switchTab('overview',null);window.scrollTo({top:0,behavior:'smooth'});},label:'Demo complete. Resetting to baseline.',dur:3000},
];
function openStoryOverlay(){document.getElementById('storyOverlay').classList.add('active');}
function closeStoryOverlay(){document.getElementById('storyOverlay').classList.remove('active');}
function startStory(){
  closeStoryOverlay();storyRunning=true;storyStep=0;
  document.getElementById('storyBtn').textContent='Stop Story';
  document.getElementById('storyBtn').classList.add('running');
  document.getElementById('storyStepLabel').classList.add('visible');
  runStoryStep();
}
function runStoryStep(){
  if(!storyRunning||storyStep>=STORY_STEPS.length){stopStory();return;}
  const step=STORY_STEPS[storyStep];step.action();
  document.getElementById('storyStepLabel').textContent=step.label;
  const totalDur=STORY_STEPS.reduce((a,s)=>a+s.dur,0),elapsed=STORY_STEPS.slice(0,storyStep).reduce((a,s)=>a+s.dur,0);
  document.getElementById('storyProgFill').style.width=((elapsed/totalDur)*100)+'%';
  storyTimer=setTimeout(()=>{storyStep++;runStoryStep();},step.dur);
}
function stopStory(){
  storyRunning=false;if(storyTimer)clearTimeout(storyTimer);
  document.getElementById('storyBtn').innerHTML='&#9654; Story Mode';
  document.getElementById('storyBtn').classList.remove('running');
  document.getElementById('storyStepLabel').classList.remove('visible');
  document.getElementById('storyProgFill').style.width='0%';
}
document.getElementById('storyBtn').onclick=()=>storyRunning?stopStory():openStoryOverlay();
init();

// ══════════════════════════════════════════════════════════════════════════
// ACTIVITY LOG TAB
// ══════════════════════════════════════════════════════════════════════════

// ── Data generation ───────────────────────────────────────────────────────
const AL_SENSORS = [
  { id:'IR-BED',    label:'IR-BED',     location:'Bedroom',    col:'rgba(37,99,235,.12)',  tcol:'#1B3A5C' },
  { id:'IR-HALL',   label:'IR-HALL',    location:'Corridor',   col:'rgba(180,83,9,.10)',   tcol:'#78350F' },
  { id:'IR-LIVING', label:'IR-LIVING',  location:'Living Room',col:'rgba(21,128,61,.10)',  tcol:'#14532D' },
  { id:'IR-DINING', label:'IR-DINING',  location:'Dining Area',col:'rgba(91,33,182,.10)',  tcol:'#3B1E7A' },
  { id:'IR-KITCHEN',label:'IR-KITCHEN', location:'Kitchen',    col:'rgba(185,28,28,.09)',  tcol:'#7F1D1D' },
  { id:'IR-BATH',   label:'IR-BATH',    location:'Bathroom',   col:'rgba(15,118,110,.10)', tcol:'#134E4A' },
];

const AL_EVENTS = {
  'IR-BED':    ['Resting in bed','Movement detected during sleep','Waking up from sleep','Getting into bed','Repositioning in bed','Napping detected'],
  'IR-HALL':   ['Walking toward living room','Moving from bedroom to bathroom','Corridor transit logged','Returning from kitchen','Walking toward dining area','Movement through corridor'],
  'IR-LIVING': ['Seated near sofa','Standing near TV area','Movement in living room','Settled in armchair','Getting up from seated position','Activity near window'],
  'IR-DINING': ['Seated at dining table','Breakfast activity detected','Lunch sitting time logged','Dinner routine confirmed','Getting up from dining chair','Stationary presence at table'],
  'IR-KITCHEN':['Activity at kitchen counter','Preparing food detected','Standing at sink','Opening refrigerator area','Kettle or appliance activity','Brief kitchen visit'],
  'IR-BATH':   ['Bathroom visit logged','Morning hygiene routine','Evening routine detected','Brief bathroom visit','Extended bathroom activity','Routine timing confirmed'],
};

function alRand(min, max) { return Math.round(min + Math.random() * (max - min)); }
function alClamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function alGenDayEvents(dateObj, isToday) {
  const events = [];
  const nowMs = Date.now();
  const dateStr = dateObj.toISOString().split('T')[0];

  // Schedule: [hour, minute, sensorId, dwellMinutes]
  const schedule = [
    [6,30,'IR-BED',25],[6,55,'IR-BATH',18],[7,13,'IR-HALL',1],
    [7,14,'IR-KITCHEN',14],[7,28,'IR-DINING',28],[7,56,'IR-HALL',1],
    [7,57,'IR-LIVING',42],[8,39,'IR-KITCHEN',8],[8,47,'IR-HALL',1],
    [8,48,'IR-LIVING',55],[9,43,'IR-BATH',9],[9,52,'IR-HALL',1],
    [9,53,'IR-LIVING',38],[10,31,'IR-KITCHEN',6],[10,37,'IR-HALL',1],
    [10,38,'IR-DINING',32],[11,10,'IR-HALL',1],[11,11,'IR-LIVING',60],
    [12,11,'IR-KITCHEN',11],[12,22,'IR-DINING',35],[12,57,'IR-HALL',1],
    [12,58,'IR-BED',72],[14,10,'IR-HALL',1],[14,11,'IR-BATH',7],
    [14,18,'IR-HALL',1],[14,19,'IR-LIVING',68],[15,27,'IR-KITCHEN',9],
    [15,36,'IR-HALL',1],[15,37,'IR-DINING',28],[16,05,'IR-HALL',1],
    [16,06,'IR-LIVING',82],[17,28,'IR-KITCHEN',14],[17,42,'IR-DINING',38],
    [18,20,'IR-HALL',1],[18,21,'IR-LIVING',65],[19,26,'IR-BATH',12],
    [19,38,'IR-HALL',1],[19,39,'IR-LIVING',48],[20,27,'IR-HALL',1],
    [20,28,'IR-BED',480],
  ];

  schedule.forEach(([h, m, sid, dwell]) => {
    const evDate = new Date(dateObj);
    evDate.setHours(h, m, 0, 0);
    if (isToday && evDate.getTime() > nowMs) return; // skip future for today

    const sensor = AL_SENSORS.find(s => s.id === sid);
    const eventList = AL_EVENTS[sid];
    const mob = alClamp(alRand(78, 92) + (sid === 'IR-BED' ? -4 : 0), 50, 99);
    const gait = sid === 'IR-HALL' ? alClamp(alRand(80, 94), 60, 99) : null;
    const fr = alClamp(alRand(10, 20), 5, 40);
    const ok = mob > 70 && fr < 30;

    events.push({
      dateStr,
      datetime: evDate,
      timeLabel: `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`,
      sensor,
      event: eventList[alRand(0, eventList.length - 1)],
      dwell,
      mob,
      gait,
      fr,
      ok,
    });
  });

  return events;
}

function alGenAllEvents() {
  const all = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Past 30 days
  for (let i = 30; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    alGenDayEvents(d, false).forEach(e => all.push(e));
  }
  // Today
  alGenDayEvents(today, true).forEach(e => all.push(e));
  return all;
}

// Per-resident event cache — keyed by resIdx
const AL_EVENT_CACHE = {};

// Resident-specific schedule modifiers (activity level, bathroom freq, sleep times)
const AL_RESIDENT_PROFILES = [
  // 0: George Mitchell — stable, regular routine
  { mobBase:85, frBase:12, bathFreq:1.0, sleepHour:20, wakeHour:6, actLevel:1.0 },
  // 1: Harold Brennan — watch, COPD, slower movement, more bathroom
  { mobBase:62, frBase:46, bathFreq:1.6, sleepHour:21, wakeHour:7, actLevel:0.7 },
  // 2: Dorothy Santos — stable, active, osteoporosis
  { mobBase:80, frBase:16, bathFreq:0.9, sleepHour:21, wakeHour:6, actLevel:1.1 },
  // 3: Robert Kim — critical, very limited movement, frequent bathroom
  { mobBase:30, frBase:82, bathFreq:2.2, sleepHour:19, wakeHour:8, actLevel:0.3 },
  // 4: Eleanor Pham — stable, hypertension, moderate activity
  { mobBase:82, frBase:15, bathFreq:1.0, sleepHour:21, wakeHour:6, actLevel:0.9 },
  // 5: James Wilson — watch, Parkinsons, shaky mornings, poor sleep
  { mobBase:59, frBase:50, bathFreq:1.8, sleepHour:22, wakeHour:8, actLevel:0.6 },
  // 6: Ruth Martinez — stable, COPD managed, moderate
  { mobBase:77, frBase:20, bathFreq:1.1, sleepHour:20, wakeHour:6, actLevel:0.85 },
  // 7: Frank Nguyen — stable, dementia, irregular patterns
  { mobBase:73, frBase:24, bathFreq:1.4, sleepHour:20, wakeHour:7, actLevel:0.75 },
];

function alGenAllEventsForResident(resIdx) {
  if (AL_EVENT_CACHE[resIdx]) return AL_EVENT_CACHE[resIdx];
  const rp = AL_RESIDENT_PROFILES[resIdx];
  const all = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 30; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    alGenDayEventsForResident(d, false, rp).forEach(e => all.push(e));
  }
  alGenDayEventsForResident(today, true, rp).forEach(e => all.push(e));
  AL_EVENT_CACHE[resIdx] = all;
  return all;
}

function alGenDayEventsForResident(dateObj, isToday, rp) {
  const events = [];
  const nowMs = Date.now();
  const dateStr = dateObj.toISOString().split('T')[0];
  const wh = rp.wakeHour;

  // Build schedule adjusted to this resident profile
  const schedule = [
    [wh,30,'IR-BED',Math.round(25*rp.actLevel)],
    [wh,55,'IR-BATH',Math.round(18*rp.bathFreq)],
    [wh+1,13,'IR-HALL',1],
    [wh+1,14,'IR-KITCHEN',Math.round(14*rp.actLevel)],
    [wh+1,28,'IR-DINING',28],
    [wh+1,56,'IR-HALL',1],
    [wh+1,57,'IR-LIVING',Math.round(42*rp.actLevel)],
    [wh+2,39,'IR-KITCHEN',Math.round(8*rp.actLevel)],
    [wh+2,47,'IR-HALL',1],
    [wh+2,48,'IR-LIVING',Math.round(55*rp.actLevel)],
    [wh+3,43,'IR-BATH',Math.round(9*rp.bathFreq)],
    [wh+3,52,'IR-HALL',1],
    [wh+3,53,'IR-LIVING',Math.round(38*rp.actLevel)],
    [wh+4,31,'IR-KITCHEN',Math.round(6*rp.actLevel)],
    [wh+4,37,'IR-HALL',1],
    [wh+4,38,'IR-DINING',32],
    [wh+5,10,'IR-HALL',1],
    [wh+5,11,'IR-LIVING',60],
    [wh+6,11,'IR-KITCHEN',Math.round(11*rp.actLevel)],
    [wh+6,22,'IR-DINING',35],
    [wh+6,57,'IR-HALL',1],
    [wh+6,58,'IR-BED',72],
    [wh+8,10,'IR-HALL',1],
    [wh+8,11,'IR-BATH',Math.round(7*rp.bathFreq)],
    [wh+8,18,'IR-HALL',1],
    [wh+8,19,'IR-LIVING',Math.round(68*rp.actLevel)],
    [wh+9,27,'IR-KITCHEN',Math.round(9*rp.actLevel)],
    [wh+9,36,'IR-HALL',1],
    [wh+9,37,'IR-DINING',28],
    [wh+10,5,'IR-HALL',1],
    [wh+10,6,'IR-LIVING',Math.round(82*rp.actLevel)],
    [wh+11,28,'IR-KITCHEN',Math.round(14*rp.actLevel)],
    [wh+11,42,'IR-DINING',38],
    [wh+12,20,'IR-HALL',1],
    [wh+12,21,'IR-LIVING',Math.round(65*rp.actLevel)],
    [wh+13,26,'IR-BATH',Math.round(12*rp.bathFreq)],
    [wh+13,38,'IR-HALL',1],
    [wh+13,39,'IR-LIVING',Math.round(48*rp.actLevel)],
    [rp.sleepHour,27,'IR-HALL',1],
    [rp.sleepHour,28,'IR-BED',480],
  ];

  schedule.forEach(([h, m, sid, dwell]) => {
    const clampedH = Math.min(23, Math.max(0, h));
    const evDate = new Date(dateObj);
    evDate.setHours(clampedH, m, 0, 0);
    if (isToday && evDate.getTime() > nowMs) return;

    const sensor = AL_SENSORS.find(s => s.id === sid);
    const eventList = AL_EVENTS[sid];
    const mob = alClamp(alRand(Math.max(20, rp.mobBase - 8), Math.min(99, rp.mobBase + 6)) + (sid === 'IR-BED' ? -4 : 0), 20, 99);
    const gait = sid === 'IR-HALL' ? alClamp(alRand(Math.max(30, rp.mobBase - 10), Math.min(99, rp.mobBase + 4)), 30, 99) : null;
    const fr = alClamp(alRand(Math.max(5, rp.frBase - 6), Math.min(99, rp.frBase + 8)), 5, 99);
    const ok = mob > 55 && fr < 50;

    events.push({
      dateStr,
      datetime: evDate,
      timeLabel: `${String(clampedH).padStart(2,'0')}:${String(m).padStart(2,'0')}`,
      sensor,
      event: eventList[alRand(0, eventList.length - 1)],
      dwell: Math.max(1, dwell),
      mob, gait, fr, ok,
    });
  });
  return events;
}


// ── State ─────────────────────────────────────────────────────────────────
let alRange = '30d';
let alActiveFilters = new Set(AL_SENSORS.map(s => s.id));
let alCustomFrom = null;
let alCustomTo = null;

// ── Filter events by current range and active sensors ─────────────────────
function alGetFiltered() {
  const today = new Date(); today.setHours(23,59,59,999);
  let from, to;

  if (alRange === 'today') {
    from = new Date(); from.setHours(0,0,0,0);
    to = today;
  } else if (alRange === '30d') {
    from = new Date(); from.setDate(from.getDate() - 30); from.setHours(0,0,0,0);
    to = today;
  } else if (alRange === 'custom' && alCustomFrom && alCustomTo) {
    from = new Date(alCustomFrom + 'T00:00:00');
    to   = new Date(alCustomTo   + 'T23:59:59');
  } else {
    from = new Date(); from.setDate(from.getDate() - 30); from.setHours(0,0,0,0);
    to = today;
  }

  const resEvents = alGenAllEventsForResident(typeof selRes !== 'undefined' ? selRes : 0);
  return resEvents.filter(e =>
    e.datetime >= from && e.datetime <= to &&
    alActiveFilters.has(e.sensor.id)
  );
}

// ── Build sensor filter chips ─────────────────────────────────────────────
function alBuildFilters() {
  const el = document.getElementById('alSensorFilters');
  if (!el) return;
  el.innerHTML = AL_SENSORS.map(s => `
    <button class="al-sensor-chip active" id="alChip${s.id}"
      onclick="alToggleFilter('${s.id}')"
      style="background:${s.col};border-color:${s.tcol}33;color:${s.tcol}">
      ${s.label}
    </button>`).join('');
}

function alToggleFilter(id) {
  if (alActiveFilters.has(id)) {
    if (alActiveFilters.size === 1) return; // keep at least one
    alActiveFilters.delete(id);
  } else {
    alActiveFilters.add(id);
  }
  const chip = document.getElementById('alChip' + id);
  const sensor = AL_SENSORS.find(s => s.id === id);
  if (chip) {
    if (alActiveFilters.has(id)) {
      chip.classList.add('active');
      chip.style.background = sensor.col;
      chip.style.color = sensor.tcol;
    } else {
      chip.classList.remove('active');
      chip.style.background = 'var(--bg2)';
      chip.style.color = 'var(--txt3)';
    }
  }
  alRender();
}

// ── Summary strip ─────────────────────────────────────────────────────────
function alBuildSummary(events) {
  const el = document.getElementById('alSummaryStrip');
  if (!el) return;
  const total = events.length;
  const avgMob = total ? Math.round(events.reduce((a,e)=>a+e.mob,0)/total) : 0;
  const avgFR  = total ? Math.round(events.reduce((a,e)=>a+e.fr,0)/total)  : 0;
  const gaitEvents = events.filter(e=>e.gait!==null);
  const avgGait = gaitEvents.length ? Math.round(gaitEvents.reduce((a,e)=>a+e.gait,0)/gaitEvents.length) : 'N/A';
  const okCount = events.filter(e=>e.ok).length;
  const pctOk = total ? Math.round(okCount/total*100) : 0;
  const sensorCounts = {};
  AL_SENSORS.forEach(s=>sensorCounts[s.id]=0);
  events.forEach(e=>sensorCounts[e.sensor.id]=(sensorCounts[e.sensor.id]||0)+1);
  const topSensor = Object.entries(sensorCounts).sort((a,b)=>b[1]-a[1])[0];
  const topSensorLabel = topSensor ? AL_SENSORS.find(s=>s.id===topSensor[0])?.location : 'N/A';
  const uniqueDays = new Set(events.map(e=>e.dateStr)).size;

  el.innerHTML = [
    {label:'Total Events',    val:total.toLocaleString(),    sub:'sensor triggers logged'},
    {label:'Avg Mobility',    val:avgMob+'/100',             sub:'across all events'},
    {label:'Avg Fall Risk',   val:avgFR+'/100',              sub:'lower is better'},
    {label:'Avg GAIT Score',  val:typeof avgGait==='number'?avgGait+'/100':avgGait, sub:'corridor events only'},
    {label:'Normal Events',   val:pctOk+'%',                 sub:'within safe range'},
    {label:'Most Active Zone',val:topSensorLabel,            sub:`across ${uniqueDays} day${uniqueDays!==1?'s':''}`},
  ].map(c=>`
    <div class="al-sum-card">
      <div class="al-sum-label">${c.label}</div>
      <div class="al-sum-val">${c.val}</div>
      <div class="al-sum-sub">${c.sub}</div>
    </div>`).join('');
}

// ── Log table ─────────────────────────────────────────────────────────────
function alBuildLog(events) {
  const el = document.getElementById('alLogBody');
  if (!el) return;

  let lastDate = null;
  let html = '';
  const todayStr = new Date().toISOString().split('T')[0];

  events.forEach(e => {
    const dateLabel = e.datetime.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
    if (e.dateStr !== lastDate) {
      const isToday = e.dateStr === todayStr;
      html += `<div class="al-day-sep${isToday?' today-sep':''}">${isToday ? 'Today &mdash; ' : ''}${dateLabel}</div>`;
      lastDate = e.dateStr;
    }

    const s = e.sensor;
    const statusCol = e.ok ? '#15803D' : e.fr > 30 ? '#B91C1C' : '#B45309';
    const rowClass = e.dateStr === todayStr ? 'al-log-row today-row' : 'al-log-row';
    const gaitStr = e.gait !== null ? e.gait : '&mdash;';
    const dwellStr = e.dwell >= 60 ? `${Math.floor(e.dwell/60)}h ${e.dwell%60}m` : `${e.dwell}m`;

    html += `<div class="${rowClass}">
      <span class="al-cell-time">${e.timeLabel}</span>
      <span class="al-cell-sensor" style="background:${s.col};color:${s.tcol}">${s.label}</span>
      <span class="al-cell-loc">${s.location}</span>
      <span class="al-cell-event">${e.event}</span>
      <span class="al-cell-num" style="color:${e.mob<70?'#B91C1C':e.mob<80?'#B45309':'#15803D'}">${e.mob}</span>
      <span class="al-cell-num" style="color:var(--txt3)">${gaitStr}</span>
      <span class="al-cell-dur">${dwellStr}</span>
      <span class="al-cell-status"><div class="al-status-dot" style="background:${statusCol}" title="${e.ok?'Normal':'Watch'}"></div></span>
    </div>`;
  });

  el.innerHTML = html || '<div style="padding:32px;text-align:center;color:var(--txt3);font-size:13px">No events match the selected filters.</div>';

  const footer = document.getElementById('alLogFooter');
  if (footer) {
    footer.innerHTML = `
      <span class="al-footer-count">${events.length.toLocaleString()} events shown</span>
      <div class="al-footer-legend">
        <div class="al-legend-item"><div class="al-legend-dot" style="background:#15803D"></div>Normal</div>
        <div class="al-legend-item"><div class="al-legend-dot" style="background:#B45309"></div>Watch</div>
        <div class="al-legend-item"><div class="al-legend-dot" style="background:#B91C1C"></div>Alert</div>
      </div>`;
  }
}

// ── Range controls ────────────────────────────────────────────────────────
function alSetRange(range) {
  alRange = range;
  ['30d','today','custom'].forEach(r => {
    const btn = document.getElementById('rangeBtn' + (r==='30d'?'30':r.charAt(0).toUpperCase()+r.slice(1)));
    if (btn) btn.classList.toggle('active', r === range);
  });
  const customEl = document.getElementById('alCustomRange');
  if (customEl) customEl.classList.toggle('hidden', range !== 'custom');
  if (range !== 'custom') alRender();
}

function alApplyCustom() {
  const from = document.getElementById('alDateFrom')?.value;
  const to   = document.getElementById('alDateTo')?.value;
  if (!from || !to) return;
  alCustomFrom = from;
  alCustomTo   = to;
  alRender();
}

// ── Set default date inputs ────────────────────────────────────────────────
function alInitDateInputs() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const past30 = new Date(); past30.setDate(past30.getDate()-30);
  const past30Str = past30.toISOString().split('T')[0];
  const fromEl = document.getElementById('alDateFrom');
  const toEl   = document.getElementById('alDateTo');
  if (fromEl) { fromEl.value = past30Str; fromEl.max = todayStr; }
  if (toEl)   { toEl.value   = todayStr;  toEl.max   = todayStr; }
}

// ── Main render ───────────────────────────────────────────────────────────
function alRender() {
  const events = alGetFiltered();
  alBuildSummary(events);
  alBuildLog(events);
}

// ── Init on tab open ──────────────────────────────────────────────────────
function alInit() {
  alBuildFilters();
  alInitDateInputs();
  alRender();
}

// Hook into the existing switchTab function
const _origSwitchTab = switchTab;
switchTab = function(name, btn) {
  _origSwitchTab(name, btn);
  if (name === 'actlog') {
    if (!document.getElementById('alSensorFilters').innerHTML) {
      alInit();
    } else {
      alBuildFilters();
      alRender();
    }
  }
};
