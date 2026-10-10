/* Interactive figures. Each FIGS[name](el) fills a .fig element. */
(() => {
const css = `
.fx{display:flex;flex-wrap:wrap;gap:22px 28px;align-items:flex-start}
.fx.center{justify-content:center}
.f2{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.lab{font-size:14px;color:var(--ink-2);margin:0 0 8px}
.sv{width:100%;height:auto;display:block;overflow:visible}
.sv text{font-family:var(--text);fill:var(--ink)}
.sv .mono{font-family:var(--mono)}
.s-rule{stroke:var(--rule)} .s-ink{stroke:var(--ink)} .s-ink3{stroke:var(--ink-3)} .s-sig{stroke:var(--signal)} .s-neg{stroke:var(--neg)} .s-pos{stroke:var(--pos)}
.f-ink{fill:var(--ink)} .f-ink2{fill:var(--ink-2)} .f-ink3{fill:var(--ink-3)} .f-sig{fill:var(--signal)} .f-sigs{fill:var(--signal-soft)} .f-paper{fill:var(--paper)} .f-wash2{fill:var(--wash-2)} .f-neg{fill:var(--neg)} .f-pos{fill:var(--pos)} .f-none{fill:none}
.sv text.f-ink2{fill:var(--ink-2)} .sv text.f-ink3{fill:var(--ink-3)} .sv text.f-sig{fill:var(--signal)} .sv text.f-paper{fill:var(--paper)} .sv text.f-neg{fill:var(--neg)}
.flow{display:grid;gap:10px;grid-auto-flow:column;grid-auto-columns:1fr;align-items:stretch}
.flow .st{background:var(--paper);border-radius:12px;padding:14px 14px 12px;cursor:pointer;border:0;text-align:left;font:inherit;color:inherit;transition:box-shadow .2s,background .2s;min-height:86px}
.flow .st b{display:block;font:650 15px/1.35 var(--display);letter-spacing:-.01em}
.flow .st span{display:block;font-size:13.5px;color:var(--ink-2);line-height:1.45;margin-top:4px}
.flow .st.on{box-shadow:inset 0 0 0 2px var(--signal)}
.flow.cols{grid-auto-flow:row;grid-template-columns:var(--cols)}
.flow.arch{grid-template-columns:repeat(8,minmax(0,1fr));grid-auto-flow:row}
.flow .st i{font-style:normal;font:600 12px/1 var(--mono);color:var(--ink-3)}
.apps{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.apps span{background:var(--paper);border-radius:99px;padding:6px 14px;font-size:14px;color:var(--ink-2)}
.read{font-family:var(--mono);font-size:15px;line-height:1.9;color:var(--ink)}
.read b{font-weight:600;color:var(--signal)}
.mini-bars{display:flex;align-items:flex-end;gap:4px;height:90px}
.mini-bars div{flex:1;background:var(--wash-2);border-radius:4px 4px 0 0;position:relative;min-width:14px;transition:height .3s,background .3s}
.mini-bars div.on{background:var(--signal)}
.mini-bars small{position:absolute;bottom:-20px;left:0;right:0;text-align:center;font:500 11px/1 var(--mono);color:var(--ink-3)}
.cm{display:grid;grid-template-columns:auto 1fr 1fr;gap:4px;max-width:420px;font-size:15px}
.cm .h{font-size:13.5px;color:var(--ink-2);display:flex;align-items:center;justify-content:center;text-align:center;padding:4px}
.cm .c{background:var(--paper);border-radius:10px;padding:10px;text-align:center}
.cm .c input{width:100%;max-width:90px;border:0;background:transparent;font:700 26px/1.1 var(--display);color:var(--ink);text-align:center;padding:2px;border-radius:6px}
.cm .c input:focus{outline:2px solid var(--signal)}
.cm .c small{display:block;font:600 12px/1 var(--mono);color:var(--ink-3);margin-top:4px}
.cm .c.tp,.cm .c.tn{background:var(--pos-soft)} .cm .c.fp,.cm .c.fn{background:var(--neg-soft)}
.mets{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:18px}
.mets div{background:var(--paper);border-radius:12px;padding:12px 14px}
.mets small{display:block;font-size:13px;color:var(--ink-2)}
.mets b{font:700 24px/1.2 var(--display);letter-spacing:-.02em}
.mets span{display:block;font:500 12px/1.4 var(--mono);color:var(--ink-3);margin-top:2px}
.cyc text{font-size:13px}
.slider-row{display:grid;grid-template-columns:72px 1fr 64px;gap:12px;align-items:center;font-size:15px}
.slider-row output{font-family:var(--mono);text-align:right}
.phase{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.phase div{background:var(--paper);border-radius:12px;padding:14px}
.phase div.hot{box-shadow:inset 0 0 0 2px var(--signal)}
.phase b{display:block;font:650 16px/1.3 var(--display)}
.phase ul{margin:8px 0 0;padding-left:18px;font-size:14px;color:var(--ink-2);line-height:1.5}
.phase li{margin:0 0 4px}
@media (max-width:640px){
  .f2{grid-template-columns:1fr}
  .flow{grid-auto-flow:row;grid-auto-columns:auto}
  .flow .st{min-height:0}
  .flow.cols{grid-template-columns:1fr}
  .flow.arch{grid-template-columns:repeat(2,minmax(0,1fr))}
  .mets{grid-template-columns:repeat(2,minmax(0,1fr))}
  .phase{grid-template-columns:repeat(2,minmax(0,1fr))}
}`;
const st = document.createElement('style'); st.textContent = css; document.head.append(st);

const F = window.FIGS = {};
const $ = (s, r) => r.querySelector(s);
const $$ = (s, r) => [...r.querySelectorAll(s)];
const fmt = (x, d = 2) => (Math.round(x * 10 ** d) / 10 ** d).toString();
const segHTML = (id, opts, cur) => `<div class="seg" data-seg="${id}">${opts.map(([v, t]) => `<button data-v="${v}" aria-pressed="${v == cur}">${t}</button>`).join('')}</div>`;
function onSeg(root, id, fn) {
  $$(`[data-seg="${id}"] button`, root).forEach(b => b.onclick = () => {
    $$(`[data-seg="${id}"] button`, root).forEach(x => x.setAttribute('aria-pressed', x === b));
    fn(b.dataset.v);
  });
}
function gridHTML(m, cls = '') { return `<div class="grid ${cls}" style="grid-template-columns:repeat(${m[0].length},auto)">${m.flat().map(v => `<span>${v}</span>`).join('')}</div>`; }
function stepper(root, n, draw, startNote) {
  const box = document.createElement('div');
  box.innerHTML = `<p class="step-note"></p><div class="stepper"><button class="btn" data-a="-1">ย้อน</button><button class="btn primary" data-a="1">ถัดไป</button></div>`;
  root.append(box);
  let k = 0;
  const note = $('.step-note', box), [pb, nb] = $$('button', box);
  const go = i => { k = Math.max(0, Math.min(n() - 1, i)); note.innerHTML = draw(k) || ''; pb.disabled = k === 0; nb.disabled = k >= n() - 1; };
  pb.onclick = () => go(k - 1); nb.onclick = () => go(k + 1);
  go(0);
  return { go, get k() { return k; } };
}
const svgPt = (svg, e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };

/* ============ Chapter 8 ============ */

F.pipeline = el => {
  const steps = [
    ['Input image', 'ภาพดิจิทัล (pixels)', 'ภาพแมว 224×224×3 คือตัวเลข 150,528 ค่า'],
    ['Preprocess', 'ปรับแสง ลด noise grayscale resize', 'แปลงเป็นเทา ย่อเหลือ 64×128 และลด noise เพื่อให้ทุกภาพอยู่ในสภาพเดียวกัน'],
    ['Feature extraction', 'สกัด color / shape / texture', 'คำนวณ color histogram, HOG หรือ GLCM จากภาพที่เตรียมแล้ว'],
    ['Feature vector', 'เวกเตอร์ตัวเลข (descriptor)', 'ได้เวกเตอร์ เช่น [0.12, 0.40, 0.03, …] ความยาวคงที่ทุกภาพ'],
    ['Model / Matching', 'SVM, kNN, CNN หรือเทียบระยะ', 'ส่งเวกเตอร์เข้าโมเดลให้ตอบคลาส หรือวัดระยะกับเวกเตอร์ของภาพในคลัง'],
  ];
  el.innerHTML = `<div class="flow">${steps.map((s, i) => `<button class="st" data-i="${i}"><i>${i + 1}</i><b>${s[0]}</b><span>${s[1]}</span></button>`).join('')}</div><p class="step-note"></p>
  <div class="apps"><span>Classification: ภาพนี้คือ “แมว”</span><span>Retrieval (CBIR): ค้นภาพที่คล้ายกัน</span><span>Detection: หาตำแหน่งวัตถุ</span></div>`;
  const pick = i => { $$('.st', el).forEach((b, j) => b.classList.toggle('on', j === i)); $('.step-note', el).textContent = steps[i][2]; };
  $$('.st', el).forEach(b => b.onclick = () => pick(+b.dataset.i)); pick(0);
};

F.histcompare = el => {
  const H1 = [1, 2, 3, 4], H2 = [2, 2, 2, 4];
  el.innerHTML = `<div class="f2"><div><p class="lab">H₁ = [1, 2, 3, 4] สีเข้ม &nbsp; H₂ = [2, 2, 2, 4] สีอ่อน</p><svg class="sv" viewBox="0 0 300 170" id="hb"></svg></div>
    <div>${segHTML('m', [['e', 'Euclidean'], ['c', 'χ² OpenCV'], ['s', 'χ² สมมาตร']], 'e')}<div class="read" id="hr" style="margin-top:16px"></div></div></div>`;
  const svg = $('#hb', el);
  let s = '';
  H1.forEach((v, i) => {
    const x = 20 + i * 70;
    s += `<rect x="${x}" y="${150 - v * 30}" width="26" height="${v * 30}" rx="3" class="f-sig"/>`;
    s += `<rect x="${x + 28}" y="${150 - H2[i] * 30}" width="26" height="${H2[i] * 30}" rx="3" class="f-sigs"/>`;
    s += `<text x="${x + 27}" y="166" text-anchor="middle" font-size="12" class="f-ink3">bin ${i + 1}</text>`;
    if (v !== H2[i]) s += `<text x="${x + 27}" y="${150 - Math.max(v, H2[i]) * 30 - 8}" text-anchor="middle" font-size="13" class="f-neg">ต่าง ${Math.abs(v - H2[i])}</text>`;
  });
  svg.innerHTML = s + `<line x1="10" x2="290" y1="150" y2="150" class="s-ink3"/>`;
  const show = m => {
    const d = H1.map((a, i) => a - H2[i]);
    let terms, total, line;
    if (m === 'e') { terms = d.map(x => `(${x})²`); total = Math.sqrt(d.reduce((s, x) => s + x * x, 0)); line = `√[ ${terms.join(' + ')} ]<br>= √2 ≈ <b>${fmt(total, 3)}</b>`; }
    if (m === 'c') { terms = d.map((x, i) => `${x * x}/${H1[i]}`); total = d.reduce((s, x, i) => s + x * x / H1[i], 0); line = `${terms.join(' + ')}<br>= 1 + 0 + 0.333 + 0 = <b>${fmt(total, 3)}</b>`; }
    if (m === 's') { terms = d.map((x, i) => `${x * x}/${H1[i] + H2[i]}`); total = .5 * d.reduce((s, x, i) => s + x * x / (H1[i] + H2[i]), 0); line = `½ ( ${terms.join(' + ')} )<br>= ½ × 0.533 = <b>${fmt(total, 3)}</b>`; }
    $('#hr', el).innerHTML = line + `<br><span style="color:var(--ink-2);font-family:var(--text);font-size:15px">ใกล้ 0 = เหมือนกันมาก ต่างกันแค่ bin 1 กับ bin 3</span>`;
  };
  onSeg(el, 'm', show); show('e');
};

F.hough = el => {
  el.innerHTML = `<p class="fig-title">แตะในกรอบซ้ายเพื่อเพิ่มหรือลบจุด แต่ละจุดกลายเป็นเส้นโค้งหนึ่งเส้นทางขวา จุดที่เส้นโค้งตัดกันมากที่สุดคือเส้นตรงที่ตรวจพบ</p>
  <div class="f2"><div><p class="lab">image space (x, y)</p><svg class="sv" viewBox="0 0 220 220" id="hi" style="background:var(--paper);border-radius:12px;touch-action:manipulation;cursor:crosshair"></svg></div>
  <div><p class="lab">Hough space (θ, r) ตารางโหวต</p><svg class="sv" viewBox="0 0 220 220" id="hp" style="background:var(--paper);border-radius:12px"></svg></div></div>
  <div class="controls">${segHTML('p', [['line', '3 จุดบนเส้นเดียว'], ['two', 'สองเส้น'], ['clear', 'ล้าง']], 'line')}</div><p class="step-note" id="hn"></p>`;
  const I = $('#hi', el), P = $('#hp', el);
  const presets = { line: [[30, 40], [80, 90], [140, 150]], two: [[30, 40], [80, 90], [140, 150], [40, 170], [110, 120], [170, 80]], clear: [] };
  let pts = presets.line.map(p => [...p]);
  const W = 200, R = Math.hypot(W, W);
  const draw = () => {
    // accumulator: theta 0..179 (1deg), r bins of 4
    const acc = new Map(); let best = null;
    pts.forEach(([x, y], pi) => {
      for (let t = 0; t < 180; t++) {
        const th = t * Math.PI / 180, r = x * Math.cos(th) + y * Math.sin(th);
        const key = t + ':' + Math.round(r / 4);
        const v = (acc.get(key) || 0) + 1; acc.set(key, v);
        if (!best || v > best.v) best = { v, t, r: Math.round(r / 4) * 4 };
      }
    });
    // image space
    let s = `<rect x="10" y="10" width="200" height="200" class="f-none s-rule"/>`;
    if (best && best.v >= 2) {
      const th = best.t * Math.PI / 180, c = Math.cos(th), sn = Math.sin(th);
      const p0 = [best.r * c, best.r * sn], d = [-sn, c];
      const a = [p0[0] - d[0] * 400, p0[1] - d[1] * 400], b = [p0[0] + d[0] * 400, p0[1] + d[1] * 400];
      s += `<clipPath id="hc"><rect x="10" y="10" width="200" height="200"/></clipPath><line clip-path="url(#hc)" x1="${a[0] + 10}" y1="${210 - a[1]}" x2="${b[0] + 10}" y2="${210 - b[1]}" class="s-sig" stroke-width="2.5"/>`;
    }
    pts.forEach(([x, y]) => s += `<circle cx="${x + 10}" cy="${210 - y}" r="6" class="f-ink"/>`);
    s += `<text x="12" y="224" font-size="11" class="f-ink3">0</text>`;
    I.innerHTML = s;
    // hough space: x = theta (0..180 → 10..210), y = r (-R..R → 210..10)
    let h = `<rect x="10" y="10" width="200" height="200" class="f-none s-rule"/><line x1="10" x2="210" y1="110" y2="110" class="s-rule"/>`;
    pts.forEach(([x, y]) => {
      let d = '';
      for (let t = 0; t <= 180; t += 3) { const th = t * Math.PI / 180, r = x * Math.cos(th) + y * Math.sin(th); d += (t ? 'L' : 'M') + (10 + t / 180 * 200).toFixed(1) + ',' + (110 - r / R * 100).toFixed(1); }
      h += `<path d="${d}" class="f-none s-ink3" stroke-width="1.6" opacity=".8"/>`;
    });
    if (best && best.v >= 2) h += `<circle cx="${10 + best.t / 180 * 200}" cy="${110 - best.r / R * 100}" r="8" class="f-none s-sig" stroke-width="3"/>`;
    h += `<text x="10" y="226" font-size="11" class="f-ink3">θ = 0°</text><text x="210" y="226" font-size="11" text-anchor="end" class="f-ink3">180°</text><text x="6" y="22" font-size="11" class="f-ink3">+r</text>`;
    P.innerHTML = h;
    $('#hn', el).innerHTML = !pts.length ? 'แตะในกรอบซ้ายเพื่อวางจุดขอบ' : best.v >= 2
      ? `จุดที่ได้โหวตมากที่สุดได้ <strong>${best.v} โหวต</strong> ที่ θ ≈ ${best.t}°, r ≈ ${best.r} จึงตรวจพบเส้นตรง r = x cos ${best.t}° + y sin ${best.t}°`
      : 'จุดเดียวยังเป็นเส้นได้ทุกทิศ ต้องมีอย่างน้อย 2 จุดที่โหวตตรงกัน';
  };
  I.addEventListener('pointerdown', e => {
    const p = svgPt(I, e), x = p.x - 10, y = 210 - p.y;
    if (x < 0 || x > 200 || y < 0 || y > 200) return;
    const hit = pts.findIndex(q => Math.hypot(q[0] - x, q[1] - y) < 10);
    if (hit >= 0) pts.splice(hit, 1); else pts.push([x, y]);
    draw();
  });
  onSeg(el, 'p', v => { pts = presets[v].map(p => [...p]); draw(); });
  draw();
};

F.chaincode = el => {
  const shapes = {
    4: { pts: [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [4, 1], [4, 2], [4, 3], [3, 3], [2, 3], [1, 3], [0, 3], [0, 2], [0, 1], [0, 0]], dirs: { '1,0': 0, '0,-1': 1, '-1,0': 2, '0,1': 3 } },
    8: { pts: [[1, 0], [2, 0], [3, 0], [4, 1], [4, 2], [3, 3], [2, 3], [1, 3], [0, 2], [0, 1], [1, 0]], dirs: { '1,0': 0, '1,-1': 1, '0,-1': 2, '-1,-1': 3, '-1,0': 4, '-1,1': 5, '0,1': 6, '1,1': 7 } },
  };
  let mode = 4;
  el.innerHTML = `<div class="controls" style="margin:0 0 18px">${segHTML('d', [['4', '4 ทิศ'], ['8', '8 ทิศ']], 4)}</div>
  <div class="f2"><svg class="sv" viewBox="-30 -30 260 220" id="cs"></svg><svg class="sv" viewBox="-70 -70 140 140" id="cc" style="max-width:220px;justify-self:center"></svg></div><div id="cst"></div>`;
  const S = $('#cs', el), C = $('#cc', el);
  let stp;
  const compass = () => {
    const n = mode, ang = 360 / n;
    let s = '';
    for (let i = 0; i < n; i++) { const a = i * ang * Math.PI / 180, x = Math.cos(a) * 44, y = -Math.sin(a) * 44; s += `<line x1="0" y1="0" x2="${x}" y2="${y}" class="s-ink3" stroke-width="1.5"/><circle cx="${x * 1.28}" cy="${y * 1.28}" r="11" class="f-paper s-rule"/><text x="${x * 1.28}" y="${y * 1.28 + 4.5}" text-anchor="middle" font-size="13" class="mono" data-c="${i}">${i}</text>`; }
    C.innerHTML = s + `<circle r="4" class="f-ink"/>`;
  };
  const build = () => {
    const sh = shapes[mode], P = sh.pts, u = 46;
    const codes = P.slice(1).map((p, i) => sh.dirs[(p[0] - P[i][0]) + ',' + (p[1] - P[i][1])]);
    compass();
    $('#cst', el).innerHTML = '';
    stp = stepper($('#cst', el), () => codes.length + 1, k => {
      let s = '';
      for (let x = 0; x <= 4; x++) for (let y = 0; y <= 3; y++) s += `<circle cx="${x * u}" cy="${y * u}" r="2.5" class="f-ink3" opacity=".5"/>`;
      s += `<path d="M${P.map(p => p[0] * u + ',' + p[1] * u).join('L')}" class="f-none s-rule" stroke-width="3"/>`;
      if (k) s += `<path d="M${P.slice(0, k + 1).map(p => p[0] * u + ',' + p[1] * u).join('L')}" class="f-none s-sig" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
      const cur = P[k];
      s += `<circle cx="${P[0][0] * u}" cy="${P[0][1] * u}" r="7" class="f-ink"/><circle cx="${cur[0] * u}" cy="${cur[1] * u}" r="9" class="f-none s-sig" stroke-width="3"/>`;
      S.innerHTML = s;
      $$('[data-c]', C).forEach(t => t.setAttribute('class', 'mono' + (k && +t.dataset.c === codes[k - 1] ? ' f-sig' : '')));
      const done = codes.slice(0, k).join(' ');
      return k === 0 ? 'เริ่มที่จุดดำมุมซ้ายบน เดินตามเข็มนาฬิการอบขอบ แต่ละก้าวจดรหัสทิศจากเข็มทิศด้านขวา'
        : `ก้าวที่ ${k} ไปทิศรหัส <strong>${codes[k - 1]}</strong><br><span class="mono">${done}</span>${k === codes.length ? '<br>กลับถึงจุดเริ่ม ได้ chain code ครบ' : ''}`;
    });
  };
  onSeg(el, 'd', v => { mode = +v; build(); });
  build();
};

F.hog = el => {
  const I = [[10, 15, 20, 25, 30, 35], [12, 18, 24, 30, 36, 42], [14, 21, 28, 35, 42, 49], [16, 24, 32, 40, 48, 56], [18, 27, 36, 45, 54, 63], [20, 30, 40, 50, 60, 70]];
  el.innerHTML = `<p class="fig-title">ภาพ 6×6 จากสไลด์ แตะพิกเซลด้านในเพื่อดู gradient ของพิกเซลนั้น เส้นประคือขอบของ cell ขนาด 2×2</p>
  <div class="fx"><div>${gridHTML(I)}</div><div style="flex:1;min-width:240px"><div class="read" id="hgr"></div>
  <p class="lab" style="margin-top:22px">พิกเซลนี้โหวตลง bin ไหน (9 bins กว้าง 20°)</p><div class="mini-bars" id="hgb">${Array.from({ length: 9 }, (_, i) => `<div style="height:14%"><small>${i * 20}</small></div>`).join('')}</div></div></div>`;
  const cells = $$('.grid span', el);
  cells.forEach((c, i) => { const y = Math.floor(i / 6), x = i % 6; c.style.boxShadow = ''; if (x % 2 === 0 && x) c.style.borderLeft = '2px dashed var(--ink-3)'; if (y % 2 === 0 && y) c.style.borderTop = '2px dashed var(--ink-3)'; if (x === 0 || x === 5 || y === 0 || y === 5) c.style.opacity = .55; else c.style.cursor = 'pointer'; });
  const pick = (x, y) => {
    cells.forEach(c => c.classList.remove('hi', 'hot'));
    const at = (xx, yy) => cells[yy * 6 + xx];
    at(x, y).classList.add('hot'); [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].forEach(([a, b]) => at(a, b).classList.add('hi'));
    const gx = I[y][x + 1] - I[y][x - 1], gy = I[y + 1][x] - I[y - 1][x], m = Math.hypot(gx, gy);
    let th = Math.atan2(gy, gx) * 180 / Math.PI; if (th < 0) th += 180; th %= 180;
    const bin = Math.min(8, Math.floor(th / 20));
    $('#hgr', el).innerHTML = `Gx = I(x+1,y) − I(x−1,y) = ${I[y][x + 1]} − ${I[y][x - 1]} = <b>${gx}</b><br>Gy = I(x,y+1) − I(x,y−1) = ${I[y + 1][x]} − ${I[y - 1][x]} = <b>${gy}</b><br>|G| = √(${gx}² + ${gy}²) = √${gx * gx + gy * gy} ≈ <b>${fmt(m, 1)}</b><br>θ = arctan(${gy}/${gx}) ≈ <b>${fmt(th, 1)}°</b> → bin ${bin} (${bin * 20}–${bin * 20 + 20}°)`;
    $$('#hgb div', el).forEach((d, i) => { d.classList.toggle('on', i === bin); d.style.height = (i === bin ? 30 + Math.min(70, m * 2.5) : 14) + '%'; });
  };
  cells.forEach((c, i) => { const y = Math.floor(i / 6), x = i % 6; if (x > 0 && x < 5 && y > 0 && y < 5) c.onclick = () => pick(x, y); });
  pick(2, 2);
};

F.glcm = el => {
  const img = [[0, 0, 1, 1], [0, 0, 1, 1], [0, 2, 2, 2], [2, 2, 3, 3]];
  const pairs = []; img.forEach((r, y) => r.forEach((v, x) => { if (x < 3) pairs.push([y, x]); }));
  el.innerHTML = `<p class="fig-title">ทิศ 0° (เพื่อนบ้านด้านขวา) ระยะ d = 1 กดถัดไปเพื่อนับทีละคู่</p>
  <div class="fx"><div><p class="lab">ภาพ 4×4 ระดับสี 0 ถึง 3</p>${gridHTML(img)}</div>
  <div><p class="lab">GLCM แถว i = ค่าซ้าย คอลัมน์ j = ค่าขวา</p><div class="grid" id="gm" style="grid-template-columns:repeat(5,auto)"></div></div></div><div id="gs"></div>`;
  const ic = $$('.grid span', el).slice(0, 16), gm = $('#gm', el);
  stepper($('#gs', el), () => pairs.length + 2, k => {
    const G = [0, 1, 2, 3].map(() => [0, 0, 0, 0]);
    const n = Math.min(k, pairs.length);
    for (let t = 0; t < n; t++) { const [y, x] = pairs[t]; G[img[y][x]][img[y][x + 1]]++; }
    ic.forEach(c => c.classList.remove('hi', 'hot'));
    let cur = null;
    if (k >= 1 && k <= pairs.length) { const [y, x] = pairs[k - 1]; ic[y * 4 + x].classList.add('hot'); ic[y * 4 + x + 1].classList.add('hi'); cur = [img[y][x], img[y][x + 1]]; }
    const norm = k === pairs.length + 1;
    let h = '<span style="background:none"></span>' + [0, 1, 2, 3].map(j => `<span style="background:none;color:var(--ink-3)">j=${j}</span>`).join('');
    G.forEach((r, i) => { h += `<span style="background:none;color:var(--ink-3)">i=${i}</span>` + r.map((v, j) => `<span class="${cur && cur[0] === i && cur[1] === j ? 'hot' : ''}" style="${v ? '' : 'color:var(--ink-3)'}${norm ? ';font-size:12px' : ''}">${norm ? (v ? fmt(v / 12, 2) : 0) : v}</span>`).join(''); });
    gm.innerHTML = h;
    if (k === 0) return 'แต่ละแถวของภาพมี 3 คู่ × 4 แถว = 12 คู่';
    if (norm) return 'Normalize: หารทุกช่องด้วย 12 ได้ p(i, j) ความน่าจะเป็นของแต่ละคู่ ผลรวมทั้งตารางเท่ากับ 1';
    return `คู่ที่ ${k}: (${cur[0]} → ${cur[1]}) เพิ่ม 1 ในช่อง GLCM[${cur[0]}][${cur[1]}]${k === pairs.length ? '<br>ครบ 12 คู่: (0,0)×2 (0,1)×2 (1,1)×2 (0,2)×1 (2,2)×3 (2,3)×1 (3,3)×1' : ''}`;
  });
};

F.moments = el => {
  el.innerHTML = `<div class="f2"><div><p class="lab">Skewness ความเบ้</p><svg class="sv" viewBox="0 0 300 150" id="ms"></svg><div class="controls">${segHTML('s', [['-1', 'ลบ'], ['0', '0'], ['1', 'บวก']], 1)}</div><p class="step-note" id="msn"></p></div>
  <div><p class="lab">Kurtosis ความโด่ง</p><svg class="sv" viewBox="0 0 300 150" id="mk"></svg><div class="controls">${segHTML('k', [['hi', '> 3'], ['n', '= 3'], ['lo', '< 3']], 'hi')}</div><p class="step-note" id="mkn"></p></div></div>`;
  const erf = x => { const t = 1 / (1 + .3275911 * Math.abs(x)); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - .284496736) * t + .254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; };
  const plot = (svg, f, x0, x1, extra = '') => {
    const N = 120, xs = [...Array(N + 1)].map((_, i) => x0 + (x1 - x0) * i / N), ys = xs.map(f), m = Math.max(...ys);
    const d = xs.map((x, i) => `${i ? 'L' : 'M'}${(10 + i / N * 280).toFixed(1)},${(130 - ys[i] / m * 110).toFixed(1)}`).join('');
    svg.innerHTML = `<path d="${d}L290,130L10,130Z" class="f-sigs"/><path d="${d}" class="f-none s-sig" stroke-width="2.5"/><line x1="10" x2="290" y1="130" y2="130" class="s-ink3"/><text x="10" y="146" font-size="11" class="f-ink3">มืด 0</text><text x="290" y="146" font-size="11" text-anchor="end" class="f-ink3">255 สว่าง</text>${extra}`;
  };
  const skew = v => {
    const a = +v * 6;
    plot($('#ms', el), x => 2 * Math.exp(-x * x / 2) * (.5 * (1 + erf(a * x / Math.SQRT2))), -3.2, 3.2);
    $('#msn', el).innerHTML = { '-1': 'หางยาวทางซ้าย พิกเซลส่วนใหญ่มีค่าสูง พื้นผิวส่วนใหญ่ <strong>สว่าง</strong>', '0': 'สมมาตร การกระจายความเข้มสมดุล', '1': 'หางยาวทางขวา พิกเซลส่วนใหญ่มีค่าต่ำ พื้นผิวส่วนใหญ่ <strong>มืด</strong>' }[v];
  };
  const kurt = v => {
    const b = { hi: 1, n: 2, lo: 7 }[v];
    plot($('#mk', el), x => Math.exp(-Math.pow(Math.abs(x), b)), -3, 3);
    $('#mkn', el).innerHTML = { hi: 'แหลม ความเข้มกระจุกตัว texture <strong>เรียบ สม่ำเสมอ</strong>', n: 'การกระจายแบบ normal', lo: 'แบน ความเข้มกระจายหลากหลาย texture <strong>หยาบ</strong>' }[v];
  };
  onSeg(el, 's', skew); onSeg(el, 'k', kurt); skew('1'); kurt('hi');
};

F.lbp = el => {
  const g = [[45, 38, 52], [41, 40, 43], [39, 46, 44]];
  const ring = [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 1], [2, 0], [1, 0]]; // clockwise from top-left
  el.innerHTML = `<p class="fig-title">หน้าต่าง 3×3 จากสไลด์ center = 40 เริ่มอ่านที่มุมซ้ายบน แล้วเวียนตามเข็มนาฬิกา</p>
  <div class="fx"><div>${gridHTML(g)}</div><div style="flex:1;min-width:220px"><div class="big-read mono" id="lb" style="font-family:var(--mono);letter-spacing:.12em">········</div><div class="read" id="ld" style="margin-top:10px"></div></div></div><div id="ls"></div>`;
  const c = $$('.grid span', el);
  stepper($('#ls', el), () => 10, k => {
    let bits = '';
    c.forEach((s, i) => { s.classList.remove('hi', 'hot'); s.textContent = g[Math.floor(i / 3)][i % 3]; });
    c[4].classList.add('hot');
    for (let t = 0; t < Math.min(k, 8); t++) {
      const [y, x] = ring[t], b = g[y][x] >= 40 ? 1 : 0; bits += b;
      c[y * 3 + x].textContent = b; c[y * 3 + x].style.color = b ? 'var(--signal)' : 'var(--ink-3)';
    }
    if (k < 8) ring.slice(Math.min(k, 8)).forEach(([y, x]) => c[y * 3 + x].style.color = '');
    if (k >= 1 && k <= 8) { const [y, x] = ring[k - 1]; c[y * 3 + x].classList.add('hi'); }
    $('#lb', el).textContent = (bits + '········').slice(0, 8);
    if (k === 0) { $('#ld', el).innerHTML = ''; return 'neighbor ≥ center ได้ 1, น้อยกว่าได้ 0'; }
    if (k <= 8) { const [y, x] = ring[k - 1], v = g[y][x]; $('#ld', el).innerHTML = ''; return `${v} ${v >= 40 ? '≥' : '<'} 40 ได้ <strong>${v >= 40 ? 1 : 0}</strong>`; }
    const w = [128, 64, 32, 16, 8, 4, 2, 1], sum = [...bits].reduce((s, b, i) => s + b * w[i], 0);
    $('#ld', el).innerHTML = [...bits].map((b, i) => b === '1' ? w[i] : null).filter(Boolean).join(' + ') + ` = <b>${sum}</b>`;
    return `${bits}₂ = <strong>${sum}</strong>₁₀ เป็นค่า LBP ของพิกเซลกลาง`;
  });
};

F.keypoints = el => {
  const shape = [[-40, 30], [-40, -10], [0, -45], [40, -10], [40, 30], [10, 30], [10, 5], [-10, 5], [-10, 30]];
  el.innerHTML = `<p class="fig-title">จุดสีคือ keypoint (มุม) ปรับมุมและขนาดของภาพขวา เส้นเชื่อมยังจับคู่จุดเดิมได้ถูก</p>
  <svg class="sv" viewBox="0 0 520 220" id="kp"></svg>
  <div style="display:grid;gap:6px;margin-top:12px;max-width:520px">
  <label class="slider-row">หมุน <input type="range" min="-180" max="180" value="35" id="kr"><output id="kro"></output></label>
  <label class="slider-row">ย่อ/ขยาย <input type="range" min="40" max="140" value="70" id="ks"><output id="kso"></output></label></div>`;
  const svg = $('#kp', el);
  const draw = () => {
    const a = +$('#kr', el).value * Math.PI / 180, s = +$('#ks', el).value / 100;
    $('#kro', el).textContent = $('#kr', el).value + '°'; $('#kso', el).textContent = '×' + s.toFixed(2);
    const L = shape.map(([x, y]) => [x + 120, y + 115]);
    const R = shape.map(([x, y]) => [x * s * Math.cos(a) - y * s * Math.sin(a) + 390, x * s * Math.sin(a) + y * s * Math.cos(a) + 110]);
    const poly = P => `<path d="M${P.map(p => p.map(v => v.toFixed(1)).join(',')).join('L')}Z" class="f-wash2 s-ink" stroke-width="2" stroke-linejoin="round"/>`;
    let h = `<rect x="10" y="10" width="220" height="200" rx="12" class="f-paper"/><rect x="290" y="10" width="220" height="200" rx="12" class="f-paper"/>` + poly(L) + poly(R);
    L.forEach((p, i) => h += `<line x1="${p[0]}" y1="${p[1]}" x2="${R[i][0]}" y2="${R[i][1]}" class="s-sig" stroke-width="1.2" opacity=".45"/>`);
    [...L, ...R].forEach(p => h += `<circle cx="${p[0]}" cy="${p[1]}" r="5" class="f-sig"/>`);
    svg.innerHTML = h;
  };
  $('#kr', el).oninput = $('#ks', el).oninput = draw; draw();
};

/* ============ Chapter 9 ============ */

const catSVG = (o = {}) => {
  const { body = 'var(--ink-2)', ear = 1, w = 1, eye = 'var(--paper)' } = o;
  return `<g><path d="M${-34 * w},-6 L${-30 * w},${-46 * ear} L${-12 * w},-26 Z M${34 * w},-6 L${30 * w},${-46 * ear} L${12 * w},-26 Z" style="fill:${body}"/>
  <ellipse cx="0" cy="0" rx="${38 * w}" ry="32" style="fill:${body}"/><ellipse cx="${-13 * w}" cy="-4" rx="5" ry="7" style="fill:${eye}"/><ellipse cx="${13 * w}" cy="-4" rx="5" ry="7" style="fill:${eye}"/><path d="M-5,10 L5,10 L0,15Z" style="fill:${eye}"/></g>`;
};
F.challenges = el => {
  const modes = [['base', 'ภาพปกติ'], ['view', 'Viewpoint'], ['scale', 'Scale'], ['light', 'Illumination'], ['clutter', 'Background clutter'], ['intra', 'Intraclass']];
  el.innerHTML = `<div class="controls" style="margin:0 0 18px">${segHTML('c', modes, 'base')}</div><svg class="sv" viewBox="0 0 520 200" id="cg" style="max-width:640px"></svg><p class="step-note" id="cgn"></p>`;
  const svg = $('#cg', el);
  let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const notes = { base: 'แมวหนึ่งตัวในภาพที่ถ่ายตรง ๆ แสงพอดี พื้นหลังเรียบ', view: 'มุมกล้องเปลี่ยน รูปร่างที่เห็นเปลี่ยนไปทั้งที่เป็นแมวตัวเดิม', scale: 'ขนาดในภาพต่างกันมาก โมเดลต้องรู้จักทั้งตัวใหญ่และตัวเล็ก', light: 'แสงน้อย ค่าพิกเซลทุกจุดเปลี่ยน แต่รูปร่างยังเหมือนเดิม', clutter: 'พื้นหลังมีสิ่งของสีใกล้กับวัตถุ วัตถุจึงกลืนไปกับฉาก', intra: 'แมวทุกตัวอยู่ในคลาสเดียวกัน แต่รูปร่าง ขนาด หูต่างกันมาก' };
  const draw = m => {
    let h = `<rect x="0" y="0" width="520" height="200" rx="14" class="f-paper"/>`;
    if (m === 'clutter') { seed = 3; for (let i = 0; i < 46; i++) h += `<ellipse cx="${rnd() * 520}" cy="${rnd() * 200}" rx="${10 + rnd() * 30}" ry="${8 + rnd() * 22}" transform="rotate(${rnd() * 180})" style="fill:var(--ink-3);opacity:${.25 + rnd() * .5}"/>`; }
    if (m === 'intra') h += [[110, 1, 1.25, 'var(--ink-2)'], [260, 1.5, .8, 'var(--ink-3)'], [410, .7, 1, 'var(--ink)']].map(([x, e, w, c]) => `<g transform="translate(${x},115)">${catSVG({ ear: e, w, body: c })}</g>`).join('');
    else {
      const t = { base: 'translate(260,112)', view: 'translate(260,112) skewY(-18) scale(.62,1)', scale: 'translate(400,150) scale(.32)', light: 'translate(260,112)', clutter: 'translate(260,112)' }[m];
      h += `<g transform="${t}">${catSVG()}</g>`;
    }
    if (m === 'light') h += `<rect x="0" y="0" width="520" height="200" rx="14" style="fill:#000;opacity:.72"/>`;
    svg.innerHTML = h; $('#cgn', el).textContent = notes[m];
  };
  onSeg(el, 'c', draw); draw('base');
};

F.mlvsdl = el => {
  const row = (items) => `<div class="flow cols" style="--cols:${items.map(i => i[2] || '1fr').join(' ')}">${items.map(([b, s]) => `<div class="st" style="cursor:default"><b>${b}</b><span>${s}</span></div>`).join('')}</div>`;
  el.innerHTML = `<p class="lab">1 Traditional machine learning</p>${row([['Raw input', 'ภาพดิบ'], ['Feature engineering', 'คนเลือกและออกแบบ feature เช่น HOG'], ['Features', 'เวกเตอร์ตัวเลข'], ['ML model', 'เช่น SVM'], ['Output', 'Cat / Not cat']])}
  <p class="lab" style="margin-top:22px">2 Deep learning</p>${row([['Raw input', 'ภาพดิบ'], ['Feature learning + classification', 'CNN เรียน feature เองและจำแนกในโมเดลเดียว', '3fr'], ['Output', 'Cat / Not cat']])}`;
};

F.cnnarch = el => {
  const L = [
    ['Input', '28×28×1', 'ภาพเทาขนาด 28×28', 'in'],
    ['Conv + ReLU', '26×26×8', 'filter 3×3 จำนวน 8 ตัว stride 1 ไม่มี padding: (28−3)/1+1 = 26 ได้ feature map 8 แผ่น', 'fe'],
    ['Pooling', '13×13×8', 'max pooling 2×2 ลดขนาดครึ่งหนึ่ง จำนวนแผ่นเท่าเดิม', 'fe'],
    ['Conv + ReLU', '11×11×16', 'filter 3×3 จำนวน 16 ตัว ได้ feature ที่ซับซ้อนขึ้น', 'fe'],
    ['Pooling', '5×5×16', 'max pooling 2×2 อีกครั้ง (11/2 ปัดลงเป็น 5)', 'fe'],
    ['Flatten', '400', 'เรียง 5×5×16 = 400 ค่าเป็นเวกเตอร์ 1 มิติ', 'cl'],
    ['Fully connected', '64', 'ทุกนิวรอนเชื่อมกับทุกค่าของชั้นก่อน z = Σwx + b แล้วผ่าน ReLU', 'cl'],
    ['Softmax', '3', 'ให้ความน่าจะเป็น 3 คลาส เช่น ม้าลาย 0.7 ม้า 0.2 หมา 0.1 รวมกันเท่ากับ 1', 'cl'],
  ];
  el.innerHTML = `<div class="flow arch">${L.map((l, i) => `<button class="st" data-i="${i}" style="${l[3] === 'cl' ? 'background:var(--signal-soft)' : ''}"><b>${l[0]}</b><span class="mono">${l[1]}</span></button>`).join('')}</div>
  <p class="lab" style="margin-top:12px">สีขาว = ส่วน feature extraction &nbsp; สีฟ้า = ส่วน classification</p><p class="step-note" id="can"></p>`;
  const pick = i => { $$('.st', el).forEach((b, j) => b.classList.toggle('on', j === i)); $('#can', el).textContent = L[i][2]; };
  $$('.st', el).forEach(b => b.onclick = () => pick(+b.dataset.i)); pick(1);
};

const IMG6 = [[1, 0, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0], [0, 0, 1, 1, 0, 0], [1, 0, 0, 0, 1, 0], [0, 1, 0, 0, 1, 0], [0, 0, 1, 0, 1, 0]];
const FIL = { 1: [[1, -1, -1], [-1, 1, -1], [-1, -1, 1]], 2: [[-1, 1, -1], [-1, 1, -1], [-1, 1, -1]] };
const conv = (f, s) => { const o = Math.floor((6 - 3) / s) + 1, out = []; for (let y = 0; y < o; y++) { out.push([]); for (let x = 0; x < o; x++) { let v = 0; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) v += IMG6[y * s + i][x * s + j] * f[i][j]; out[y].push(v); } } return out; };

F.conv = el => {
  let fi = '1', s = 1;
  el.innerHTML = `<div class="controls" style="margin:0 0 20px">${segHTML('f', [['1', 'Filter 1 (ทแยง)'], ['2', 'Filter 2 (แนวตั้ง)']], 1)}${segHTML('s', [['1', 'stride 1'], ['2', 'stride 2']], 1)}</div>
  <div class="fx"><div><p class="lab">ภาพ 6×6</p><div id="ci"></div></div><div><p class="lab">filter</p><div id="cf"></div></div><div><p class="lab">feature map</p><div id="co"></div></div></div><div id="cst"></div>`;
  let st;
  const build = () => {
    const f = FIL[fi], out = conv(f, s), o = out.length;
    $('#ci', el).innerHTML = gridHTML(IMG6, 'sm'); $('#cf', el).innerHTML = gridHTML(f, 'sm');
    $$('#cf span', el).forEach((c, i) => { if (f[Math.floor(i / 3)][i % 3] < 0) c.classList.add('neg'); });
    $('#co', el).innerHTML = gridHTML(out.map(r => r.map(() => '')), 'sm');
    $('#cst', el).innerHTML = '';
    st = stepper($('#cst', el), () => o * o, k => {
      const y = Math.floor(k / o), x = k % o;
      $$('#ci span', el).forEach((c, i) => { const yy = Math.floor(i / 6), xx = i % 6; c.classList.toggle('hi', yy >= y * s && yy < y * s + 3 && xx >= x * s && xx < x * s + 3); });
      $$('#co span', el).forEach((c, i) => { c.textContent = i <= k ? out[Math.floor(i / o)][i % o] : ''; c.classList.toggle('hot', i === k); c.classList.toggle('neg', i <= k && out[Math.floor(i / o)][i % o] < 0); });
      const terms = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const p = IMG6[y * s + i][x * s + j]; if (p) terms.push(f[i][j]); }
      return `ตำแหน่ง (${y}, ${x}): คูณทีละช่องแล้วรวม ช่องที่ภาพเป็น 0 ไม่มีผล เหลือ ${terms.length ? terms.map(t => t < 0 ? `(${t})` : t).join(' + ') : '0'} = <strong>${out[y][x]}</strong>`
        + (k === o * o - 1 ? `<br>ได้ feature map ${o}×${o} ตามสูตร (6 − 3)/${s} + 1 ${s === 2 ? 'ปัดลง ' : ''}= ${o}` : '');
    });
  };
  onSeg(el, 'f', v => { fi = v; build(); }); onSeg(el, 's', v => { s = +v; build(); });
  build();
};

F.activation = el => {
  const fns = { relu: [z => Math.max(0, z), 'max(0, z)', -1, 4], sig: [z => 1 / (1 + Math.exp(-z)), '1 / (1 + e^−z)', 0, 1], tanh: [z => Math.tanh(z), 'tanh(z)', -1, 1] };
  let cur = 'relu';
  el.innerHTML = `<div class="controls" style="margin:0 0 16px">${segHTML('a', [['relu', 'ReLU'], ['sig', 'Sigmoid'], ['tanh', 'Tanh']], 'relu')}</div>
  <div class="f2"><svg class="sv" viewBox="0 0 300 200" id="ap" style="background:var(--paper);border-radius:12px"></svg>
  <div><label class="slider-row">z <input type="range" min="-4" max="4" step="0.1" value="2" id="az"><output id="azo"></output></label>
  <p class="big-read" id="av" style="margin:22px 0 6px"></p><p class="muted" id="an" style="font-size:16px"></p></div></div>`;
  const svg = $('#ap', el);
  const X = z => 150 + z * 34, Y = (v, lo, hi) => 170 - (v - lo) / (hi - lo) * 140;
  const draw = () => {
    const [f, name, lo, hi] = fns[cur], z = +$('#az', el).value, v = f(z);
    let d = ''; for (let i = 0; i <= 80; i++) { const zz = -4 + i * .1; d += (i ? 'L' : 'M') + X(zz).toFixed(1) + ',' + Y(Math.min(hi, f(zz)), lo, hi).toFixed(1); }
    svg.innerHTML = `<line x1="14" x2="286" y1="${Y(0, lo, hi)}" y2="${Y(0, lo, hi)}" class="s-rule"/><line x1="150" x2="150" y1="20" y2="180" class="s-rule"/>
      <text x="282" y="${Y(0, lo, hi) - 6}" font-size="11" text-anchor="end" class="f-ink3">z</text><text x="156" y="28" font-size="11" class="f-ink3">${hi}</text>${lo !== 0 || cur === 'sig' ? `<text x="156" y="${Y(lo, lo, hi) - 4}" font-size="11" class="f-ink3">${lo}</text>` : ''}
      <path d="${d}" class="f-none s-sig" stroke-width="3"/><line x1="${X(z)}" x2="${X(z)}" y1="${Y(0, lo, hi)}" y2="${Y(Math.min(hi, v), lo, hi)}" class="s-ink3" stroke-dasharray="3 3"/><circle cx="${X(z)}" cy="${Y(Math.min(hi, v), lo, hi)}" r="6" class="f-ink"/>`;
    $('#azo', el).textContent = z.toFixed(1);
    $('#av', el).innerHTML = `f(${z.toFixed(1)}) = ${fmt(v, cur === 'relu' ? 1 : 3)}`;
    $('#an', el).innerHTML = { relu: 'z ≤ 0 ได้ 0 ส่วน z > 0 ได้ z เดิม ใช้หลัง convolution', sig: `ช่วง (0, 1) ใช้เป็นความน่าจะเป็นของ binary ${v >= .5 ? '≥ 0.5 → class 1' : '< 0.5 → class 0'}`, tanh: 'ช่วง [−1, 1] สมมาตรรอบ 0 ค่าลบยังคงเป็นลบ' }[cur];
  };
  onSeg(el, 'a', v => { cur = v; draw(); }); $('#az', el).oninput = draw; draw();
};

F.softmax = el => {
  const names = ['แมว', 'หมา', 'หนู'], z = [2, 1, .1];
  el.innerHTML = `<div class="f2"><div style="display:grid;gap:6px">${names.map((n, i) => `<label class="slider-row">z (${n}) <input type="range" min="-2" max="4" step="0.1" value="${z[i]}" data-i="${i}"><output></output></label>`).join('')}</div>
  <div><div id="sb" style="display:grid;gap:12px"></div><div class="read" id="sr" style="margin-top:14px"></div></div></div>`;
  const draw = () => {
    $$('input', el).forEach((r, i) => { z[i] = +r.value; r.nextElementSibling.textContent = z[i].toFixed(1); });
    const e = z.map(Math.exp), S = e.reduce((a, b) => a + b, 0), p = e.map(x => x / S), top = p.indexOf(Math.max(...p));
    $('#sb', el).innerHTML = p.map((v, i) => `<div style="display:grid;grid-template-columns:44px 1fr 60px;gap:10px;align-items:center;font-size:15px"><span>${names[i]}</span><div style="height:26px;background:var(--wash-2);border-radius:7px;overflow:hidden"><div style="height:100%;width:${v * 100}%;background:${i === top ? 'var(--signal)' : 'var(--ink-3)'};border-radius:7px;transition:width .25s"></div></div><span class="mono" style="text-align:right">${(v * 100).toFixed(1)}%</span></div>`).join('');
    $('#sr', el).innerHTML = `e^z = ${e.map(x => fmt(x, 3)).join(', ')}<br>Σ = ${fmt(S, 3)}<br>p = ${p.map(x => fmt(x, 3)).join(' + ')} = <b>1</b><br><span style="font-family:var(--text)">ตอบ “${names[top]}”</span>`;
  };
  $$('input', el).forEach(r => r.oninput = draw); draw();
};

F.pool = el => {
  const relu = m => m.map(r => r.map(v => Math.max(0, v)));
  const maps = [relu(conv(FIL[1], 1)), relu(conv(FIL[2], 1))];
  let mode = 'max';
  el.innerHTML = `<p class="fig-title">feature map หลัง ReLU ของ filter 1 และ filter 2 แตะช่อง output เพื่อดูว่ามาจากบล็อกไหน</p>
  <div class="controls" style="margin:0 0 18px">${segHTML('p', [['max', 'Max pooling'], ['avg', 'Average pooling']], 'max')}</div>
  <div class="fx">${maps.map((m, k) => `<div><p class="lab">filter ${k + 1}: 4×4</p><div data-m="${k}">${gridHTML(m, 'sm')}</div></div><div><p class="lab">2×2</p><div data-o="${k}"></div></div>`).join('')}</div><p class="step-note" id="pn"></p>`;
  const pool = m => [0, 1].map(y => [0, 1].map(x => { const b = [m[2 * y][2 * x], m[2 * y][2 * x + 1], m[2 * y + 1][2 * x], m[2 * y + 1][2 * x + 1]]; return mode === 'max' ? Math.max(...b) : fmt(b.reduce((a, c) => a + c, 0) / 4, 2); }));
  const draw = (sel = [0, 0, 0]) => {
    maps.forEach((m, k) => {
      const o = pool(m); $(`[data-o="${k}"]`, el).innerHTML = gridHTML(o, 'sm');
      $$(`[data-o="${k}"] span`, el).forEach((c, i) => { c.style.cursor = 'pointer'; c.onclick = () => draw([k, Math.floor(i / 2), i % 2]); c.classList.toggle('hot', sel[0] === k && i === sel[1] * 2 + sel[2]); });
      $$(`[data-m="${k}"] span`, el).forEach((c, i) => { const y = Math.floor(i / 4), x = i % 4; c.classList.toggle('hi', sel[0] === k && Math.floor(y / 2) === sel[1] && Math.floor(x / 2) === sel[2]); });
    });
    const [k, y, x] = sel, m = maps[k], b = [m[2 * y][2 * x], m[2 * y][2 * x + 1], m[2 * y + 1][2 * x], m[2 * y + 1][2 * x + 1]];
    $('#pn', el).innerHTML = mode === 'max' ? `max(${b.join(', ')}) = <strong>${Math.max(...b)}</strong> เก็บแค่สัญญาณที่แรงที่สุดของบล็อก 4×4 จึงเหลือ 2×2 แล้ว flatten ทั้งสองแผ่นได้ 2×2×2 = 8 ค่า` : `(${b.join(' + ')}) / 4 = <strong>${fmt(b.reduce((a, c) => a + c, 0) / 4, 2)}</strong>`;
  };
  onSeg(el, 'p', v => { mode = v; draw(); }); draw();
};

/* ============ Chapter 10 ============ */

F.tasks = el => {
  const objs = [{ n: 'CAT', c: '#e0913a', x: 80, y: 120, rx: 42, ry: 34 }, { n: 'DOG', c: '#7a5a3c', x: 250, y: 105, rx: 62, ry: 52 }, { n: 'DUCK', c: '#e8c53a', x: 385, y: 140, rx: 26, ry: 20 }];
  el.innerHTML = `<div class="controls" style="margin:0 0 18px">${segHTML('t', [['cls', 'Classification'], ['loc', '+ Localization'], ['det', 'Object Detection'], ['seg', 'Instance Segmentation']], 'cls')}</div><svg class="sv" viewBox="0 0 460 230" id="tk" style="max-width:640px"></svg><p class="step-note" id="tkn"></p>`;
  const svg = $('#tk', el);
  const blob = (o, extra = '') => `<ellipse cx="${o.x}" cy="${o.y}" rx="${o.rx}" ry="${o.ry}" style="fill:${o.c}" ${extra}/><ellipse cx="${o.x - o.rx * .55}" cy="${o.y - o.ry * .85}" rx="${o.rx * .28}" ry="${o.ry * .4}" style="fill:${o.c}"/><ellipse cx="${o.x + o.rx * .55}" cy="${o.y - o.ry * .85}" rx="${o.rx * .28}" ry="${o.ry * .4}" style="fill:${o.c}"/>`;
  const box = (o, col) => `<rect x="${o.x - o.rx - 8}" y="${o.y - o.ry * 1.4}" width="${(o.rx + 8) * 2}" height="${o.ry * 2.5}" class="f-none" style="stroke:${col}" stroke-width="3" rx="3"/><rect x="${o.x - o.rx - 8}" y="${o.y - o.ry * 1.4 - 20}" width="${o.n.length * 10 + 34}" height="20" style="fill:${col}" rx="3"/><text x="${o.x - o.rx - 2}" y="${o.y - o.ry * 1.4 - 5}" font-size="12" class="f-paper" style="fill:#fff">${o.n} 0.9</text>`;
  const cols = ['#e5484d', '#2b50e8', '#1f9466'];
  const draw = m => {
    let h = `<rect width="460" height="230" rx="14" class="f-paper"/><rect y="180" width="460" height="50" style="fill:#7fae6a;opacity:.35"/>`;
    if (m === 'cls' || m === 'loc') {
      const o = { ...objs[0], x: 230, y: 118, rx: 70, ry: 56 };
      h += blob(o);
      if (m === 'loc') h += box(o, cols[0]);
      h += `<text x="230" y="222" text-anchor="middle" font-size="18" font-weight="650">CAT</text>`;
    } else {
      objs.forEach((o, i) => { h += blob(o, m === 'seg' ? `style="fill:${cols[i]};opacity:.75"` : ''); if (m === 'seg') h += `<ellipse cx="${o.x}" cy="${o.y}" rx="${o.rx}" ry="${o.ry}" style="fill:${cols[i]};opacity:.55"/><ellipse cx="${o.x - o.rx * .55}" cy="${o.y - o.ry * .85}" rx="${o.rx * .28}" ry="${o.ry * .4}" style="fill:${cols[i]};opacity:.55"/><ellipse cx="${o.x + o.rx * .55}" cy="${o.y - o.ry * .85}" rx="${o.rx * .28}" ry="${o.ry * .4}" style="fill:${cols[i]};opacity:.55"/>`; if (m === 'det') h += box(o, cols[i]); });
      h += `<text x="230" y="222" text-anchor="middle" font-size="18" font-weight="650">${objs.map((o, i) => `<tspan style="fill:${cols[i]}">${o.n}</tspan>`).join(', ')}</text>`;
    }
    svg.innerHTML = h;
    $('#tkn', el).textContent = { cls: 'วัตถุเดียว: บอกแค่ว่าภาพนี้คือแมว ไม่บอกตำแหน่ง', loc: 'วัตถุเดียว: บอกว่าเป็นแมวและวาดกรอบหนึ่งกรอบ', det: 'หลายวัตถุ: แต่ละตัวได้ชื่อคลาส กรอบ และ confidence ของตัวเอง', seg: 'หลายวัตถุ: ระบายทุกพิกเซลของแต่ละตัวตามรูปทรงจริง แยกเป็นรายชิ้น' }[m];
  };
  onSeg(el, 't', draw); draw('cls');
};

F.lifecycle = el => {
  const P = [['Scoping', ['Define project'], 0], ['Data', ['Define data and establish baseline', 'Label and organize data'], 1], ['Modeling', ['Select and train model', 'Perform error analysis'], 1], ['Deployment', ['Deploy in production', 'Monitor and maintain system'], 0]];
  el.innerHTML = `<div class="phase">${P.map(([n, s, hot]) => `<div class="${hot ? 'hot' : ''}"><b>${n}</b><ul>${s.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div><p class="lab" style="margin:14px 0 0">กรอบสีฟ้าคือสองช่วงที่สไลด์วงไว้ และเป็นสิ่งที่ทำใน workshop</p>`;
};

F.detectors = el => {
  el.innerHTML = `<div class="controls" style="margin:0 0 18px">${segHTML('d', [['two', 'Two-stage (R-CNN)'], ['one', 'One-stage (YOLO)']], 'two')}</div><svg class="sv" viewBox="0 0 460 220" id="dt" style="max-width:620px"></svg><div id="dts"></div>`;
  const svg = $('#dt', el);
  let seed = 5; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const scene = `<rect width="460" height="220" rx="14" class="f-paper"/><circle cx="150" cy="70" r="22" style="fill:var(--ink-2)"/><rect x="128" y="92" width="44" height="90" rx="12" style="fill:var(--ink-2)"/><rect x="250" y="120" width="150" height="62" rx="14" style="fill:var(--ink-3)"/><circle cx="285" cy="186" r="16" style="fill:var(--ink)"/><circle cx="370" cy="186" r="16" style="fill:var(--ink)"/>`;
  const final = `<rect x="118" y="40" width="64" height="146" class="f-none s-neg" stroke-width="3" rx="3"/><text x="122" y="34" font-size="13" class="f-neg">person 0.94</text><rect x="244" y="112" width="162" height="92" class="f-none s-sig" stroke-width="3" rx="3"/><text x="248" y="106" font-size="13" class="f-sig">car 0.91</text>`;
  let mode = 'two';
  const steps = {
    two: [['รับภาพเข้า', ''], ['เสนอบริเวณที่น่าจะมีวัตถุราว 2,000 กรอบ (ในภาพแสดงบางส่วน)', 'props'], ['นำแต่ละกรอบมาปรับขนาด (warp) แล้วส่งเข้า CNN ทีละกรอบ', 'one'], ['จำแนกแต่ละกรอบ: person? yes, car? yes, ที่เหลือเป็น background', 'final']],
    one: [['รับภาพเข้า', ''], ['แบ่งภาพเป็นกริด ทุกช่องทำนายกรอบและคลาสพร้อมกันในครั้งเดียว', 'grid'], ['คัดกรอบที่ confidence ต่ำทิ้ง เหลือคำตอบสุดท้าย', 'final']],
  };
  const build = () => {
    $('#dts', el).innerHTML = '';
    stepper($('#dts', el), () => steps[mode].length, k => {
      const [txt, what] = steps[mode][k];
      let h = scene;
      if (what === 'props' || what === 'one') { seed = 5; for (let i = 0; i < 26; i++) { const w = 30 + rnd() * 120, hh = 30 + rnd() * 120; h += `<rect x="${rnd() * (440 - w) + 10}" y="${rnd() * (200 - hh) + 10}" width="${w}" height="${hh}" class="f-none s-ink3" stroke-width="1.2" opacity="${what === 'one' ? .25 : .7}"/>`; } }
      if (what === 'one') h += `<rect x="118" y="40" width="64" height="146" class="f-none s-sig" stroke-width="3"/><text x="230" y="30" font-size="13" class="f-sig">→ CNN → feature → classify (ทำซ้ำทุกกรอบ)</text>`;
      if (what === 'grid') { for (let i = 1; i < 7; i++) h += `<line x1="${i * 460 / 7}" x2="${i * 460 / 7}" y1="0" y2="220" class="s-sig" opacity=".35"/>`; for (let i = 1; i < 4; i++) h += `<line x1="0" x2="460" y1="${i * 55}" y2="${i * 55}" class="s-sig" opacity=".35"/>`; h += final.replace(/s-neg|s-sig/g, 's-ink3').replace(/f-neg|f-sig/g, 'f-ink3'); }
      if (what === 'final') h += final;
      svg.innerHTML = h;
      return txt + (k === steps[mode].length - 1 ? (mode === 'two' ? '<br>แม่นยำแต่ช้า เพราะเข้า CNN หลายพันครั้งต่อภาพ' : '<br>มองภาพครั้งเดียว จึงเร็วพอสำหรับ real-time') : '');
    });
  };
  onSeg(el, 'd', v => { mode = v; build(); }); build();
};

F.trainloop = el => {
  const N = [['1 Input data', 'โมเดลรับภาพแมวพร้อมเฉลย “cat”'], ['2 Predicted results', 'โมเดลทาย dog 0.7, cat 0.3'], ['3 Loss', 'เทียบกับเฉลย ทายผิดเยอะ loss สูง'], ['4 Back-propagation', 'ส่งความผิดพลาดย้อนกลับ หาว่าน้ำหนักตัวไหนทำให้ผิด'], ['5 Update weights', 'ปรับน้ำหนักทีละนิดตาม learning rate']];
  el.innerHTML = `<div class="f2"><svg class="sv cyc" viewBox="-180 -130 360 260" id="tl" style="max-width:380px;justify-self:center"></svg><div><p class="big-read" id="tlr"></p><p class="muted" id="tln" style="margin-top:10px;font-size:16px"></p></div></div><div id="tls"></div>`;
  const svg = $('#tl', el);
  const pos = N.map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return [Math.cos(a) * 92, Math.sin(a) * 92]; });
  stepper($('#tls', el), () => 16, k => {
    const it = Math.floor(k / 5), i = k % 5;
    const loss = [2.3, 1.1, .45, .2][Math.min(3, it)], pc = [.3, .58, .82, .93][Math.min(3, it)];
    let h = `<circle r="92" class="f-none s-rule" stroke-width="2"/>`;
    pos.forEach(([x, y], j) => {
      const anc = x < -10 ? 'end' : x > 10 ? 'start' : 'middle', tx = x + (x < -10 ? -18 : x > 10 ? 18 : 0), ty = y + (Math.abs(x) <= 10 ? (y < 0 ? -20 : 28) : y > 0 ? 24 : 5);
      h += `<circle cx="${x}" cy="${y}" r="${j === i ? 13 : 9}" class="${j === i ? 'f-sig' : 'f-paper s-ink3'}" stroke-width="2"/><text x="${tx}" y="${ty}" text-anchor="${anc}" font-size="12.5" class="${j === i ? 'f-sig' : 'f-ink2'}">${['Input', 'Predict', 'Loss', 'Backprop', 'Update'][j]}</text>`;
    });
    h += `<text y="-4" text-anchor="middle" font-size="13" class="f-ink3">รอบที่</text><text y="22" text-anchor="middle" font-size="26" font-weight="700">${it + 1}</text>`;
    svg.innerHTML = h;
    $('#tlr', el).innerHTML = `loss ${loss}`;
    $('#tln', el).innerHTML = `ตอนนี้ทาย cat ${pc}`;
    return `<strong>${N[i][0]}</strong>: ${i === 1 ? `โมเดลทาย cat ${pc}, dog ${fmt(1 - pc, 2)}` : N[i][1]}${k === 15 ? '<br>ขั้นที่ 6 คือวนซ้ำ 1 ถึง 5 ไปเรื่อย ๆ loss ลดลงทุกรอบ' : ''}`;
  });
};

F.batch = el => {
  el.innerHTML = `<div style="display:grid;gap:6px;max-width:560px">
  <label class="slider-row">ภาพ <input type="range" min="100" max="5000" step="100" value="1000" id="bn"><output></output></label>
  <label class="slider-row">batch <input type="range" min="0" max="6" step="1" value="4" id="bb"><output></output></label>
  <label class="slider-row">epochs <input type="range" min="1" max="50" step="1" value="10" id="be"><output></output></label></div>
  <div class="mets" style="grid-template-columns:repeat(2,minmax(0,1fr));max-width:560px"><div><small>steps ต่อ 1 epoch</small><b id="bs"></b><span id="bsf"></span></div><div><small>อัปเดตน้ำหนักทั้งหมด</small><b id="bt"></b><span id="btf"></span></div></div>
  <div id="bv" style="display:flex;flex-wrap:wrap;gap:3px;margin-top:18px;max-width:560px"></div>`;
  const B = [8, 16, 32, 64, 100, 128, 256];
  const draw = () => {
    const n = +$('#bn', el).value, b = B[+$('#bb', el).value], e = +$('#be', el).value, s = Math.ceil(n / b);
    $('#bn', el).nextElementSibling.textContent = n; $('#bb', el).nextElementSibling.textContent = b; $('#be', el).nextElementSibling.textContent = e;
    $('#bs', el).textContent = s; $('#bsf', el).textContent = `⌈${n} / ${b}⌉`;
    $('#bt', el).textContent = (s * e).toLocaleString(); $('#btf', el).textContent = `${s} × ${e} epochs`;
    $('#bv', el).innerHTML = Array.from({ length: Math.min(s, 120) }, (_, i) => `<i style="display:block;width:16px;height:16px;border-radius:4px;background:${i % 2 ? 'var(--signal)' : 'var(--ink-3)'};opacity:.85"></i>`).join('') + (s > 120 ? `<span class="lab" style="margin-left:6px">+${s - 120}</span>` : '');
  };
  $$('input', el).forEach(r => r.oninput = draw); draw();
};

F.confusion = el => {
  el.innerHTML = `<p class="fig-title">ตัวเลขจากสไลด์ ลองแก้ตัวเลขในตารางดู ทุก metric คำนวณใหม่ทันที</p>
  <div class="cm"><div></div><div class="h">ทายเป็นหมา</div><div class="h">ทายเป็นแมว</div>
  <div class="h">หมาจริง</div><div class="c tp"><input inputmode="numeric" value="90" data-k="tp"><small>TP</small></div><div class="c fn"><input inputmode="numeric" value="10" data-k="fn"><small>FN</small></div>
  <div class="h">แมวจริง</div><div class="c fp"><input inputmode="numeric" value="5" data-k="fp"><small>FP</small></div><div class="c tn"><input inputmode="numeric" value="95" data-k="tn"><small>TN</small></div></div>
  <div class="mets" id="cmm"></div>`;
  const draw = () => {
    const v = {}; $$('input', el).forEach(i => v[i.dataset.k] = Math.max(0, parseInt(i.value) || 0));
    const { tp, tn, fp, fn } = v, all = tp + tn + fp + fn;
    const acc = all ? (tp + tn) / all : 0, p = tp + fp ? tp / (tp + fp) : 0, r = tp + fn ? tp / (tp + fn) : 0, f1 = p + r ? 2 * p * r / (p + r) : 0;
    const pc = x => (x * 100).toFixed(1) + '%';
    $('#cmm', el).innerHTML = `<div><small>Accuracy</small><b>${pc(acc)}</b><span>(${tp}+${tn})/${all}</span></div><div><small>Precision</small><b>${pc(p)}</b><span>${tp}/(${tp}+${fp})</span></div><div><small>Recall</small><b>${pc(r)}</b><span>${tp}/(${tp}+${fn})</span></div><div><small>F1</small><b>${pc(f1)}</b><span>2PR/(P+R)</span></div>`;
  };
  $$('input', el).forEach(i => i.oninput = draw); draw();
};

F.threshold = el => {
  // 20 samples: score + true class (1 = dog)
  const S = [[.97, 1], [.93, 1], [.9, 1], [.86, 0], [.83, 1], [.78, 1], [.74, 1], [.69, 0], [.64, 1], [.58, 0], [.55, 1], [.5, 0], [.46, 1], [.41, 0], [.36, 0], [.31, 1], [.26, 0], [.2, 0], [.12, 0], [.06, 0]];
  el.innerHTML = `<p class="fig-title">จุดคือภาพ 20 ภาพเรียงตามความมั่นใจของโมเดลว่าเป็นหมา จุดฟ้าคือหมาจริง จุดเทาคือแมวจริง เลื่อน threshold แล้วดู P กับ R</p>
  <svg class="sv" viewBox="0 0 520 110" id="th"></svg>
  <label class="slider-row" style="max-width:520px">threshold <input type="range" min="0.02" max="0.98" step="0.01" value="0.5" id="tt"><output></output></label>
  <div class="mets" id="tm"></div>`;
  const svg = $('#th', el);
  const draw = () => {
    const t = +$('#tt', el).value; $('#tt', el).nextElementSibling.textContent = t.toFixed(2);
    let tp = 0, fp = 0, fn = 0, tn = 0;
    S.forEach(([s, y]) => { const p = s >= t; if (p && y) tp++; else if (p && !y) fp++; else if (!p && y) fn++; else tn++; });
    const X = s => 20 + s * 480;
    let h = `<rect x="${X(t)}" y="18" width="${500 - X(t)}" height="62" rx="8" class="f-sigs"/><line x1="20" x2="500" y1="50" y2="50" class="s-rule"/>`;
    S.forEach(([s, y], i) => h += `<circle cx="${X(s)}" cy="${50 + (i % 2 ? 12 : -12)}" r="8" class="${y ? 'f-sig' : 'f-ink3'}" ${s >= t ? '' : 'opacity=".55"'}/>`);
    h += `<line x1="${X(t)}" x2="${X(t)}" y1="10" y2="88" class="s-ink" stroke-width="2"/><text x="${X(t) + 6}" y="104" font-size="12" class="f-ink2">ทายว่าหมา →</text><text x="20" y="104" font-size="12" class="f-ink3">0</text><text x="500" y="104" font-size="12" text-anchor="end" class="f-ink3">1</text>`;
    svg.innerHTML = h;
    const p = tp + fp ? tp / (tp + fp) : 1, r = tp / (tp + fn), f1 = p + r ? 2 * p * r / (p + r) : 0;
    $('#tm', el).innerHTML = `<div><small>Precision</small><b>${(p * 100).toFixed(0)}%</b><span>${tp}/(${tp}+${fp})</span></div><div><small>Recall</small><b>${(r * 100).toFixed(0)}%</b><span>${tp}/(${tp}+${fn})</span></div><div><small>F1</small><b>${(f1 * 100).toFixed(0)}%</b><span>TP ${tp} FP ${fp}</span></div><div><small>พลาด / หลอน</small><b>${fn} / ${fp}</b><span>FN / FP</span></div>`;
  };
  $('#tt', el).oninput = draw; draw();
};

F.iou = el => {
  el.innerHTML = `<p class="fig-title">ลากกรอบสีฟ้า (กรอบที่โมเดลทาย) ให้ทับกรอบเขียว (กรอบจริง)</p>
  <div class="f2"><svg class="sv" viewBox="0 0 300 220" id="iu" style="background:var(--paper);border-radius:12px;touch-action:none"></svg>
  <div><p class="big-read" id="iv"></p><div class="read" id="ir" style="margin-top:10px"></div><p class="muted" id="iok" style="margin-top:10px;font-size:16px"></p></div></div>`;
  const svg = $('#iu', el), G = { x: 90, y: 50, w: 110, h: 120 };
  let P = { x: 140, y: 80, w: 110, h: 120 }, drag = null;
  const draw = () => {
    const ix = Math.max(0, Math.min(G.x + G.w, P.x + P.w) - Math.max(G.x, P.x)), iy = Math.max(0, Math.min(G.y + G.h, P.y + P.h) - Math.max(G.y, P.y));
    const I = ix * iy, U = G.w * G.h + P.w * P.h - I, v = I / U;
    svg.innerHTML = `<rect x="${G.x}" y="${G.y}" width="${G.w}" height="${G.h}" class="f-none s-pos" stroke-width="3"/>
      ${I ? `<rect x="${Math.max(G.x, P.x)}" y="${Math.max(G.y, P.y)}" width="${ix}" height="${iy}" class="f-sig" opacity=".3"/>` : ''}
      <rect x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}" class="f-sigs s-sig" fill-opacity=".25" stroke-width="3" style="cursor:grab"/>`;
    $('#iv', el).textContent = 'IoU = ' + v.toFixed(2);
    $('#ir', el).innerHTML = `ซ้อนกัน ${Math.round(I).toLocaleString()}<br>รวม ${Math.round(G.w * G.h).toLocaleString()} + ${Math.round(P.w * P.h).toLocaleString()} − ${Math.round(I).toLocaleString()} = ${Math.round(U).toLocaleString()}`;
    $('#iok', el).innerHTML = v >= .5 ? 'IoU ≥ 0.5 นับว่ากรอบนี้ <strong>ถูก</strong> (ถ้าคลาสถูกด้วยเป็น TP)' : 'IoU < 0.5 กรอบคลาดเคลื่อนเกินไป นับเป็น <strong>FP</strong>';
  };
  svg.addEventListener('pointerdown', e => { const p = svgPt(svg, e); if (p.x >= P.x && p.x <= P.x + P.w && p.y >= P.y && p.y <= P.y + P.h) { drag = { dx: p.x - P.x, dy: p.y - P.y }; svg.setPointerCapture(e.pointerId); } });
  svg.addEventListener('pointermove', e => { if (!drag) return; const p = svgPt(svg, e); P.x = Math.max(0, Math.min(300 - P.w, p.x - drag.dx)); P.y = Math.max(0, Math.min(220 - P.h, p.y - drag.dy)); draw(); });
  svg.addEventListener('pointerup', () => drag = null);
  draw();
};
})();
