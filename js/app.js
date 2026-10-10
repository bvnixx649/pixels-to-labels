/* Pixels to Labels: router, hero, lesson renderer, written + MCQ practice */
(() => {
const app = document.getElementById('app');
const L = window.LESSONS;
const CH = {
  8: { name: 'Feature Extraction', th: 'บทที่ 8 การสกัดคุณลักษณะสำคัญของภาพ' },
  9: { name: 'Image Classification', th: 'บทที่ 9 การจำแนกภาพและ CNN' },
  10: { name: 'Training & Detection', th: 'บทที่ 10 การเทรนโมเดล การตรวจจับวัตถุ และการวัดผล' },
};

/* storage (per-device convenience only) */
const S = {
  get(k, d) { try { const v = localStorage.getItem('p2l:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('p2l:' + k, JSON.stringify(v)); } catch {} },
};
const self = S.get('self', {});   // written id -> 1 | 0
const mcqDone = S.get('mcq', {}); // mcq id -> true(correct) | false

/* theme */
const themeBtn = document.getElementById('theme');
const savedTheme = S.get('theme', null);
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
themeBtn.onclick = () => {
  const dark = document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  const t = dark ? 'light' : 'dark';
  document.documentElement.dataset.theme = t; S.set('theme', t);
};

/* reading progress */
const prog = document.getElementById('prog');
addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  prog.style.width = (location.hash.startsWith('#/l/') && h > 0 ? (scrollY / h) * 100 : 0) + '%';
}, { passive: true });

/* ids */
L.forEach(l => {
  l.written.forEach((w, i) => { w.id = l.id + '-w' + (i + 1); w.lesson = l; });
  l.mcq.forEach((m, i) => { m.id = l.id + '-m' + (i + 1); m.lesson = l; });
});

/* ---------- shared renderers ---------- */
function writtenHTML(w, n) {
  const v = self[w.id];
  return `<div class="wq" data-id="${w.id}">
    <p class="q"><span class="n">${n}</span><span>${w.q}${w.tag ? ` <span class="tag">${w.tag}</span>` : ''}</span></p>
    <div class="row"><button class="btn reveal" aria-expanded="false">ดูแนวตอบ</button>${v != null ? `<span class="mark">${v ? 'ตอบได้แล้ว' : 'ยังไม่แม่น'}</span>` : ''}</div>
    <div class="ans-wrap"><div class="ans"><div class="ans-in">${w.a}
      <div class="self"><button class="btn" data-v="1" aria-pressed="${v === 1}">ตอบได้</button><button class="btn" data-v="0" aria-pressed="${v === 0}">ยังไม่แม่น</button></div>
    </div></div></div>
  </div>`;
}
function wireWritten(root) {
  root.querySelectorAll('.wq').forEach(el => {
    const id = el.dataset.id;
    const rv = el.querySelector('.reveal');
    rv.onclick = () => {
      const open = el.classList.toggle('open');
      rv.textContent = open ? 'ซ่อนแนวตอบ' : 'ดูแนวตอบ';
      rv.setAttribute('aria-expanded', open);
    };
    el.querySelectorAll('.self button').forEach(b => b.onclick = () => {
      const v = +b.dataset.v; self[id] = v; S.set('self', self);
      el.querySelectorAll('.self button').forEach(x => x.setAttribute('aria-pressed', x === b));
      let mk = el.querySelector('.mark');
      if (!mk) { mk = document.createElement('span'); mk.className = 'mark'; el.querySelector('.row').append(mk); }
      mk.textContent = v ? 'ตอบได้แล้ว' : 'ยังไม่แม่น';
    });
  });
}
function mcqHTML(m) {
  return `<div class="mcq" data-id="${m.id}"><p class="q">${m.q}</p>
    <div class="opts">${m.o.map((o, i) => `<button data-i="${i}">${o}</button>`).join('')}</div>
    <p class="why" hidden>${m.why}</p></div>`;
}
function wireMcq(root, onAnswer) {
  root.querySelectorAll('.mcq').forEach(el => {
    const m = MCQ_BY_ID[el.dataset.id];
    el.querySelectorAll('.opts button').forEach(b => b.onclick = () => {
      const i = +b.dataset.i, ok = i === m.a;
      el.querySelectorAll('.opts button').forEach((x, j) => {
        x.disabled = true;
        if (j === m.a) x.classList.add('ok');
        else if (j === i) x.classList.add('no');
      });
      el.querySelector('.why').hidden = false;
      mcqDone[m.id] = ok; S.set('mcq', mcqDone);
      onAnswer && onAnswer(ok);
    });
  });
}
const MCQ_BY_ID = {};
L.forEach(l => l.mcq.forEach(m => MCQ_BY_ID[m.id] = m));

function mountFigs(root) {
  root.querySelectorAll('[data-fig]').forEach(el => {
    const f = window.FIGS && window.FIGS[el.dataset.fig];
    if (f) { try { f(el); } catch (e) { console.error(e); } }
  });
}

/* ---------- home ---------- */
let heroTimer = null;
function home() {
  const byCh = [8, 9, 10].map(c => {
    const ls = L.filter(l => l.ch === c);
    return `<section class="toc-ch"><h2>${CH[c].name}<span class="chn">${CH[c].th}</span></h2><ol>${ls.map(l => {
      const ok = l.written.filter(w => self[w.id] === 1).length;
      return `<li><a href="#/l/${l.id}"><span class="t">${l.title}</span><span class="d">${l.desc}</span>
        <span class="c">${ok ? `<b>${ok}</b> / ` : ''}${l.written.length} ข้อเขียน<br>${l.mcq.length} ข้อเลือก</span></a></li>`;
    }).join('')}</ol></section>`;
  }).join('');
  const nW = L.reduce((s, l) => s + l.written.length, 0), nM = L.reduce((s, l) => s + l.mcq.length, 0);
  app.innerHTML = `
  <section class="hero">
    <div>
      <h1>Pixels<br>to Labels</h1>
      <p class="lede">คอมพิวเตอร์ไม่เห็นแมว มันเห็นแค่ตารางตัวเลข งานของบท 8 ถึง 10 คือเปลี่ยนตารางนั้นให้เหลือตัวเลขไม่กี่ตัวที่บอกได้ว่านี่คืออะไร และอยู่ตรงไหน</p>
      <p class="when">สอบปลายภาค DIP 273488 <b>16 ต.ค. 2569 เวลา 15:00</b> ห้อง SC2-208</p>
    </div>
    <div>
      <div class="stage" id="stage" data-s="0" aria-label="ภาพแมว 16 คูณ 16 พิกเซลที่ถูกแปลงเป็น feature แล้วจำแนก"></div>
      <div class="stage-ctl"><div class="seg" id="stageSeg">
        <button data-s="0" aria-pressed="true">ภาพ</button><button data-s="1" aria-pressed="false">ขอบ</button><button data-s="2" aria-pressed="false">ฮิสโตแกรม</button><button data-s="3" aria-pressed="false">คำตอบ</button>
      </div></div>
      <p class="stage-cap" id="stageCap"></p>
    </div>
  </section>
  <div class="toc">
    <div class="practice">
      <a href="#/written"><span>ฝึกเขียนตอบ</span><small>${nW} ข้อบรรยายที่น่าจะออก พร้อมแนวตอบที่เขียนแล้วได้คะแนนเต็ม</small></a>
      <a href="#/quiz"><span>ควิซรวม</span><small>สุ่ม 15 ข้อจาก ${nM} ข้อเลือกตอบทั้ง 3 บท รู้ผลทันทีทีละข้อ</small></a>
    </div>
    ${byCh}
  </div>`;
  hero();
}

function hero() {
  const stage = document.getElementById('stage');
  const N = 16;
  const art = [
    '7777777777777777',
    '7737777777777377',
    '7723777777773277',
    '7722377777732277',
    '7722222222222277',
    '7222222222222227',
    '7222992222992227',
    '7222982222982227',
    '7222222222222227',
    '7222222552222227',
    '7722222222222277',
    '7772222222222777',
    '7777222222227777',
    '7777722222277777',
    '7777222222227777',
    '7772222222222777',
  ];
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const val = art.map(r => [...r].map(c => Math.max(0, Math.min(255, Math.round(+c * 27 - 20 + (rnd() - .5) * 46)))));
  const base = art.map(r => [...r].map(c => +c));
  // gradient magnitude (central difference) on the clean shape so the outline reads clearly
  const g = base.map((r, y) => r.map((_, x) => {
    const gx = (base[y][Math.min(N - 1, x + 1)] - base[y][Math.max(0, x - 1)]);
    const gy = (base[Math.min(N - 1, y + 1)][x] - base[Math.max(0, y - 1)][x]);
    return Math.hypot(gx, gy);
  }));
  const gmax = Math.max(...g.flat());
  // histogram placement: 8 bins, each bin 2 cells wide, mini squares at 1/3 size
  const BINS = 8, sub = 3;
  const cells = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) cells.push({ x, y, v: val[y][x], g: g[y][x] / gmax });
  const order = [...cells].sort((a, b) => a.v - b.v);
  const fill = Array(BINS).fill(0);
  order.forEach(c => {
    const b = Math.min(BINS - 1, Math.floor(c.v / 32));
    const k = fill[b]++;
    c.hx = b * 2 * sub + (k % (2 * sub)); // in mini units
    c.hy = Math.floor(k / (2 * sub));
  });
  stage.innerHTML = '<div class="axis"></div><div class="bins">' + Array.from({ length: BINS }, (_, i) => `<span>${i * 32}</span>`).join('') + '</div>' +
    '<div class="verdict"><div class="vrow"><span>แมว</span><div class="vbar"><i style="--w:93%"></i></div><span class="p">0.93</span></div><div class="vrow"><span>หมา</span><div class="vbar"><i style="--w:7%"></i></div><span class="p">0.07</span></div></div>';
  const els = cells.map(c => { const d = document.createElement('div'); d.className = 'px'; stage.append(d); return d; });
  const cap = document.getElementById('stageCap');
  const caps = [
    'ภาพ 16×16 = ตัวเลข 256 ค่า แต่ละช่องคือความเข้ม 0 ถึง 255',
    'Feature ระดับต่ำ: gradient แรงตรงที่ค่าพิกเซลเปลี่ยนเร็ว เส้นขอบจึงสว่าง',
    'Color histogram: นับว่าพิกเซลตกช่วงความเข้มไหนบ้าง 256 ค่าเหลือ 8 ตัวเลข',
    'Feature vector เข้าโมเดล แล้ว softmax ให้ความน่าจะเป็นของแต่ละคลาส',
  ];
  const isDark = () => getComputedStyle(document.documentElement).getPropertyValue('--paper').trim() !== '#ffffff';
  function layout(s, first) {
    const W = stage.clientWidth, cs = W / N, gap = Math.max(1, cs * .06);
    const ms = (2 * cs) / (2 * sub); // mini cell size
    stage.dataset.s = s;
    stage.querySelector('.axis').style.opacity = s === 2 ? 1 : 0;
    stage.querySelector('.bins').style.opacity = s === 2 ? 1 : 0;
    stage.querySelectorAll('.vbar i').forEach(i => i.style.width = s === 3 ? i.style.getPropertyValue('--w') : '0');
    const dark = isDark();
    cells.forEach((c, i) => {
      const el = els[i];
      let tx, ty, size, col, op = 1;
      if (s === 0 || s === 1 || s === 3) { size = cs - gap; tx = c.x * cs; ty = c.y * cs; }
      if (s === 0) { const v = c.v; col = `rgb(${v},${v},${Math.min(255, v + 6)})`; }
      if (s === 1) { const t = Math.pow(c.g, .8); col = dark ? `rgba(125,151,255,${.08 + t * .92})` : `rgba(43,80,232,${.06 + t * .94})`; }
      if (s === 2) { size = ms - Math.max(.6, ms * .1); tx = c.hx * ms; ty = W - (c.hy + 1) * ms; const v = c.v; col = `rgb(${v},${v},${Math.min(255, v + 6)})`; }
      if (s === 3) { const v = c.v; col = `rgb(${v},${v},${v})`; op = .08; }
      el.style.width = el.style.height = size + 'px';
      el.style.backgroundColor = col;
      el.style.opacity = op;
      const delay = s === 2 ? (c.v / 255) * 380 + (c.y * 12) : (c.x + c.y) * 14;
      el.style.transitionDelay = first ? `${(c.x + c.y) * 22}ms` : `${delay}ms`;
      el.style.transform = `translate(${tx}px,${ty}px)` + (first ? ' scale(.2)' : '');
    });
    cap.textContent = caps[s];
    document.querySelectorAll('#stageSeg button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.s === s));
  }
  let cur = 0;
  layout(0, true);
  els.forEach(e => e.style.opacity = 0);
  requestAnimationFrame(() => requestAnimationFrame(() => { layout(0, false); }));
  document.querySelectorAll('#stageSeg button').forEach(b => b.onclick = () => { stopAuto(); cur = +b.dataset.s; layout(cur); });
  // one orchestrated autoplay on first visit, then stop
  clearTimeout(heroTimer);
  const seq = [1, 2, 3, 0]; let k = 0;
  const auto = () => { heroTimer = setTimeout(() => { if (!document.body.contains(stage)) return; cur = seq[k++]; layout(cur); if (k < seq.length) auto(); }, k === 0 ? 2200 : 2600); };
  const stopAuto = () => clearTimeout(heroTimer);
  auto();
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => document.body.contains(stage) && layout(cur), 120); });
}

/* ---------- lesson ---------- */
function lesson(id) {
  const i = L.findIndex(l => l.id === id);
  if (i < 0) return home();
  const l = L[i], prev = L[i - 1], next = L[i + 1];
  app.innerHTML = `<article class="col lesson">
    <h1>${l.title}</h1>
    <p class="sub">${l.sub}</p>
    ${l.body}
    <h2 id="written">ฝึกเขียนตอบ</h2>
    <p class="muted">ลองตอบในหัวก่อน หรือเขียนลงกระดาษ แล้วค่อยเปิดแนวตอบมาเทียบ</p>
    <div>${l.written.map((w, k) => writtenHTML(w, k + 1)).join('')}</div>
    <h2 id="mcq">เช็กความเข้าใจ</h2>
    <div>${l.mcq.map(mcqHTML).join('')}</div>
    <nav class="pager">
      ${prev ? `<a href="#/l/${prev.id}"><small>ก่อนหน้า</small><span>${prev.title}</span></a>` : '<span></span>'}
      ${next ? `<a class="next" href="#/l/${next.id}"><small>ถัดไป</small><span>${next.title}</span></a>` : `<a class="next" href="#/written"><small>ทวนทั้งหมด</small><span>ฝึกเขียนตอบ</span></a>`}
    </nav>
  </article>`;
  mountFigs(app); wireWritten(app); wireMcq(app);
}

/* ---------- all written questions ---------- */
function written(filter = S.get('wf', 'all')) {
  const pass = w => filter === 'all' ? true : filter === 'weak' ? self[w.id] !== 1 : w.lesson.ch === +filter;
  let n = 0;
  const body = L.map(l => {
    const ws = l.written.filter(pass);
    if (!ws.length) return '';
    return `<p class="grp"><a href="#/l/${l.id}">${l.title}</a></p>` + ws.map(w => writtenHTML(w, ++n)).join('');
  }).join('');
  const total = L.reduce((s, l) => s + l.written.length, 0);
  const got = L.reduce((s, l) => s + l.written.filter(w => self[w.id] === 1).length, 0);
  app.innerHTML = `<div class="page">
    <h1>ฝึกเขียนตอบ</h1>
    <p class="sub">ข้อสอบจริงมี 10 ข้อ ทั้งคำนวณและบรรยาย ชุดนี้รวมข้อบรรยายที่น่าจะออกจากทั้ง 3 บท ตอบได้แล้ว ${got} จาก ${total} ข้อ</p>
    <div class="filters">
      ${[['all', 'ทั้งหมด'], ['8', 'บท 8'], ['9', 'บท 9'], ['10', 'บท 10'], ['weak', 'ที่ยังไม่แม่น']].map(([k, t]) => `<button class="chip" data-f="${k}" aria-pressed="${filter === k}">${t}</button>`).join('')}
      <a class="chip" href="#/drill" style="margin-left:auto;text-decoration:none;background:var(--signal);color:#fff;display:inline-flex;align-items:center">สุ่มทีละข้อ</a>
    </div>
    <div>${body || '<p class="muted">ไม่มีข้อที่ยังไม่แม่นแล้ว ลองกดสุ่มทีละข้อเพื่อทวนอีกรอบ</p>'}</div>
  </div>`;
  app.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { S.set('wf', b.dataset.f); written(b.dataset.f); });
  wireWritten(app);
}

/* ---------- drill: one written question at a time ---------- */
function drill() {
  const all = L.flatMap(l => l.written);
  const weakFirst = [...all].sort(() => Math.random() - .5).sort((a, b) => (self[a.id] === 1) - (self[b.id] === 1));
  let k = 0;
  const show = () => {
    const w = weakFirst[k];
    app.innerHTML = `<div class="page">
      <h1>สุ่มทีละข้อ</h1>
      <p class="sub">ข้อที่ยังไม่เคยกดว่าตอบได้จะมาก่อน พูดหรือเขียนคำตอบให้จบก่อนกดดูแนวตอบ</p>
      <div class="card-drill">
        <div class="meta"><span>${w.lesson.title}</span><span>${k + 1} / ${weakFirst.length}</span></div>
        <p class="dq">${w.q}</p>
        <div id="dans" hidden><div class="ans-in">${w.a}</div></div>
        <div class="controls" id="dctl"><button class="btn primary" id="dshow">ดูแนวตอบ</button></div>
      </div>
    </div>`;
    document.getElementById('dshow').onclick = () => {
      document.getElementById('dans').hidden = false;
      document.getElementById('dctl').innerHTML = `<button class="btn" data-v="0">ยังไม่แม่น</button><button class="btn primary" data-v="1">ตอบได้ ไปข้อต่อไป</button>`;
      document.querySelectorAll('#dctl button').forEach(b => b.onclick = () => {
        self[w.id] = +b.dataset.v; S.set('self', self);
        k = (k + 1) % weakFirst.length; show(); scrollTo(0, 0);
      });
    };
  };
  show();
}

/* ---------- mixed MCQ quiz ---------- */
function quiz() {
  const pool = L.flatMap(l => l.mcq).sort(() => Math.random() - .5).slice(0, 15);
  let right = 0, done = 0;
  app.innerHTML = `<div class="page">
    <h1>ควิซรวม</h1>
    <p class="sub">15 ข้อสุ่มจากทั้ง 3 บท กดเลือกแล้วจะเห็นเฉลยกับเหตุผลทันที</p>
    <div id="qz">${pool.map(m => `<p class="grp">${m.lesson.title}</p>` + mcqHTML(m)).join('')}</div>
    <div id="qres"></div>
  </div>`;
  wireMcq(app, ok => {
    right += ok; done++;
    if (done === pool.length) {
      document.getElementById('qres').innerHTML = `<p class="score">${right}/${pool.length}</p><p class="muted">${right >= 13 ? 'แม่นมาก ลองไปฝึกข้อเขียนต่อ' : 'ข้อที่ผิดให้กดชื่อบทด้านบนข้อนั้นกลับไปอ่านส่วนนั้นอีกรอบ'}</p><div class="controls"><button class="btn primary" id="again">สุ่มชุดใหม่</button></div>`;
      document.getElementById('again').onclick = () => { quiz(); scrollTo(0, 0); };
    }
  });
}

/* ---------- router ---------- */
function route() {
  const h = location.hash || '#/';
  clearTimeout(heroTimer);
  document.querySelectorAll('[data-nav]').forEach(a => a.toggleAttribute('aria-current', h.startsWith('#/' + a.dataset.nav) || (a.dataset.nav === 'written' && h === '#/drill')));
  if (h.startsWith('#/l/')) lesson(h.slice(4));
  else if (h === '#/written') written();
  else if (h === '#/drill') drill();
  else if (h === '#/quiz') quiz();
  else home();
  scrollTo(0, 0);
  prog.style.width = 0;
}
addEventListener('hashchange', route);
route();
})();
