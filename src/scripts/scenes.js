import { playSound } from './audio.js';
import { startConfetti, stopConfetti, clearConfetti } from './confetti.js';

// ====== TERMINAL ======
const CMD = 'npm install alexander-beleganski@latest';
const LINES = [
  { text: '', delay: 0 },
  { text: '⠋ Resolving dependencies...', cls: 'term-info', delay: 350 },
  { text: '⠙ Fetching human package...', cls: 'term-info', delay: 850 },
  { text: '⠹ Locating jacuzzi...', cls: 'term-info', delay: 1350 },
  { text: '⠸ Loading rakia (∞ bottles)...', cls: 'term-info', delay: 1850 },
  { text: '⠼ Checking work hours... none found', cls: 'term-info', delay: 2350 },
  { text: 'PROGRESS', delay: 2850 },
  { text: '✓ alexander-beleganski@4.2.0-jacuzzi installed', cls: 'term-success', delay: 5400 },
  { text: '✓ rakia@∞ resolved', cls: 'term-success', delay: 5700 },
  { text: '✓ jacuzzi@1.0.0 connected', cls: 'term-success', delay: 6000 },
  { text: '⚠ warn: 0 commits found — see jacuzzi', cls: 'term-warning', delay: 6400 },
  { text: '⚠ warn: package may be in hot tub during business hours', cls: 'term-warning', delay: 6800 },
  { text: 'READY', delay: 7300 },
];

function startTerminal() {
  const typedCmd=document.getElementById('typed-cmd');
  const termCursor=document.getElementById('term-cursor');
  const output=document.getElementById('term-output');
  const progWrap=document.getElementById('progress-wrap');
  const progFill=document.getElementById('progress-fill');
  const progText=document.getElementById('progress-text');
  const deployBtn=document.getElementById('deploy-btn');
  const scene1el=document.getElementById('scene1');
  function scrollTerm(){ deployBtn.scrollIntoView({block:'nearest'}); }

  let i=0;
  const typer=setInterval(()=>{
    typedCmd.textContent=CMD.slice(0,++i);
    if(Math.random()<0.4) playSound('type');
    if(i>=CMD.length){ clearInterval(typer); termCursor.style.display='none'; runLines(); }
  },42);

  function runLines(){
    LINES.forEach(line=>{
      if(line.text===''){
        setTimeout(()=>{ const el=document.createElement('span'); el.className='term-line'; el.innerHTML='&nbsp;'; output.appendChild(el); scrollTerm(); },line.delay);
      } else if(line.text==='PROGRESS'){
        setTimeout(()=>{ progWrap.style.display='block'; scrollTerm(); animateBar(); },line.delay);
      } else if(line.text==='READY'){
        setTimeout(()=>deployBtn.classList.add('ready'),line.delay);
      } else {
        setTimeout(()=>{ const el=document.createElement('span'); el.className='term-line '+(line.cls||''); el.textContent=line.text; output.appendChild(el); scrollTerm(); },line.delay);
      }
    });
  }

  function animateBar(){
    let pct=0;
    const iv=setInterval(()=>{
      pct=Math.min(pct+1.8,100);
      progFill.style.width=pct+'%';
      const filled=Math.floor(pct/5);
      progText.textContent='🥃'.repeat(filled)+'░'.repeat(20-filled)+'  '+Math.round(pct)+'%';
      if(pct>=100) clearInterval(iv);
    },32);
  }
}
setTimeout(startTerminal, 700);

// ====== TRANSITION ======
let revealed=false;
export function triggerReveal(){
  if(revealed) return; revealed=true;
  playSound('splash');
  const flood=document.getElementById('flood');
  flood.classList.add('flooding');
  setTimeout(()=>{
    document.getElementById('scene1').style.opacity='0';
    document.getElementById('scene1').style.pointerEvents='none';
    document.getElementById('scene2').style.display='flex';
    setTimeout(()=>{
      flood.style.transition='clip-path 0.5s ease';
      flood.style.clipPath='inset(0 0 100% 0)';
      setTimeout(()=>{ flood.style.clipPath=''; flood.classList.remove('flooding'); },550);
    },200);
    setupScene2();
  },700);
}

export function resetToScene1(){
  revealed=false;
  document.getElementById('scene2').style.display='none';
  document.getElementById('scene1').style.opacity='1';
  document.getElementById('scene1').style.pointerEvents='auto';
  ['big-title','counter-text','achievement','back-btn','hr-btn'].forEach(id=>{
    const el=document.getElementById(id);
    el.style.animation='none'; el.offsetHeight; el.style.animation='';
  });
  document.querySelector('.stamp').style.animation='none';
  document.querySelector('.stamp').offsetHeight;
  document.querySelector('.stamp').style.animation='';
  document.querySelector('.deploy-success-bar').style.animation='none';
  document.querySelector('.deploy-success-bar').offsetHeight;
  document.querySelector('.deploy-success-bar').style.animation='';
  document.getElementById('bubbles-container').innerHTML='';
  document.getElementById('steam-container').innerHTML='';
  stopConfetti();
  clearConfetti();
}

// ====== SCENE 2 ======
function setupScene2(){
  const n=Math.floor(Math.random()*(312-47+1))+47;
  document.getElementById('counter-text').textContent=
    `> deployed to jacuzzi ${n} times this sprint  •  uptime: ∞  •  rakia consumed: NaN (overflow)`;
  spawnBubbles(); spawnSteam();
  setTimeout(startConfetti,800); setTimeout(stopConfetti,4500);
  setTimeout(()=>{ setInterval(()=>{ if(Math.random()<0.15) playSound('bubble'); },800); },1000);
}

function spawnBubbles(){
  const c=document.getElementById('bubbles-container');
  for(let i=0;i<32;i++){
    const b=document.createElement('div'); b.className='bubble';
    const sz=6+Math.random()*22;
    b.style.cssText=`width:${sz}px;height:${sz}px;left:${5+Math.random()*90}vw;bottom:${Math.random()*42}vh;animation-duration:${3+Math.random()*6}s;animation-delay:${Math.random()*5}s;--drift:${(Math.random()-0.5)*40}px`;
    c.appendChild(b);
  }
}
function spawnSteam(){
  const c=document.getElementById('steam-container');
  for(let i=0;i<12;i++){
    const s=document.createElement('div'); s.className='steam';
    const sz=25+Math.random()*35;
    s.style.cssText=`width:${sz}px;height:${sz}px;left:${15+Math.random()*70}vw;bottom:38vh;animation-duration:${2+Math.random()*3}s;animation-delay:${Math.random()*4}s`;
    c.appendChild(s);
  }
}
