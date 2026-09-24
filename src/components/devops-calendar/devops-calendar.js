/*
 * <devops-calendar> — framework-agnostic Web Component (no dependencies).
 * Usage:
 *   <script type="module" src="devops-calendar.js"></script>
 *   <devops-calendar src="/data/sessions.json"></devops-calendar>
 * or set data directly:  el.data = { sessions:[...], phases:{...}, sessionDays:[2,4] }
 * Attributes: src (JSON url), today (YYYY-MM-DD, optional override for testing)
 * Events: "session-select" → detail: { date, session|null }
 * Theming: override CSS custom properties on the element (see :host block).
 *
 * LMS additions (visuals unchanged): optional `semesters` map + per-session
 * `semester` numbers sessions within their own semester and names the break
 * between semesters; per-session `optional: true` adds an "Optional" tag.
 */
const MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const key=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const parse=s=>new Date(s+'T00:00');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const CSS=`
:host{--dc-accent:#ec3013;--dc-accent-soft:#ff9783;--dc-accent-deep:#ae1800;--dc-ink:#201e1d;--dc-muted:#605d5d;--dc-rule:rgba(32,30,29,.4);--dc-rule-soft:rgba(32,30,29,.12);--dc-tag-bg:#fff2ef;--dc-tag-ink:#7c1405;--dc-neutral-bg:#eae7e7;--dc-track:#d7d3d3;--dc-font:"Archivo",system-ui,sans-serif;
display:block;font-family:var(--dc-font);color:var(--dc-ink);container-type:inline-size}
*{box-sizing:border-box}
.grid{display:grid;grid-template-columns:minmax(0,440px) minmax(0,1fr);gap:48px;align-items:start}
@container (max-width:860px){.grid{grid-template-columns:minmax(0,1fr)}.cal{max-width:480px}}
.cal{position:relative;background:linear-gradient(180deg,#1c1b1b 0%,#0d0d0d 100%);color:#f4f2f1;padding:28px 26px 22px;border-radius:18px;
box-shadow:0 1px 0 rgba(255,255,255,.06) inset,0 0 0 1px rgba(0,0,0,.6),0 2px 4px rgba(20,16,14,.12),0 12px 24px -6px rgba(20,16,14,.22),0 40px 70px -20px rgba(20,16,14,.38)}
.cal::before{content:"";position:absolute;top:0;left:50%;transform:translateX(-50%);width:84px;height:8px;background:#000;border-radius:0 0 8px 8px}
.top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:22px}
.month{font-size:64px;font-weight:800;line-height:.9;letter-spacing:-.04em}
.year{font-size:13px;color:#9b9797;margin-top:6px;letter-spacing:.04em}
.nav{display:flex;gap:6px}
.nav button{width:34px;height:34px;border-radius:50%;border:1px solid #333;background:#161515;color:#e8e6e5;cursor:pointer;display:grid;place-items:center}
.nav button:hover:not(:disabled){background:#262424;border-color:#4a4747}
.nav button:disabled{opacity:.3;cursor:default}
.dow,.days{display:grid;grid-template-columns:repeat(7,1fr)}
.dow{padding-bottom:10px;border-bottom:1px solid #2a2828;margin-bottom:8px}
.dow div{text-align:center;font-size:11px;letter-spacing:.1em;color:#7d7979;font-weight:600}
.dow .on{color:var(--dc-accent-soft)}
.days{row-gap:4px}
.day{position:relative;aspect-ratio:1;display:grid;place-items:center;font:inherit;font-size:16px;font-weight:600;color:#e8e6e5;background:none;border:0;cursor:pointer;padding:0}
.day span{width:40px;height:40px;display:grid;place-items:center;border-radius:50%;transition:background .15s,color .15s,box-shadow .15s}
.day:hover span{background:#262424}
.day.out{color:#3c3a3a;cursor:default}.day.out:hover span{background:none}
.day.tt{background:linear-gradient(180deg,rgba(236,48,19,.08),rgba(236,48,19,.04))}
.day.session span{box-shadow:inset 0 0 0 1.5px var(--dc-accent)}
.day.session::after{content:"";position:absolute;bottom:3px;width:4px;height:4px;border-radius:50%;background:var(--dc-accent)}
.day.past.session span{box-shadow:inset 0 0 0 1.5px #5a3a34;color:#9b9797}
.day.past.session::after{background:#5a3a34}
.day.today span{outline:1.5px dashed #7d7979;outline-offset:2px}
.day.sel span{background:var(--dc-accent);color:#fff;box-shadow:0 4px 14px rgba(236,48,19,.45)}
.day.sel.nosession span{background:#f4f2f1;color:#111;box-shadow:none}
.day:focus-visible{outline:none}.day:focus-visible span{outline:2px solid var(--dc-accent-soft);outline-offset:2px}
.foot{display:flex;justify-content:space-between;margin-top:16px;padding-top:14px;border-top:1px solid #2a2828;font-size:12px;color:#9b9797}
.foot b{color:#f4f2f1;font-weight:600}
.date{display:flex;align-items:baseline;gap:14px;padding-bottom:18px;border-bottom:2px solid var(--dc-rule)}
.num{font-size:88px;font-weight:800;line-height:.85;letter-spacing:-.05em}
.meta{font-size:13px;color:var(--dc-muted);line-height:1.4}.meta b{display:block;font-size:15px;color:var(--dc-ink)}
.body{padding-top:22px;animation:rise .28s ease}
@keyframes rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.body{animation:none}.day span{transition:none}}
.tags{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.tag{display:inline-flex;font-size:11px;letter-spacing:.02em;padding:3px 10px}
.t-acc{background:var(--dc-tag-bg);color:var(--dc-tag-ink)}.t-neu{background:var(--dc-neutral-bg);color:var(--dc-body,#444141)}.t-out{border:1px solid var(--dc-accent);color:var(--dc-accent-deep)}
h2{font-size:clamp(26px,4cqi,34px);font-weight:800;line-height:1.12;letter-spacing:-.025em;margin:0 0 12px;text-wrap:balance}
.sum{font-size:16px;line-height:1.55;max-width:56ch;color:var(--dc-body,#444141);text-wrap:pretty;margin:0 0 26px}
.cols{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);border-top:2px solid var(--dc-rule)}
.cols>div{padding:18px 20px 18px 0}.cols>div+div{border-left:1px solid var(--dc-rule);padding-left:20px}
@container (max-width:560px){.cols{grid-template-columns:minmax(0,1fr)}.cols>div+div{border-left:0;border-top:1px solid var(--dc-rule);padding-left:0}}
h6{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--dc-muted);margin:0 0 12px;font-weight:800}
ol{margin:0;padding:0;list-style:none;counter-reset:t}
li{counter-increment:t;display:grid;grid-template-columns:28px 1fr;padding:7px 0;border-bottom:1px solid var(--dc-rule-soft);font-size:14px}
li::before{content:counter(t,decimal-leading-zero);font-size:11px;color:var(--dc-accent-deep);font-weight:600;padding-top:2px}
.cols p{font-size:14px;margin:0 0 14px}
.prog{height:4px;background:var(--dc-track);width:160px}.prog i{display:block;height:100%;background:var(--dc-accent)}
.dnav{display:flex;justify-content:space-between;gap:12px;margin-top:22px;padding-top:16px;border-top:2px solid var(--dc-rule)}
.btn{max-width:48%;font:inherit;font-size:14px;font-weight:800;text-align:left;color:var(--dc-ink);background:transparent;border:1px solid var(--dc-rule);padding:8px 14px;cursor:pointer}
.btn:hover{background:var(--dc-hover,rgba(32,30,29,.07))}.btn:active{background:var(--dc-press,rgba(32,30,29,.14))}
.btn:focus-visible{outline:2px solid var(--dc-accent);outline-offset:2px}
.btn small{display:block;font-weight:400;font-size:11px;color:var(--dc-muted)}
.btn.next{margin-left:auto}
.empty h2{color:var(--dc-muted)}
`;

class DevopsCalendar extends HTMLElement{
  static observedAttributes=['src','today'];
  #data=null;#sel=null;#view=null;
  constructor(){super();this.attachShadow({mode:'open'});}
  set data(v){this.#data=v;this.#init();}
  get data(){return this.#data;}
  attributeChangedCallback(n){if(n==='src')this.#load();else if(this.#data)this.#render();}
  connectedCallback(){if(!this.#data&&this.getAttribute('src'))this.#load();}
  get #today(){const t=this.getAttribute('today');return t?parse(t):new Date(new Date().toDateString());}
  async #load(){
    try{const r=await fetch(this.getAttribute('src'));this.data=await r.json();}
    catch(e){this.shadowRoot.innerHTML=`<p>Could not load sessions.</p>`;console.error('devops-calendar:',e);}
  }
  #init(){
    const d=this.#data;d.sessions=[...d.sessions].sort((a,b)=>a.date.localeCompare(b.date)).map((s,i)=>({...s,n:i+1}));
    const groups={};d.sessions.forEach(s=>{(groups[s.semester??'']??=[]).push(s);});
    Object.values(groups).forEach(g=>g.forEach((s,i)=>{s.sn=i+1;s.st=g.length;}));
    this.byKey=Object.fromEntries(d.sessions.map(s=>[s.date,s]));
    const f=parse(d.sessions[0].date),l=parse(d.sessions.at(-1).date);
    this.first=new Date(f.getFullYear(),f.getMonth(),1);this.last=new Date(l.getFullYear(),l.getMonth(),1);
    const up=d.sessions.find(s=>parse(s.date)>=this.#today)||d.sessions.at(-1);
    this.#sel=parse(up.date);this.#view=new Date(this.#sel.getFullYear(),this.#sel.getMonth(),1);
    this.shadowRoot.innerHTML=`<style>${CSS}</style><div class="grid">
<section class="cal" aria-label="Session calendar"><div class="top"><div><div class="month"></div><div class="year"></div></div>
<div class="nav"><button class="prev" aria-label="Previous month"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg></button><button class="next" aria-label="Next month"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></button></div></div>
<div class="dow">${['S','M','T','W','T','F','S'].map((x,i)=>`<div class="${this.#days.includes(i)?'on':''}">${x}</div>`).join('')}</div>
<div class="days" role="grid"></div><div class="foot"><span class="count"></span><span class="done"></span></div></section>
<section class="detail" aria-live="polite"></section></div>`;
    const $=s=>this.shadowRoot.querySelector(s);
    $('.prev').onclick=()=>{this.#view.setMonth(this.#view.getMonth()-1);this.#renderCal();};
    $('.next').onclick=()=>{this.#view.setMonth(this.#view.getMonth()+1);this.#renderCal();};
    $('.days').addEventListener('keydown',e=>{const m={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[e.key];if(!m)return;e.preventDefault();const d=new Date(this.#sel);d.setDate(d.getDate()+m);this.select(key(d),true);});
    this.#render();
  }
  get #days(){return this.#data?.sessionDays??[2,4];}
  #semLabel(s){return s?.semester!=null?this.#data.semesters?.[s.semester]:undefined;}
  select(dateKey,focus){
    const d=parse(dateKey),m=new Date(d.getFullYear(),d.getMonth(),1);
    if(m<this.first||m>this.last)return;
    this.#sel=d;this.#view=m;this.#render();
    if(focus)this.shadowRoot.querySelector('.day.sel')?.focus();
    this.dispatchEvent(new CustomEvent('session-select',{detail:{date:dateKey,session:this.byKey[dateKey]||null},bubbles:true,composed:true}));
  }
  #render(){this.#renderCal();this.#renderDetail();}
  #renderCal(){
    const $=s=>this.shadowRoot.querySelector(s),v=this.#view,y=v.getFullYear(),mo=v.getMonth(),T=this.#today,S=this.#data.sessions;
    $('.month').textContent=MN[mo].slice(0,3);$('.year').textContent=`${MN[mo]} ${y}`;
    $('.prev').disabled=v<=this.first;$('.next').disabled=v>=this.last;
    const start=new Date(y,mo,1-v.getDay()),cells=Math.ceil((v.getDay()+new Date(y,mo+1,0).getDate())/7)*7,box=$('.days');box.innerHTML='';
    for(let i=0;i<cells;i++){
      const d=new Date(start);d.setDate(start.getDate()+i);const k=key(d),s=this.byKey[k],b=document.createElement('button');
      b.className='day';b.innerHTML=`<span>${d.getDate()}</span>`;
      if(d.getMonth()!==mo){b.classList.add('out');b.tabIndex=-1;b.setAttribute('aria-hidden','true');}
      else{
        if(this.#days.includes(d.getDay()))b.classList.add('tt');
        if(s)b.classList.add('session');
        if(s&&d<T)b.classList.add('past');
        if(k===key(T))b.classList.add('today');
        const sel=k===key(this.#sel);if(sel){b.classList.add('sel');if(!s)b.classList.add('nosession');}
        b.tabIndex=sel?0:-1;b.setAttribute('aria-label',`${DN[d.getDay()]} ${d.getDate()} ${MN[mo]}${s?': '+s.title:''}`);
        b.onclick=()=>this.select(k);
      }
      box.appendChild(b);
    }
    const inMonth=S.filter(s=>parse(s.date).getMonth()===mo&&parse(s.date).getFullYear()===y).length;
    $('.count').innerHTML=`<b>${inMonth}</b> session${inMonth===1?'':'s'} in ${MN[mo]}`;
    $('.done').innerHTML=`<b>${S.filter(s=>parse(s.date)<T).length}</b> / ${S.length} completed`;
  }
  #btn(s,cls,label){return s?`<button class="btn ${cls}" data-k="${s.date}"><small>${label}</small>${this.#short(s.date)} · ${esc(s.title)}</button>`:'';}
  #short(k){const d=parse(k);return `${DN[d.getDay()].slice(0,3)} ${d.getDate()} ${MN[d.getMonth()].slice(0,3)}`;}
  #renderDetail(){
    const d=this.#sel,k=key(d),s=this.byKey[k],S=this.#data.sessions,T=this.#today,P=this.#data.phases||{},el=this.shadowRoot.querySelector('.detail');
    const head=`<div class="date"><div class="num">${String(d.getDate()).padStart(2,'0')}</div><div class="meta"><b>${DN[d.getDay()]}</b>${MN[d.getMonth()]} ${d.getFullYear()}${k===key(T)?' · Today':''}</div></div>`;
    if(s){
      const sem=this.#semLabel(s);
      el.innerHTML=head+`<div class="body"><div class="tags"><span class="tag t-acc">Session ${String(s.sn).padStart(2,'0')} of ${s.st}</span>${sem?`<span class="tag t-neu">${esc(sem)}</span>`:''}${P[s.phase]?`<span class="tag t-neu">${esc(P[s.phase])}</span>`:''}${s.optional?'<span class="tag t-neu">Optional</span>':''}${d<T?'<span class="tag t-out">Completed</span>':''}</div>
<h2>${esc(s.title)}</h2><p class="sum">${esc(s.summary)}</p>
<div class="cols"><div><h6>What we’ll cover</h6><ol>${(s.topics||[]).map(t=>`<li>${esc(t)}</li>`).join('')}</ol></div>
<div>${s.bring?`<h6>Bring / set up</h6><p>${esc(s.bring)}</p>`:''}<h6>${sem?`${esc(sem)} progress`:'Track progress'}</h6><div class="prog"><i style="width:${s.sn/s.st*100}%"></i></div></div></div>
<div class="dnav">${this.#btn(S[s.n-2],'prev','← Previous')}${this.#btn(S[s.n],'next','Next →')}</div></div>`;
    }else{
      const nx=S.find(x=>parse(x.date)>d),pv=S.findLast(x=>parse(x.date)<d),f=parse(S[0].date),l=parse(S.at(-1).date);
      const brk=pv&&nx&&pv.semester!==nx.semester;
      const why=d>l?'The semester’s sessions have wrapped up.':d<f?`The track kicks off on ${this.#short(S[0].date)}.`:brk?`${esc(this.#semLabel(pv)??'The semester')} has wrapped up — members are on exam break. ${esc(this.#semLabel(nx)??'Sessions')} kicks off on ${this.#short(nx.date)}.`:`We meet on ${this.#days.map(i=>DN[i]+'s').join(' and ')}.`;
      el.innerHTML=head+`<div class="body empty"><div class="tags"><span class="tag t-neu">${brk?'Exam break':'No session'}</span></div><h2>Nothing scheduled this day</h2><p class="sum">${why} Pick a highlighted date to see what we’re learning.</p><div class="dnav">${this.#btn(nx,'next','Next session →')}</div></div>`;
    }
    el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>this.select(b.dataset.k));
  }
}
if(!customElements.get('devops-calendar'))customElements.define('devops-calendar',DevopsCalendar);
export default DevopsCalendar;
