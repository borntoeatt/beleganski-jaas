import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../config';
import { playSound } from './audio.js';

// ====== SUPABASE: accounts, league, guestbook ======
// Email links that fail (expired, already used) redirect back with #error=...&error_code=...
// Read it before the Supabase client starts processing the URL.
const authLinkError = (() => {
  const p = new URLSearchParams(location.hash.slice(1));
  return p.get('error') ? { code: p.get('error_code') || p.get('error'), description: p.get('error_description') || '' } : null;
})();

// Static demo mode when src/config.ts has no Supabase settings.
const sb = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;
let me = null; // { id, username }

const DRINK_META = {
  rakia:{label:'Rakia',color:'#ffd700'}, beer:{label:'Beer',color:'#e3b341'}, wine:{label:'Wine',color:'#ff7b72'},
  mastika:{label:'Mastika',color:'#3fb950'}, whisky:{label:'Whisky',color:'#c77dff'}, water:{label:'Water',color:'#58a6ff'},
  other:{label:'Other',color:'#8b949e'},
};
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function setMsg(id, text, ok){ const el=document.getElementById(id); el.textContent=text||''; el.className='form-msg '+(ok?'ok':'err'); }
function timeAgo(ts){
  const s=Math.max(1,Math.floor((Date.now()-new Date(ts))/1000));
  for (const [n,u] of [[86400,'d'],[3600,'h'],[60,'m']]) if (s>=n) return Math.floor(s/n)+u+' ago';
  return s+'s ago';
}

// ---- auth ----
// modes: signin | register | forgot (send reset link) | resend (confirmation email) | reset (set new password)
const AUTH_MODES = {
  signin:   { fields:['email','password'],             submit:'Sign in' },
  register: { fields:['username','email','password'],  submit:'Create account' },
  forgot:   { fields:['email'], submit:'Send reset link',
              title:'Reset your password', hint:'We will email you a link to set a new password.' },
  resend:   { fields:['email'], submit:'Resend confirmation email',
              title:'Resend confirmation email', hint:'Use the email you registered with.' },
  reset:    { fields:['password'], submit:'Save new password',
              title:'Set a new password', hint:'At least 8 characters.' },
};
const redirectUrl = () => location.origin + location.pathname;
let authMode='signin';

export function openAuth(mode){
  if(!sb) return;
  const m=AUTH_MODES[mode], f=document.getElementById('auth-form');
  authMode=mode;
  document.getElementById('auth-modal').classList.add('show');
  document.querySelector('.auth-tabs').classList.toggle('hidden', !!m.title);
  document.getElementById('tab-signin').classList.toggle('active', mode==='signin');
  document.getElementById('tab-register').classList.toggle('active', mode==='register');
  const title=document.getElementById('auth-title');
  title.classList.toggle('hidden', !m.title);
  title.innerHTML = m.title ? `${esc(m.title)}<small>${esc(m.hint)}</small>` : '';
  for (const name of ['username','email','password']) {
    const on=m.fields.includes(name);
    document.getElementById(name+'-field').classList.toggle('hidden', !on);
    f[name].required=on;
  }
  f.password.autocomplete = (mode==='register'||mode==='reset') ? 'new-password' : 'current-password';
  document.getElementById('password-label').textContent = mode==='reset' ? 'New password' : 'Password';
  document.getElementById('auth-submit').textContent = m.submit;
  document.getElementById('auth-links-signin').classList.toggle('hidden', mode!=='signin');
  document.getElementById('auth-links-back').classList.toggle('hidden', mode==='signin'||mode==='register'||mode==='reset');
  document.getElementById('auth-resend-btn').classList.add('hidden');
  setMsg('auth-msg','');
}
export function closeAuth(){ document.getElementById('auth-modal').classList.remove('show'); }
export async function signOut(){ if(sb) await sb.auth.signOut(); }

// Offer a one-click resend after registering or when sign-in says the email isn't confirmed
function offerResend(){ document.getElementById('auth-resend-btn').classList.remove('hidden'); }
export async function resendConfirmation(){
  const email=document.getElementById('auth-form').email.value.trim();
  if(!email){ openAuth('resend'); return; }
  const btn=document.getElementById('auth-resend-btn'); btn.disabled=true;
  try {
    const { error } = await sb.auth.resend({ type:'signup', email, options:{ emailRedirectTo: redirectUrl() } });
    if(error) throw error;
    setMsg('auth-msg', `✓ Confirmation email sent to ${email}. Check your inbox and spam folder.`, true);
  } catch(err){ setMsg('auth-msg', '✗ '+(err.message||'Could not resend the email')); }
  finally { btn.disabled=false; }
}

document.getElementById('auth-form').addEventListener('submit', async e=>{
  e.preventDefault();
  const f=e.target, btn=document.getElementById('auth-submit');
  const email=f.email.value.trim(), password=f.password.value;
  btn.disabled=true; setMsg('auth-msg','');
  try {
    if(authMode==='register'){
      const username=f.username.value.trim().toLowerCase();
      const { data: taken, error: checkErr } = await sb.from('profiles').select('id').eq('username', username).maybeSingle();
      if(checkErr) throw new Error('Registration is not available right now. Try again later.');
      if(taken) throw new Error('Username already taken');
      const { data, error } = await sb.auth.signUp({ email, password,
        options:{ data:{ username }, emailRedirectTo: redirectUrl() } });
      if(error) throw error;
      if(!data.session){
        setMsg('auth-msg','✓ Account created. Check your email to confirm, then sign in.', true);
        offerResend(); return;
      }
    } else if(authMode==='signin'){
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if(error){
        if(error.code==='email_not_confirmed' || /not confirmed/i.test(error.message)){
          setMsg('auth-msg','✗ Your email is not confirmed yet. Check your inbox or resend the email.');
          offerResend(); return;
        }
        throw error;
      }
    } else if(authMode==='forgot'){
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl() });
      if(error) throw error;
      // Same message whether or not the account exists, so the form can't be used to probe emails
      setMsg('auth-msg', `✓ If an account exists for ${email}, a reset link is on its way.`, true); return;
    } else if(authMode==='resend'){
      const { error } = await sb.auth.resend({ type:'signup', email, options:{ emailRedirectTo: redirectUrl() } });
      if(error) throw error;
      setMsg('auth-msg', `✓ If ${email} is waiting for confirmation, a new email is on its way.`, true); return;
    } else if(authMode==='reset'){
      const { error } = await sb.auth.updateUser({ password });
      if(error) throw error;
      f.reset(); setMsg('auth-msg', '✓ Password updated. You are signed in.', true);
      setTimeout(closeAuth, 1500); return;
    }
    f.reset(); closeAuth();
  } catch(err){
    setMsg('auth-msg', '✗ '+(err.message||'Something went wrong'));
  } finally { btn.disabled=false; }
});

async function onSession(session){
  me=null;
  if(session){
    const { data } = await sb.from('profiles').select('id,username').eq('id', session.user.id).maybeSingle();
    me = data || { id: session.user.id, username: session.user.email };
  }
  document.getElementById('signin-btn').classList.toggle('hidden', !!me);
  document.getElementById('signout-btn').classList.toggle('hidden', !me);
  const chip=document.getElementById('user-chip');
  chip.classList.toggle('hidden', !me); chip.textContent = me ? '@'+me.username : '';
  document.getElementById('locker').classList.toggle('hidden', !me);
  document.getElementById('locker-me').textContent = me ? 'playing as @'+me.username : '';
  document.getElementById('gb-form').classList.toggle('hidden', !me);
  document.getElementById('gb-signin').classList.toggle('hidden', !!me);
  loadAll();
}

// ---- data: league, scorers, possession, head-to-head ----
async function loadLeague(){
  const [lt, ps] = await Promise.all([
    sb.from('league_table').select('*').order('drinks',{ascending:false}),
    sb.from('player_stats').select('*').order('drinks',{ascending:false}).limit(10),
  ]);
  if(lt.error||ps.error) throw (lt.error||ps.error);
  const tbs=lt.data, players=ps.data.filter(p=>p.drinks>0||p.tickets>0);

  const sel=document.getElementById('tb-select'), cur=sel.value;
  sel.innerHTML='<option value="">— regular work day —</option>'+
    tbs.map(t=>`<option value="${t.id}">${esc(t.emoji)} ${esc(t.name)}</option>`).join('');
  sel.value=cur;

  if(!tbs.length && !players.length) return; // nothing logged yet: keep the demo table
  document.getElementById('league-badge').textContent='● LIVE';
  document.getElementById('league-badge').classList.add('live');
  document.getElementById('league-table').innerHTML =
    '<tr><th>#</th><th>Team building</th><th>Days</th><th>🥃 Drinks</th><th>Per day</th><th>Players</th></tr>'+
    (tbs.length ? tbs.map((t,i)=>`<tr><td class="pos">${i+1}</td><td>${esc(t.emoji)} ${esc(t.name)}</td><td>${t.days}</td><td>${t.drinks}</td><td>${t.per_day}</td><td class="pts">${t.players}</td></tr>`).join('')
                : '<tr><td colspan="6" style="color:#8b949e">No team buildings yet. Add one in the locker room.</td></tr>');

  const wrap=document.getElementById('scorers-wrap');
  wrap.classList.toggle('hidden', !players.length);
  document.getElementById('scorers-table').innerHTML =
    '<tr><th>#</th><th>Top scorers</th><th>🥃 Drinks</th><th>🎫 Tickets</th><th>Drinks / ticket</th></tr>'+
    players.map((p,i)=>`<tr class="${me&&p.id===me.id?'me':''}"><td class="pos">${i+1}</td><td>@${esc(p.username)}</td><td>${p.drinks}</td><td>${p.tickets}</td><td>${p.drinks_per_ticket ?? '∞'}</td></tr>`).join('');
  if(players.length){
    const top=players[0], total=players.reduce((a,p)=>a+p.drinks,0);
    document.getElementById('golden-boot').textContent =
      `👟 GOLDEN BOOT: @${top.username} — ${top.drinks} drinks • league total: ${total} drinks across ${players.length} players`;
    renderHeadToHead(players);
  }
}

function renderHeadToHead(players){
  const mine = me && players.find(p=>p.id===me.id);
  const home = mine || players[0];
  const others = players.filter(p=>p.id!==home.id);
  if(!others.length) return; // nothing to compare against yet
  const avg = k => +(others.reduce((a,p)=>a+(+p[k]||0),0)/others.length).toFixed(1);
  const dpt = p => p.tickets ? +(p.drinks/p.tickets).toFixed(1) : p.drinks;
  document.getElementById('h2h-home').textContent = '@'+home.username.toUpperCase();
  document.getElementById('h2h-away').textContent = 'LEAGUE AVG';
  const rows=[
    { label:'🎫 Tickets processed',           home:home.tickets, away:avg('tickets') },
    { label:'🥃 Drinks',                       home:home.drinks,  away:avg('drinks') },
    { label:'🥃 Drinks per ticket processed', home:dpt(home),    away:+(others.reduce((a,p)=>a+dpt(p),0)/others.length).toFixed(1) },
  ];
  document.getElementById('cmp-rows').innerHTML = rows.map(s=>{
    const max=Math.max(s.home,s.away)||1;
    return `<div class="cmp-row"><span class="cmp-val home">${s.home}</span><div class="cmp-mid"><div class="cmp-label">${s.label}</div>`+
      `<div class="cmp-bars"><span class="h"><i style="width:${s.home/max*100}%"></i></span><span class="a"><i style="width:${s.away/max*100}%"></i></span></div></div>`+
      `<span class="cmp-val away">${s.away}</span></div>`;
  }).join('');
}

async function loadPossession(){
  const { data, error } = await sb.from('drink_type_stats').select('*').order('drinks',{ascending:false});
  if(error) throw error;
  const total=data.reduce((a,r)=>a+r.drinks,0);
  if(!total) return; // keep demo bar
  const pct=r=>Math.round(r.drinks/total*100);
  document.getElementById('possession').innerHTML = data.map(r=>{
    const m=DRINK_META[r.drink_type]||DRINK_META.other, p=pct(r);
    return `<div style="width:${r.drinks/total*100}%;background:${m.color}">${p>=12?m.label.toUpperCase()+' ':''}${p>=6?p+'%':''}</div>`;
  }).join('');
  document.getElementById('possession-legend').innerHTML = data.map(r=>{
    const m=DRINK_META[r.drink_type]||DRINK_META.other;
    return `<span><i style="background:${m.color}"></i>${m.label} ${pct(r)}%</span>`;
  }).join('');
}

// ---- guestbook ----
async function loadGuestbook(){
  const { data, error } = await sb.from('guestbook_feed').select('*').order('created_at',{ascending:false}).limit(50);
  if(error) throw error;
  document.getElementById('gb-list').innerHTML = data.length
    ? data.map(g=>`<div class="gb-item"><div class="gb-meta"><strong>@${esc(g.username)}</strong> ${timeAgo(g.created_at)}`+
        (me&&g.user_id===me.id?`<button class="gb-del" title="Delete" data-action="deleteMessage" data-arg="${g.id}">✕</button>`:'')+
        `</div><div class="gb-msg">${esc(g.message)}</div></div>`).join('')
    : '<div class="gb-empty">No messages yet. Be the first to say na zdrave 🥃</div>';
}
export async function deleteMessage(id){
  const { error } = await sb.from('guestbook').delete().eq('id', id);
  if(!error) loadGuestbook();
}

async function loadAll(){
  try { await Promise.all([loadLeague(), loadPossession(), loadGuestbook()]); }
  catch(err){ console.warn('Supabase load failed, keeping demo data:', err.message||err); }
}

// ---- writes ----
function bindForm(formId, msgId, handler){
  document.getElementById(formId).addEventListener('submit', async e=>{
    e.preventDefault();
    const btn=e.target.querySelector('button[type=submit]'); btn.disabled=true; setMsg(msgId,'');
    try { const ok=await handler(e.target); setMsg(msgId, ok, true); loadAll(); }
    catch(err){ setMsg(msgId, '✗ '+(err.message||'Something went wrong')); }
    finally { btn.disabled=false; }
  });
}
const must = ({ error }) => { if(error) throw error; };

bindForm('drink-form','drink-msg', async f=>{
  const quantity=+f.quantity.value;
  must(await sb.from('drink_logs').insert({ drink_type:f.drink_type.value, quantity,
    team_building_id: f.team_building_id.value ? +f.team_building_id.value : null }));
  playSound('splash');
  return `✓ ${quantity} × ${f.drink_type.options[f.drink_type.selectedIndex].text} logged. Na zdrave!`;
});
bindForm('ticket-form','ticket-msg', async f=>{
  must(await sb.from('ticket_logs').insert({ tickets:+f.tickets.value }));
  return `✓ ${f.tickets.value} ticket(s) logged. Suspiciously productive.`;
});
bindForm('tb-form','tb-msg', async f=>{
  must(await sb.from('team_buildings').insert({ name:f.name.value.trim(), emoji:f.emoji.value.trim()||'🍻', days:+f.days.value }));
  const name=f.name.value.trim(); f.reset();
  return `✓ "${name}" added to the league`;
});
bindForm('gb-form','gb-msg', async f=>{
  must(await sb.from('guestbook').insert({ message:f.message.value.trim() }));
  f.reset();
  return '✓ Posted';
});

if(sb){
  document.getElementById('signin-btn').classList.remove('hidden');
  document.getElementById('guestbook-label').classList.remove('hidden');
  document.getElementById('guestbook').classList.remove('hidden');
  document.getElementById('gb-signin').classList.remove('hidden');
  // Supabase recommends not awaiting other Supabase calls inside this callback
  sb.auth.onAuthStateChange((event, session)=>{
    setTimeout(()=>{
      onSession(session);
      // Arrived from a "reset password" email link: ask for the new password
      if(event==='PASSWORD_RECOVERY') openAuth('reset');
    }, 0);
  });
  if(authLinkError) showAuthLinkError(authLinkError);
}

// Explain a failed email link and offer the way out, instead of leaving the error in the address bar
function showAuthLinkError({ code, description }){
  history.replaceState(null, '', location.pathname + location.search);
  openAuth('signin');
  setMsg('auth-msg', code==='otp_expired'
    ? '✗ This email link has expired or was already used. If you already confirmed your email, just sign in. '
      + 'Otherwise resend the confirmation email below, or use "Forgot password?" for a new reset link.'
    : `✗ The email link didn't work (${description || code}). Sign in, or request a new link below.`);
  offerResend();
}
