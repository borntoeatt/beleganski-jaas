import { playSound } from './audio.js';

// ====== ANIMATED FAVICON ======
(function() {
  const fc = document.createElement('canvas');
  fc.width = fc.height = 32;
  const fx = fc.getContext('2d');
  let fa = 0;
  const fl = document.createElement('link');
  fl.rel = 'icon'; document.head.appendChild(fl);
  setInterval(() => {
    fx.clearRect(0,0,32,32);
    fx.save(); fx.translate(16,16); fx.rotate(Math.sin(fa)*0.35);
    fx.font = '24px serif'; fx.textAlign = 'center'; fx.textBaseline = 'middle';
    fx.fillText('🥃',0,0); fx.restore(); fa += 0.04;
    fl.href = fc.toDataURL();
  }, 60);
})();

// ====== VISITOR COUNTER (GoatCounter) ======
fetch('https://dporkov.goatcounter.com/counter//.json')
  .then(r => r.json())
  .then(d => { document.getElementById('visit-count').textContent = Number(d.count.replace(/,/g,'')).toLocaleString(); })
  .catch(() => { document.getElementById('visit-count').textContent = '...'; });

// ====== LIVE STATUS CYCLING ======
const STATUSES = [
  '🟢 Available (in jacuzzi)',
  '🔴 In standup (jacuzzi)',
  '🟡 Reviewing PR (jacuzzi)',
  '🔴 On sick leave (jacuzzi)',
  '🟡 In a meeting (jacuzzi)',
  '🔴 Deploying (from jacuzzi)',
  '🟢 Lunch break (jacuzzi)',
  '🔴 OOO until never',
];
const README_STATUSES = [
  '🟢 IN JACUZZI (always)',
  '🔴 IN STANDUP (jacuzzi)',
  '🟡 REVIEWING PR (jacuzzi)',
  '🔴 SICK LEAVE (jacuzzi)',
  '🟡 IN MEETING (jacuzzi)',
];
let si = 0;
setInterval(() => {
  si = (si+1) % STATUSES.length;
  const badge = document.getElementById('live-status');
  const readme = document.getElementById('readme-status');
  badge.style.opacity = '0';
  setTimeout(() => { badge.textContent = STATUSES[si]; badge.style.opacity = '1'; }, 300);
  readme.style.opacity = '0';
  setTimeout(() => { readme.textContent = README_STATUSES[si % README_STATUSES.length]; readme.style.opacity = '1'; }, 300);
}, 4000);
document.getElementById('live-status').style.transition = 'opacity 0.3s';
document.getElementById('readme-status').style.transition = 'opacity 0.3s';

// ====== CURSOR ======
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  spawnTrail(e.clientX, e.clientY);
});
function spawnTrail(x, y) {
  const e = ['🥃','✨','💦','🔥','🫧','✦'];
  const el = document.createElement('div');
  el.className = 'cursor-trail';
  el.textContent = e[Math.floor(Math.random()*e.length)];
  el.style.left = (x+Math.random()*20-10)+'px';
  el.style.top  = (y+Math.random()*20-10)+'px';
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 520);
}

// ====== FORK ERROR ======
let forkT;
export function showForkError() {
  const t = document.getElementById('fork-toast');
  t.classList.add('show'); clearTimeout(forkT);
  forkT = setTimeout(()=>t.classList.remove('show'), 3200);
}

// ====== HR REPORT ======
export function reportToHR(){
  document.getElementById('hr-modal').style.display='flex';
  document.getElementById('hr-resolution').style.display='none';
  document.getElementById('close-hr').style.display='none';
  document.getElementById('hr-status').textContent='⏳ Processing...';
  setTimeout(()=>{ document.getElementById('hr-status').textContent='🔍 Investigating...'; },800);
  setTimeout(()=>{ document.getElementById('hr-status').textContent='📍 Locating employee...'; },1800);
  setTimeout(()=>{ document.getElementById('hr-status').textContent='🛁 Employee located (jacuzzi)'; },2800);
  setTimeout(()=>{
    document.getElementById('hr-status').textContent='✓ Auto-closed';
    document.getElementById('hr-resolution').style.display='block';
    document.getElementById('close-hr').style.display='block';
  },4000);
}
export function closeHR(){ document.getElementById('hr-modal').style.display='none'; }

// ====== EASTER EGG ======
let easterClicks=0, easterTimer, easterFeedbackTimer;
export function easterClick(){
  easterClicks++; clearTimeout(easterTimer);
  easterTimer=setTimeout(()=>{ easterClicks=0; },2500);
  const el=document.getElementById('easter-trigger');
  el.classList.add('clicked'); clearTimeout(easterFeedbackTimer);
  easterFeedbackTimer=setTimeout(()=>el.classList.remove('clicked'),150);
  if(easterClicks>=10){ easterClicks=0; document.getElementById('easter-modal').style.display='flex'; }
}
export function closeEaster(){ document.getElementById('easter-modal').style.display='none'; }

// ====== SECRET RAKIA MODE ======
let keyBuffer='';
document.addEventListener('keydown', e=>{
  keyBuffer=(keyBuffer+e.key).slice(-5).toLowerCase();
  if(keyBuffer==='rakia') triggerRakiaMode();
});
function triggerRakiaMode(){
  const overlay=document.getElementById('rakia-mode');
  const msg=document.getElementById('rakia-msg');
  overlay.style.display='block'; msg.style.display='block';
  for(let i=0;i<40;i++){
    setTimeout(()=>{
      const el=document.createElement('div'); el.className='rakia-rain';
      el.textContent='🥃'; el.style.left=Math.random()*100+'vw';
      const dur=1.5+Math.random()*2; el.style.animationDuration=dur+'s';
      el.style.fontSize=(20+Math.random()*30)+'px';
      overlay.appendChild(el); setTimeout(()=>el.remove(),(dur+0.1)*1000);
    }, i*80);
  }
  playSound('splash');
  setTimeout(()=>{ overlay.style.display='none'; msg.style.display='none'; },4000);
}
