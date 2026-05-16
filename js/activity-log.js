// ── Utilities ─────────────────────────────────────────────────────────────
function rand(min,max){return Math.round(min+(Math.random()*(max-min)));}
function randF(min,max,dec=1){return parseFloat((min+Math.random()*(max-min)).toFixed(dec));}
function clamp(v,min,max){return Math.max(min,Math.min(max,v));}

// ── Seed data generation ──────────────────────────────────────────────────
// Baselines for George Mitchell (stable)
const BASE = {mob:84, fr:14, slp:6.4, sent:80, bath:4, act:72, str:92, med:94};

// Generate 30 days of historical data
function genHistory(days=30){
  const rows=[];
  const now=new Date();
  for(let i=days;i>=1;i--){
    const d=new Date(now);d.setDate(d.getDate()-i);
    const dayLabel=d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
    const isWeekend=[0,6].includes(d.getDay());
    // Slight weekend variation
    const wkMult=isWeekend?1.04:1;
    rows.push({
      date:dayLabel,
      iso:d.toISOString().split('T')[0],
      mob: clamp(rand(BASE.mob-8,BASE.mob+6)*wkMult,50,99),
      fr:  clamp(rand(BASE.fr-4,BASE.fr+6),5,40),
      slp: clamp(randF(BASE.slp-.8,BASE.slp+.9),4.0,9.0),
      sent:clamp(rand(BASE.sent-10,BASE.sent+8),45,99),
      bath:clamp(rand(BASE.bath-1,BASE.bath+2),2,8),
      med: clamp(rand(BASE.med-6,BASE.med+4),70,100),
      str: clamp(rand(BASE.str-8,BASE.str+4),60,99),
      hours: genHours(d),
    });
  }
  return rows;
}

const SENSORS=['IR-BED','IR-HALL','IR-LIVING','IR-DINING','IR-KITCHEN','IR-BATH'];
const SENSOR_DESCS={
  'IR-BED':['Resting in bed','Movement detected in bedroom','Getting out of bed'],
  'IR-HALL':['Walking through corridor','Moving between rooms','Corridor transit detected'],
  'IR-LIVING':['Seated near sofa','Standing in living room','Movement near TV area'],
  'IR-DINING':['Seated at dining table','Breakfast activity','Meal time detected'],
  'IR-KITCHEN':['Activity at kitchen counter','Preparing food','Kitchen movement logged'],
  'IR-BATH':['Bathroom visit','Morning hygiene routine','Bathroom activity logged'],
};

function genHours(date){
  const events=[];
  const isToday=date.toDateString()===new Date().toDateString();
  const nowH=new Date().getHours();
  // Morning routine
  [[6,30,'IR-BED',72],[7,0,'IR-BED',68],[7,15,'IR-HALL',82],[7,30,'IR-BATH',85],
   [7,55,'IR-KITCHEN',78],[8,20,'IR-DINING',74],[9,10,'IR-LIVING',80],
   [10,30,'IR-KITCHEN',72],[11,0,'IR-HALL',76],[12,0,'IR-DINING',70],
   [13,30,'IR-LIVING',82],[14,45,'IR-BATH',88],[15,30,'IR-HALL',74],
   [16,0,'IR-LIVING',80],[17,30,'IR-DINING',72],[18,45,'IR-LIVING',78],
   [19,30,'IR-BATH',84],[20,0,'IR-LIVING',76],[21,30,'IR-BED',88],
  ].forEach(([h,m,sensor,mob])=>{
    const isFuture=isToday&&(h>nowH||(h===nowH&&m>new Date().getMinutes()));
    const descs=SENSOR_DESCS[sensor];
    events.push({
      time:`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`,
      hour:h,
      sensor,
      desc:descs[rand(0,descs.length-1)],
      mob:clamp(mob+rand(-5,5),50,99),
      gait:clamp(rand(78,94),50,99),
      future:isFuture,
    });
  });
  return events;
}

// Generate 7 day forecast with confidence bands
function genForecast(){
  const rows=[];
  const now=new Date();
  for(let i=1;i<=7;i++){
    const d=new Date(now);d.setDate(d.getDate()+i);
    const dayLabel=d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
    // Confidence widens further out
    const spread=i*1.8;
    rows.push({
      date:dayLabel,
      iso:d.toISOString().split('T')[0],
      predicted:true,
      mob:     {v:clamp(rand(BASE.mob-3,BASE.mob+3),50,99), lo:clamp(BASE.mob-spread-3,50,99), hi:clamp(BASE.mob+spread+2,50,99)},
      fr:      {v:clamp(rand(BASE.fr-2,BASE.fr+4),5,40),    lo:clamp(BASE.fr-spread*.5,5,40),   hi:clamp(BASE.fr+spread,5,60)},
      slp:     {v:clamp(randF(BASE.slp-.4,BASE.slp+.4),4,9),lo:clamp(BASE.slp-spread*.2,4,9),  hi:clamp(BASE.slp+spread*.2,4,9)},
      sent:    {v:clamp(rand(BASE.sent-6,BASE.sent+6),45,99),lo:clamp(BASE.sent-spread*1.5,45,99),hi:clamp(BASE.sent+spread,45,99)},
      bath:    {v:clamp(rand(BASE.bath-1,BASE.bath+1),2,8),  lo:clamp(BASE.bath-1,2,8),          hi:clamp(BASE.bath+2,2,8)},
      med:     {v:clamp(rand(BASE.med-3,BASE.med+2),70,100), lo:clamp(BASE.med-spread*.5,70,100),hi:100},
      confidence: Math.round(95-(i*5)),
    });
  }
  return rows;
}

const history=genHistory(30);
const forecast=genForecast();
const todayData=genHours(new Date());

// ── State ─────────────────────────────────────────────────────────────────
let activeRange='past30';
let activeDayIdx=null;
let charts={};

// ── Clock ─────────────────────────────────────────────────────────────────
function upClock(){
  const n=new Date(),h=n.getHours()%12||12,m=String(n.getMinutes()).padStart(2,'0'),
    s=String(n.getSeconds()).padStart(2,'0'),ap=n.getHours()>=12?'PM':'AM';
  const el=document.getElementById('clk');
  if(el)el.textContent=`${h}:${m}:${s} ${ap}`;
}
setInterval(upClock,1000);upClock();

// ── Range toggle ──────────────────────────────────────────────────────────
function setRange(range){
  activeRange=range;
  document.querySelectorAll('.al-range-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.al-range-btn').forEach(b=>{
    if(b.getAttribute('onclick')===`setRange('${range}')`)b.classList.add('active');
  });
  ['past30','today','forecast'].forEach(r=>{
    document.getElementById('sec'+r.charAt(0).toUpperCase()+r.slice(1))
      .classList.toggle('hidden',r!==range);
  });
  const labels={'past30':'30 day trend','today':'Today hourly view','forecast':'7 day forecast'};
  document.getElementById('chartRangeLabel').textContent=labels[range];
  rebuildCharts();
}

// ── Day list builder ──────────────────────────────────────────────────────
function statusColor(mob,fr){
  if(fr>35||mob<60) return {bg:'rgba(185,28,28,.09)',col:'#7F1D1D',label:'Watch'};
  if(fr>25||mob<72) return {bg:'rgba(180,83,9,.09)',col:'#78350F',label:'Watch'};
  return {bg:'rgba(21,128,61,.09)',col:'#14532D',label:'Stable'};
}

function buildDayList(){
  const el=document.getElementById('dayList');
  el.innerHTML='';
  [...history].reverse().forEach((day,idx)=>{
    const sc=statusColor(day.mob,day.fr);
    const div=document.createElement('div');
    div.className='al-day-row'+(activeDayIdx===idx?' active':'');
    div.innerHTML=`
      <div class="al-day-summary" onclick="toggleDay(${idx},this)">
        <div class="al-day-date">${day.date}</div>
        <div class="al-day-badges">
          <span class="al-day-badge" style="background:rgba(37,99,235,.08);color:#1B3A5C">MOB ${day.mob}</span>
          <span class="al-day-badge" style="background:rgba(185,28,28,.08);color:#7F1D1D">FR ${day.fr}</span>
          <span class="al-day-badge" style="background:rgba(21,128,61,.08);color:#14532D">SLP ${day.slp}h</span>
          <span class="al-day-badge" style="background:rgba(91,33,182,.08);color:#5B21B6">SNT ${day.sent}</span>
        </div>
        <div class="al-day-score" style="color:${sc.col}">${sc.label}</div>
        <div class="al-day-chevron">&#9658;</div>
      </div>
      <div class="al-day-detail">
        <div style="font-size:10px;font-weight:600;color:var(--txt3);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px">Hourly sensor events</div>
        ${day.hours.map(h=>`
          <div class="al-hour-row">
            <span class="al-hour-time">${h.time}</span>
            <span class="al-hour-sensor">${h.sensor}</span>
            <span class="al-hour-desc">${h.desc}</span>
            <span class="al-hour-val">MOB ${h.mob}</span>
          </div>`).join('')}
      </div>`;
    el.appendChild(div);
  });
}

function toggleDay(idx,el){
  const row=el.parentElement;
  const wasActive=row.classList.contains('active');
  document.querySelectorAll('.al-day-row').forEach(r=>r.classList.remove('active'));
  if(!wasActive){row.classList.add('active');activeDayIdx=idx;}
  else activeDayIdx=null;
}

function buildHourlyList(){
  const el=document.getElementById('hourlyList');
  const nowH=new Date().getHours(),nowM=new Date().getMinutes();
  el.innerHTML=todayData.map(ev=>{
    const [hStr,mStr]=ev.time.split(':');
    const h=parseInt(hStr),m=parseInt(mStr);
    const isPast=h<nowH||(h===nowH&&m<=nowM);
    const isCurrent=h===nowH;
    const dotCol=isPast?'#15803D':'#C8D5E5';
    return `<div class="al-hourly-event${isCurrent?' current':!isPast?' future':''}">
      <div class="al-he-time">${ev.time}</div>
      <div class="al-he-dot" style="background:${dotCol}"></div>
      <div class="al-he-body">
        <div class="al-he-title">${ev.desc}</div>
        <div class="al-he-detail">${ev.sensor} sensor activated${ev.future?' (scheduled pattern)':''}</div>
        <div class="al-he-metrics">
          <span class="al-he-metric" style="background:rgba(37,99,235,.08);color:#1B3A5C">MOB ${ev.mob}</span>
          <span class="al-he-metric" style="background:rgba(21,128,61,.08);color:#14532D">GAIT ${ev.gait}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

function buildForecastList(){
  const el=document.getElementById('forecastList');
  el.innerHTML=forecast.map((day,idx)=>{
    const frVal=day.fr.v, mobVal=day.mob.v;
    const sc=statusColor(mobVal,frVal);
    const conf=day.confidence;
    const confCol=conf>80?'#15803D':conf>65?'#B45309':'#B91C1C';
    return `<div class="al-day-row predicted">
      <div class="al-day-summary" onclick="toggleForecastDay(${idx},this)">
        <div class="al-day-date">${day.date}</div>
        <div class="al-day-badges">
          <span class="al-day-badge" style="background:rgba(37,99,235,.08);color:#1B3A5C">MOB ~${mobVal}</span>
          <span class="al-day-badge" style="background:rgba(185,28,28,.08);color:#7F1D1D">FR ~${frVal}</span>
          <span class="al-day-badge" style="background:rgba(21,128,61,.08);color:#14532D">SLP ~${day.slp.v}h</span>
          <span class="al-day-badge" style="background:rgba(91,33,182,.08);color:#5B21B6">SNT ~${day.sent.v}</span>
          <span class="al-day-badge" style="background:${confCol}18;color:${confCol}">Conf ${conf}%</span>
        </div>
        <div class="al-day-score" style="color:${sc.col}">${sc.label}</div>
        <div class="al-day-chevron">&#9658;</div>
      </div>
      <div class="al-day-detail">
        <div style="font-size:10px;font-weight:600;color:var(--txt3);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px">Projected metric ranges (${conf}% confidence)</div>
        ${[
          {label:'Mobility Score',    v:mobVal,    lo:Math.round(day.mob.lo), hi:Math.round(day.mob.hi)},
          {label:'Fall Risk Index',   v:frVal,     lo:Math.round(day.fr.lo),  hi:Math.round(day.fr.hi)},
          {label:'Sleep Duration',    v:day.slp.v, lo:day.slp.lo.toFixed(1),  hi:day.slp.hi.toFixed(1), unit:'h'},
          {label:'Sentiment Score',   v:day.sent.v,lo:Math.round(day.sent.lo),hi:Math.round(day.sent.hi)},
          {label:'Medication Adherence',v:day.med.v,lo:Math.round(day.med.lo),hi:Math.round(day.med.hi), unit:'%'},
        ].map(r=>`
          <div class="al-hour-row">
            <span class="al-hour-time" style="min-width:130px">${r.label}</span>
            <span class="al-hour-desc">Range: ${r.lo}${r.unit||''} to ${r.hi}${r.unit||''}</span>
            <span class="al-hour-val">${r.v}${r.unit||''}</span>
          </div>`).join('')}
      </div>
    </div>`;
  }).join('');
}

function toggleForecastDay(idx,el){
  const row=el.parentElement;
  const wasActive=row.classList.contains('active');
  document.querySelectorAll('#forecastList .al-day-row').forEach(r=>r.classList.remove('active'));
  if(!wasActive) row.classList.add('active');
}

// ── Charts ────────────────────────────────────────────────────────────────
function clrChart(id){if(charts[id]){charts[id].destroy();delete charts[id];}}
const GRID='rgba(15,28,46,.06)', TICK='#7A92AC', LEG='#3D5470';
const baseOpts=(ymin=0,ymax=100)=>({
  responsive:true,maintainAspectRatio:false,animation:{duration:400},
  plugins:{legend:{display:true,position:'top',labels:{boxWidth:8,font:{size:10},color:LEG}}},
  scales:{
    x:{ticks:{font:{size:9},color:TICK,maxTicksLimit:8},grid:{color:GRID}},
    y:{min:ymin,max:ymax,ticks:{font:{size:10},color:TICK},grid:{color:GRID}},
  }
});

function getLabels(){
  if(activeRange==='past30') return history.map(d=>d.date.split(',')[0]);
  if(activeRange==='today') return todayData.map(e=>e.time);
  return forecast.map(d=>d.date.split(',')[0]);
}
function getVals(key,subkey='v'){
  if(activeRange==='past30') return history.map(d=>d[key]);
  if(activeRange==='today') return todayData.map(e=>e[key]||BASE[key]);
  return forecast.map(d=>typeof d[key]==='object'?d[key][subkey]:d[key]);
}
function getConfBand(key,which){
  return forecast.map(d=>typeof d[key]==='object'?d[key][which]:null);
}

function rebuildCharts(){
  const labels=getLabels();

  // Mobility + Fall Risk
  clrChart('chartMobility');
  const mc=document.getElementById('chartMobility');
  const mobData=getVals('mob');
  const frData=getVals('fr');
  const datasets=[
    {label:'Mobility',data:mobData,borderColor:'#2563EB',backgroundColor:'rgba(37,99,235,.08)',fill:true,tension:.35,borderWidth:2,pointRadius:2},
    {label:'Fall Risk',data:frData,borderColor:'#B91C1C',fill:false,borderDash:[4,3],tension:.35,borderWidth:1.5,pointRadius:2},
  ];
  if(activeRange==='forecast'){
    datasets.push(
      {label:'Mobility high',data:getConfBand('mob','hi'),borderColor:'rgba(37,99,235,.2)',fill:'+1',tension:.35,borderWidth:0,pointRadius:0},
      {label:'Mobility low', data:getConfBand('mob','lo'),borderColor:'rgba(37,99,235,.2)',backgroundColor:'rgba(37,99,235,.06)',fill:false,tension:.35,borderWidth:0,pointRadius:0},
    );
  }
  if(mc)charts['chartMobility']=new Chart(mc,{type:'line',data:{labels,datasets},options:baseOpts(0,100)});

  // Sleep
  clrChart('chartSleep');
  const sc=document.getElementById('chartSleep');
  const slpData=getVals('slp');
  const slpDatasets=[
    {label:'Sleep (hrs)',data:slpData,borderColor:'#5B21B6',backgroundColor:'rgba(91,33,182,.08)',fill:true,tension:.35,borderWidth:2,pointRadius:2},
    {label:'6hr baseline',data:Array(labels.length).fill(6),borderColor:'rgba(180,83,9,.4)',borderDash:[5,4],borderWidth:1,pointRadius:0,fill:false},
  ];
  if(activeRange==='forecast'){
    slpDatasets.push(
      {label:'High',data:getConfBand('slp','hi'),borderColor:'rgba(91,33,182,.15)',fill:'+1',tension:.35,borderWidth:0,pointRadius:0},
      {label:'Low', data:getConfBand('slp','lo'),borderColor:'rgba(91,33,182,.15)',backgroundColor:'rgba(91,33,182,.05)',fill:false,tension:.35,borderWidth:0,pointRadius:0},
    );
  }
  if(sc)charts['chartSleep']=new Chart(sc,{type:'line',data:{labels,datasets:slpDatasets},options:baseOpts(0,10)});

  // Sentiment
  clrChart('chartSentiment');
  const stc=document.getElementById('chartSentiment');
  const sentData=getVals('sent');
  const sentDatasets=[
    {label:'Sentiment',data:sentData,borderColor:'#15803D',backgroundColor:'rgba(21,128,61,.08)',fill:true,tension:.35,borderWidth:2,pointRadius:2},
  ];
  if(activeRange==='forecast'){
    sentDatasets.push(
      {label:'High',data:getConfBand('sent','hi'),borderColor:'rgba(21,128,61,.15)',fill:'+1',tension:.35,borderWidth:0,pointRadius:0},
      {label:'Low', data:getConfBand('sent','lo'),borderColor:'rgba(21,128,61,.15)',backgroundColor:'rgba(21,128,61,.05)',fill:false,tension:.35,borderWidth:0,pointRadius:0},
    );
  }
  if(stc)charts['chartSentiment']=new Chart(stc,{type:'line',data:{labels,datasets:sentDatasets},options:baseOpts(0,100)});

  // Bathroom
  clrChart('chartBathroom');
  const bc=document.getElementById('chartBathroom');
  const bathData=getVals('bath');
  if(bc)charts['chartBathroom']=new Chart(bc,{type:'bar',data:{labels,datasets:[
    {label:'Daily visits',data:bathData,backgroundColor:'rgba(37,99,235,.15)',borderColor:'#2563EB',borderWidth:1,borderRadius:3},
    {label:'Baseline max (6)',data:Array(labels.length).fill(6),type:'line',borderColor:'rgba(180,83,9,.4)',borderDash:[5,4],borderWidth:1,pointRadius:0,fill:false},
  ]},options:baseOpts(0,10)});

  buildHeatmap(labels);
}

// ── Heatmap ───────────────────────────────────────────────────────────────
function buildHeatmap(labels){
  const el=document.getElementById('heatmap');
  const sensors=['IR-BED','IR-HALL','IR-LIVING','IR-DINING','IR-KITCHEN','IR-BATH'];
  const sensorLabels={'IR-BED':'Bedroom','IR-HALL':'Corridor','IR-LIVING':'Living Rm','IR-DINING':'Dining','IR-KITCHEN':'Kitchen','IR-BATH':'Bathroom'};
  // Show last 7 days in heatmap regardless of range
  const days7=history.slice(-7);
  const dayHeaders=days7.map(d=>d.date.split(',')[0]);

  let html='<div class="al-hm-label"></div>';
  dayHeaders.forEach(d=>html+=`<div class="al-hm-col-label">${d}</div>`);

  sensors.forEach(s=>{
    html+=`<div class="al-hm-label">${sensorLabels[s]}</div>`;
    days7.forEach(day=>{
      const count=day.hours.filter(h=>h.sensor===s).length;
      const intensity=Math.min(1,count/4);
      const alpha=0.1+intensity*0.75;
      html+=`<div class="al-hm-cell" style="background:rgba(37,99,235,${alpha.toFixed(2)})" data-tip="${sensorLabels[s]}: ${count} events on ${day.date}"></div>`;
    });
  });

  el.innerHTML=html;
}

// ── Init ──────────────────────────────────────────────────────────────────
buildDayList();
buildHourlyList();
buildForecastList();
rebuildCharts();

// Add nav link to main dashboard
const navLink=document.querySelector('.sn-link[href="activity-log.html"]');

