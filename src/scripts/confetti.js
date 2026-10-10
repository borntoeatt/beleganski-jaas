// ====== CONFETTI ======
const canvas=document.getElementById('confetti');
const ctx=canvas.getContext('2d');
let confettiRunning=false, particles=[];
function resizeCanvas(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
window.addEventListener('resize',resizeCanvas); resizeCanvas();
const COLORS=['#c8850a','#ffd700','#ff4500','#3fb950','#58a6ff','#ffffff','#ffa500'];

export function startConfetti(){
  confettiRunning=true; particles=[];
  for(let i=0;i<250;i++){
    particles.push({
      x:Math.random()*canvas.width,y:-20-Math.random()*400,
      vx:(Math.random()-0.5)*7,vy:1.5+Math.random()*5,
      size:6+Math.random()*12,color:COLORS[Math.floor(Math.random()*COLORS.length)],
      rot:Math.random()*360,rotV:(Math.random()-0.5)*9,
      shape:Math.random()>0.5?'rect':'circle'
    });
  }
  animateConfetti();
}
function animateConfetti(){
  if(!confettiRunning&&particles.length===0) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.rot+=p.rotV;p.vy+=0.06;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);
    ctx.fillStyle=p.color;
    if(p.shape==='rect') ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2);
    else{ctx.beginPath();ctx.arc(0,0,p.size/2,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  });
  particles=particles.filter(p=>p.y<canvas.height+40);
  if(particles.length>0||confettiRunning) requestAnimationFrame(animateConfetti);
  else ctx.clearRect(0,0,canvas.width,canvas.height);
}
export function stopConfetti(){ confettiRunning=false; }
export function clearConfetti(){ ctx.clearRect(0,0,canvas.width,canvas.height); }
