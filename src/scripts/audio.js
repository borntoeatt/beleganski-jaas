// ====== AUDIO ======
export function playSound(type) {
  try {
    const ac = new (window.AudioContext||window.webkitAudioContext)();
    if (type === 'splash') {
      const sz = Math.floor(ac.sampleRate*0.5);
      const buf = ac.createBuffer(1,sz,ac.sampleRate);
      const d = buf.getChannelData(0);
      for(let i=0;i<sz;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/sz,1.4)*0.55;
      const src=ac.createBufferSource(); src.buffer=buf;
      const flt=ac.createBiquadFilter(); flt.type='bandpass'; flt.frequency.value=550; flt.Q.value=0.5;
      const gain=ac.createGain(); gain.gain.setValueAtTime(1,ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.5);
      src.connect(flt); flt.connect(gain); gain.connect(ac.destination); src.start();
    } else if (type === 'type') {
      const osc=ac.createOscillator(); const gain=ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.frequency.value=600+Math.random()*300;
      gain.gain.setValueAtTime(0.04,ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.04);
      osc.start(); osc.stop(ac.currentTime+0.04);
    } else if (type === 'bubble') {
      const osc=ac.createOscillator(); const gain=ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type='sine'; osc.frequency.setValueAtTime(800+Math.random()*400,ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200,ac.currentTime+0.15);
      gain.gain.setValueAtTime(0.08,ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.15);
      osc.start(); osc.stop(ac.currentTime+0.15);
    }
  } catch(e){}
}
