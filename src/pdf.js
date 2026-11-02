/* Chhota sa PDF likhne wala engine — koi library nahi, sirf standard PDF commands.
   Guide ki PDF isi se banti hai (A4, Helvetica, roman urdu text). */

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M = 46;
const CONTENT_W = PAGE_W - M * 2;

const COLORS = {
  navy: [0.043, 0.106, 0.227],
  green: [0.043, 0.498, 0.349],
  greenSoft: [0.945, 0.98, 0.965],
  greenLine: [0.78, 0.91, 0.86],
  ink: [0.063, 0.094, 0.157],
  body: [0.278, 0.329, 0.408],
  faint: [0.6, 0.65, 0.71],
  line: [0.9, 0.914, 0.937],
  white: [1, 1, 1],
  bg: [0.965, 0.973, 0.984],
};

/* Helvetica ki character widths (per 1000 units) */
const HELV = {
  ' ': 278, '!': 278, '"': 355, '#': 556, '$': 556, '%': 889, '&': 667, "'": 191,
  '(': 333, ')': 333, '*': 389, '+': 584, ',': 278, '-': 333, '.': 278, '/': 278,
  ':': 278, ';': 278, '<': 584, '=': 584, '>': 584, '?': 556, '@': 1015,
  A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 500,
  K: 667, L: 556, M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611,
  U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
  '[': 278, '\\': 278, ']': 278, '^': 469, _: 556, '`': 333,
  a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222, j: 222,
  k: 500, l: 222, m: 833, n: 556, o: 556, p: 556, q: 556, r: 333, s: 500, t: 278,
  u: 556, v: 500, w: 722, x: 500, y: 500, z: 500,
  '{': 334, '|': 260, '}': 334, '~': 584,
  '0': 556, '1': 556, '2': 556, '3': 556, '4': 556, '5': 556, '6': 556, '7': 556, '8': 556, '9': 556,
};

const esc = s => String(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
  .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
  .replace(/[\u2013\u2014]/g, '-').replace(/\u00BD/g, '1/2').replace(/[^\x20-\x7E]/g, '');

function textWidth(str, size, bold = false) {
  let total = 0;
  for (const ch of String(str)) total += HELV[ch] ?? 556;
  return (total / 1000) * size * (bold ? 1.045 : 1);
}

function wrap(text, size, maxWidth, bold = false) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (textWidth(next, size, bold) > maxWidth && line) { lines.push(line); line = word; }
    else line = next;
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

const shopNameLine = (name) => `${esc(name)} ke liye`;

export function buildGuidePdf(sections, meta = {}) {
  const pages = [];
  let page = null;
  let y = 0;

  const ops = (...parts) => page.ops.push(...parts);
  const color = (name, stroke = false) => {
    const [r, g, b] = Array.isArray(name) ? name : (COLORS[name] || [0, 0, 0]);
    return stroke ? `${r} ${g} ${b} RG` : `${r} ${g} ${b} rg`;
  };
  const rect = (x, top, w, h, fill, radius = 0) => {
    const yy = top - h;
    ops(color(fill));
    if (!radius) { ops(`${x} ${yy} ${w} ${h} re f`); return; }
    const r = Math.min(radius, h / 2, w / 2);
    const k = 0.5523 * r;
    ops(`${x + r} ${yy} m`,
      `${x + w - r} ${yy} l`,
      `${x + w - r + k} ${yy} ${x + w} ${yy + r - k} ${x + w} ${yy + r} c`,
      `${x + w} ${yy + h - r} l`,
      `${x + w} ${yy + h - r + k} ${x + w - r + k} ${yy + h} ${x + w - r} ${yy + h} c`,
      `${x + r} ${yy + h} l`,
      `${x + r - k} ${yy + h} ${x} ${yy + h - r + k} ${x} ${yy + h - r} c`,
      `${x} ${yy + r} l`,
      `${x} ${yy + r - k} ${x + r - k} ${yy} ${x + r} ${yy} c`,
      'f');
  };
  const strokeRect = (x, top, w, h, strokeColor, radius = 0, width = 0.8) => {
    const yy = top - h;
    ops(`${width} w`, color(strokeColor, true));
    if (!radius) { ops(`${x} ${yy} ${w} ${h} re S`); return; }
    const r = Math.min(radius, h / 2, w / 2);
    const k = 0.5523 * r;
    ops(`${x + r} ${yy} m`,
      `${x + w - r} ${yy} l`,
      `${x + w - r + k} ${yy} ${x + w} ${yy + r - k} ${x + w} ${yy + r} c`,
      `${x + w} ${yy + h - r} l`,
      `${x + w} ${yy + h - r + k} ${x + w - r + k} ${yy + h} ${x + w - r} ${yy + h} c`,
      `${x + r} ${yy + h} l`,
      `${x + r - k} ${yy + h} ${x} ${yy + h - r + k} ${x} ${yy + h - r} c`,
      `${x} ${yy + r} l`,
      `${x} ${yy + r - k} ${x + r - k} ${yy} ${x + r} ${yy} c`,
      'S');
  };
  const text = (str, x, baseline, size, opts = {}) => {
    const font = opts.bold ? '/F2' : '/F1';
    ops(color(opts.color || 'ink'), 'BT', `${font} ${size} Tf`, `${x} ${baseline} Td`, `(${esc(str)}) Tj`, 'ET');
  };
  const circle = (cx, cy, r, fill) => {
    const k = 0.5523 * r;
    ops(color(fill), `${cx} ${cy + r} m`,
      `${cx + k} ${cy + r} ${cx + r} ${cy + k} ${cx + r} ${cy} c`,
      `${cx + r} ${cy - k} ${cx + k} ${cy - r} ${cx} ${cy - r} c`,
      `${cx - k} ${cy - r} ${cx - r} ${cy - k} ${cx - r} ${cy} c`,
      `${cx - r} ${cy + k} ${cx - k} ${cy + r} ${cx} ${cy + r} c`, 'f');
  };
  const line = (x1, y1, x2, y2, strokeColor, width = 0.8, dash = null) => {
    ops(color(strokeColor, true), `${width} w`);
    if (dash) ops(`[${dash}] 0 d`); else ops('[] 0 d');
    ops(`${x1} ${y1} m ${x2} ${y2} l S`, '[] 0 d');
  };

  const newPage = () => {
    page = { ops: [] };
    pages.push(page);
    y = PAGE_H - M;
  };

  const ensure = (height) => { if (y - height < M + 34) newPage(); };

  /* ---------------------------------------------------------------- cover */
  newPage();
  rect(0, PAGE_H, PAGE_W, PAGE_H, 'navy');
  circle(PAGE_W - 58, PAGE_H - 92, 104, [0.065, 0.135, 0.27]);
  circle(PAGE_W - 20, PAGE_H - 246, 46, [0.075, 0.15, 0.29]);

  text('AM DRESS POINT  -  CLOTH HOUSE', M, PAGE_H - 100, 10, { bold: true, color: 'faint' });
  text('Mukammal User Guide', M, PAGE_H - 142, 29, { bold: true, color: 'white' });
  wrap('Dukaan ka poora register chalane ka tareeqa - orders, naap, hisaab, karigar aur backup. Aasan alfaz mein, chhoti tasveeron ke sath.', 10.4, 340)
    .forEach((l, i) => text(l, M, PAGE_H - 168 - i * 15, 10.4, { color: [0.72, 0.78, 0.86] }));

  let coverY = PAGE_H - 244;
  text('IS GUIDE MEIN KYA HAI', M, coverY, 9.2, { bold: true, color: 'green' });
  coverY -= 46;
  sections.forEach((sec, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const bx = M + col * (CONTENT_W / 2 + 8);
    const by = coverY - row * 30;
    rect(bx, by + 12, 24, 19, 'greenSoft', 5);
    text(sec.no, bx + 7, by, 8.6, { bold: true, color: 'green' });
    const label = sec.title.replace(/\s*\(.*?\)/g, '').trim();
    text(label.length > 30 ? label.slice(0, 29) + '.' : label, bx + 32, by, 9.4, { color: [0.86, 0.9, 0.95] });
  });

  const boxTop = coverY - Math.ceil(sections.length / 2) * 30 - 8;
  rect(M, boxTop, CONTENT_W, 88, 'greenSoft', 10);
  text('ZAROORI BAAT', M + 18, boxTop - 22, 8.6, { bold: true, color: 'green' });
  wrap('Data aap ke phone mein rehta hai. Hafte mein aik baar Settings se backup download karein - yahi sab se bara bachao hai.', 9.2, CONTENT_W - 36)
    .forEach((l, i) => text(l, M + 18, boxTop - 40 - i * 12.5, 9.2, { color: [0.16, 0.32, 0.27] }));

  text(meta.dateText || '', M, M + 18, 9, { color: 'faint' });
  text(`${sections.length} hisse  -  ${meta.shopName ? shopNameLine(meta.shopName) : 'AM Dress Point'}`, M, M + 6, 9, { color: 'faint' });

  /* ------------------------------------------------------------- sections */
  /* Chhote "screens" — app ki asli screens jaisa vector naksha, asli labels ke sath. */
  const PILL = {
    naya: ['#f2f4f7', [0.28, 0.33, 0.41]],
    cutting: ['#fff7e6', [0.7, 0.37, 0.04]],
    silai: ['#fff3e9', [0.71, 0.28, 0.03]],
    fitting: ['#eef0ff', [0.21, 0.22, 0.8]],
    tayyar: ['#ecfdf3', [0.02, 0.46, 0.28]],
    diya: ['#e9f5f7', [0.05, 0.43, 0.51]],
  };
  const hexRgb = (hex) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const pill = (x, yTop, label, tone = 'naya', size = 6.8) => {
    const [bg, fg] = PILL[tone] || PILL.naya;
    const w = textWidth(label, size, true) + 12;
    rect(x, yTop, w, 12, hexRgb(bg), 6);
    circle(x + 6, yTop - 6, 1.5, fg);
    text(label, x + 9.5, yTop - 8.2, size, { bold: true, color: fg });
    return w;
  };
  const bar = (x, yTop, w, h, fill) => rect(x, yTop, w, h, fill, h / 2);

  const SCREENS = {
    shuruat: {
      title: 'AM Dress Point  ·  Dashboard',
      tiles: ['Naya order', 'Customer', 'Hisaab', 'Reports'],
      rows: [
        { t: 'Ahmed Khan', s: 'AD-1042 · 2 joray', pill: ['Silai', 'silai'] },
        { t: 'Bilal Aslam', s: 'AD-1038 · 1 jora', pill: ['Tayyar', 'tayyar'] },
      ],
      button: null,
    },
    dashboard: {
      title: 'Aaj ka kaam  ·  3 joray due',
      stats: [['Kaam jaari', '14 joray'], ['Aaj ki delivery', '3 joray']],
      rows: [
        { t: 'Ahmed Khan', s: 'AD-1042 · aaj', pill: ['Tayyar', 'tayyar'] },
        { t: 'Bilal Aslam', s: 'AD-1038 · late', pill: ['Cutting', 'cutting'] },
      ],
    },
    order: {
      title: 'Naya order  ·  AD-1043',
      fields: [['Customer', 'Ahmed Khan'], ['Kapray', 'Shalwar Kameez'], ['Joray / rate', '2  ·  3,200'], ['Delivery', '18 Nov 2026']],
      button: 'Order save karein',
    },
    naap: {
      title: 'Naap  ·  Shalwar Kameez',
      fields: [['Lambai', '42"'], ['Chaati', '24"'], ['Bazu', '23"'], ['Daman', '26"']],
      garment: true,
      pillTop: ['Live preview', 'tayyar'],
    },
    karigar: {
      title: 'Karigar  ·  mazdoori',
      rows: [
        { t: 'Akram', s: '6 joray', bar: 0.68, right: 'Rs. 4,800' },
        { t: 'Master Saleem', s: '4 joray', bar: 0.46, right: 'Rs. 3,200' },
        { t: 'Rashid', s: '3 joray', bar: 0.32, right: 'Rs. 2,100' },
      ],
    },
    hisaab: {
      title: 'Hisaab  ·  aaj',
      rows: [
        { t: 'Ahmed Khan', s: 'AD-1042 · payment', right: '+2,500', tone: 'in' },
        { t: 'Dhaaga aur button', s: 'Kharcha', right: '-1,200', tone: 'out' },
        { t: 'Bilal Aslam', s: 'AD-1038 · payment', right: '+4,000', tone: 'in' },
      ],
      total: [['AAJ KI WASOOLI', 'Rs. 6,500'], ['BAQAYA', 'Rs. 12,300']],
    },
    reports: {
      title: 'Reports  ·  pichlay 7 din',
      chart: [38, 62, 46, 78, 54, 88, 70],
      caption: 'Total wasooli  Rs. 94,500',
    },
    backup: {
      title: 'Settings  ·  backup',
      note: 'Is device ka data browser storage mein hai.',
      rows: [
        { t: 'Aakhri backup', s: 'Aaj, 9:40 baje', pill: ['Safe', 'tayyar'] },
        { t: 'Backup file', s: 'backup-2026-11-02.json', right: '24 KB' },
      ],
      button: 'Backup download karein',
      second: 'Backup restore karein',
    },
    sync: {
      title: 'Sync  ·  doosray device se',
      rows: [
        { t: 'Is device', s: 'Ahmed ka phone', pill: ['Synced', 'tayyar'] },
        { t: 'Doosra device', s: 'Ghar ka tablet', pill: ['Synced', 'tayyar'] },
      ],
      key: 'DD1.7fK2pQ9xR4tV8mN3bL6sW1yZ5aC',
      button: 'Key copy karein',
    },
    mobile: {
      title: 'Phone  ·  Home',
      rows: [
        { t: 'Ahmed Khan', s: 'AD-1042 · aaj', pill: ['Silai', 'silai'] },
      ],
      nav: ['Home', 'Orders', 'Naap', 'Hisaab', 'More'],
      fab: 'Naya order',
    },
    faq: {
      title: 'Aam sawal',
      qa: [
        ['Data kahan rehta hai?', 'Aap ke phone ke browser ke andar.'],
        ['Phone badalna ho to?', 'Backup download karein, naye phone par restore karein.'],
      ],
    },
  };

  const drawScreen = (section, x, top, w, h) => {
    const spec = SCREENS[section.id] || SCREENS.shuruat;
    rect(x, top, w, h, 'bg', 10);
    const px = x + 12;
    const pw = w - 24;
    let pt = top - 12;

    /* phone/desktop header */
    rect(px, pt, pw, 22, 'navy', 5);
    rect(px + 6, pt - 15, 11, 8, [0.16, 0.26, 0.44], 2);
    text(spec.title, px + 22, pt - 14.5, 8, { bold: true, color: 'white' });
    if (spec.pillTop && !spec.garment) pill(px + pw - 66, pt - 4, spec.pillTop[0], spec.pillTop[1], 6.2);
    pt -= 30;

    if (spec.chart) {
      const baseY = top - h + 28;
      const bw = (pw - 6 * 6) / 7;
      spec.chart.forEach((v, i) => {
        const vh = v * 0.62;
        rect(px + i * (bw + 6), baseY + vh, bw, vh, i === 5 ? 'green' : [0.87, 0.91, 0.89], 2.5);
      });
      text(spec.caption, px, top - h + 16, 7.4, { color: 'body' });
      return;
    }

    if (spec.qa) {
      spec.qa.forEach(([q, a], i) => {
        const y0 = pt - i * 34;
        rect(px, y0, pw * 0.72, 13, 'white', 6);
        strokeRect(px, y0, pw * 0.72, 13, 'line', 6);
        text(q, px + 7, y0 - 9, 7.2, { bold: true, color: 'ink' });
        rect(px + pw * 0.18, y0 - 20, pw * 0.82, 13, 'greenSoft', 6);
        text(a, px + pw * 0.18 + 7, y0 - 29, 6.8, { color: [0.08, 0.4, 0.29] });
      });
      return;
    }

    if (spec.tiles) {
      const tw = (pw - 3 * 6) / 4;
      spec.tiles.forEach((t, i) => {
        rect(px + i * (tw + 6), pt - 2, tw, 26, 'white', 5);
        strokeRect(px + i * (tw + 6), pt - 2, tw, 26, 'line', 5);
        circle(px + i * (tw + 6) + 9, pt - 10, 4, i === 0 ? 'greenSoft' : 'bg');
        text(t, px + i * (tw + 6) + 4, pt - 22, 6.2, { bold: true, color: 'body' });
      });
      pt -= 34;
    }

    if (spec.stats) {
      const sw = (pw - 8) / 2;
      spec.stats.forEach(([label, value], i) => {
        const sx = px + i * (sw + 8);
        rect(sx, pt - 2, sw, 28, 'white', 5);
        strokeRect(sx, pt - 2, sw, 28, 'line', 5);
        text(label, sx + 7, pt - 11, 6.4, { color: 'body' });
        text(value, sx + 7, pt - 22, 10.5, { bold: true, color: 'ink' });
      });
      pt -= 36;
    }

    if (spec.fields && !spec.garment) {
      const rows = spec.fields;
      rows.forEach(([label, value], i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const fx = px + col * ((pw + 6) / 2);
        const fy = pt - row * 29;
        text(label, fx, fy, 6.2, { color: 'body' });
        rect(fx, fy - 15, (pw - 6) / 2, 13, 'white', 4);
        strokeRect(fx, fy - 15, (pw - 6) / 2, 13, 'line', 4);
        text(value, fx + 5, fy - 11, 6.8, { bold: true, color: 'ink' });
      });
      pt -= Math.ceil(rows.length / 2) * 29;
    }

    if (spec.garment) {
      /* daayein taraf chhota kapra, baayein naap ke fields */
      const panelW = 70;
      const panelX = x + w - panelW - 12;
      const panelTop = top - 38;
      const panelH = h - 50;
      rect(panelX, panelTop, panelW, panelH, 'white', 8);
      strokeRect(panelX, panelTop, panelW, panelH, 'line', 8);

      const cxg = panelX + panelW / 2;
      const shoulder = panelTop - 26;
      const torsoBottom = shoulder - 32;
      const navy = [0.13, 0.19, 0.32];
      ops('q', color(navy));
      /* kameez */
      ops(`${cxg - 12} ${shoulder} m ${cxg + 12} ${shoulder} l ${cxg + 14} ${torsoBottom} l ${cxg - 14} ${torsoBottom} l f`);
      /* bazu */
      ops(`${cxg - 12} ${shoulder - 1} m ${cxg - 21} ${shoulder - 17} l ${cxg - 18} ${shoulder - 19} l ${cxg - 10} ${shoulder - 5} l f`);
      ops(`${cxg + 12} ${shoulder - 1} m ${cxg + 21} ${shoulder - 17} l ${cxg + 18} ${shoulder - 19} l ${cxg + 10} ${shoulder - 5} l f`);
      /* shalwar */
      ops(`${cxg - 8} ${torsoBottom} m ${cxg - 9} ${torsoBottom - 18} l ${cxg - 2} ${torsoBottom - 18} l ${cxg + 1} ${torsoBottom} l f`);
      ops(`${cxg + 8} ${torsoBottom} m ${cxg + 9} ${torsoBottom - 18} l ${cxg + 2} ${torsoBottom - 18} l ${cxg - 1} ${torsoBottom} l f`);
      ops('Q');
      /* gala */
      circle(cxg, shoulder + 1, 3.2, 'white');

      const colW = (panelX - px - 10) / 2;
      spec.fields.forEach(([label, value], i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const fx = px + col * (colW + 8);
        const fy = pt - row * 30;
        text(label, fx, fy, 6.2, { color: 'body' });
        rect(fx, fy - 15, colW, 13, 'white', 4);
        strokeRect(fx, fy - 15, colW, 13, 'line', 4);
        text(value, fx + 5, fy - 11, 6.8, { bold: true, color: 'ink' });
      });
      return;
    }

    if (spec.key) {
      rect(px, pt - 2, pw, 16, 'white', 4);
      strokeRect(px, pt - 2, pw, 16, 'line', 4);
      text(spec.key, px + 6, pt - 12, 6.6, { color: 'body' });
      pt -= 22;
      if (spec.note) { text(spec.note, px, pt, 6.6, { color: 'body' }); pt -= 12; }
    } else if (spec.note) {
      text(spec.note, px, pt, 6.8, { color: 'body' });
      pt -= 14;
    }

    (spec.rows || []).forEach((row) => {
      const rowH = row.bar ? 24 : 20;
      rect(px, pt, pw, rowH, 'white', 4);
      strokeRect(px, pt, pw, rowH, 'line', 4);
      circle(px + 10, pt - 9.5, 5, 'bg');
      text(row.t, px + 19, pt - 8.4, 7, { bold: true, color: 'ink' });
      text(row.s, px + 19, pt - 16, 5.8, { color: 'faint' });
      if (row.pill) pill(px + pw - (textWidth(row.pill[0], 6.4, true) + 20), pt - 3.5, row.pill[0], row.pill[1], 6.4);
      if (row.right) text(row.right, px + pw - textWidth(row.right, 7, true) - 7, pt - 12, 7, { bold: true, color: row.tone === 'out' ? 'red' : row.tone === 'in' ? 'green' : 'ink' });
      if (row.bar) {
        bar(px + 19, pt - rowH + 4, pw - 46, 2.6, COLORS.line);
        bar(px + 19, pt - rowH + 4, (pw - 46) * row.bar, 2.6, 'green');
      }
      pt -= rowH + 4;
    });

    if (spec.total) {
      const tw = (pw - 8) / 2;
      spec.total.forEach(([label, value], i) => {
        const tx = px + i * (tw + 8);
        rect(tx, pt - 2, tw, 24, 'white', 4);
        strokeRect(tx, pt - 2, tw, 24, 'line', 4);
        text(label, tx + 6, pt - 9, 5.6, { bold: true, color: 'faint' });
        text(value, tx + 6, pt - 19, 8.6, { bold: true, color: i === 1 ? 'red' : 'ink' });
      });
      pt -= 30;
    }

    if (spec.nav) {
      const navTop = top - h + 22;
      const navH = 18;
      rect(px, navTop, pw, navH, 'white', 6);
      strokeRect(px, navTop, pw, navH, 'line', 6);
      const nw = pw / spec.nav.length;
      spec.nav.forEach((n, i) => {
        const nx = px + i * nw;
        if (i === 0) rect(nx + 4, navTop - 2.5, nw - 8, navH - 5, 'green', 5.5);
        text(n, nx + nw / 2 - textWidth(n, 5.4, true) / 2, navTop - navH + 6.4, 5.4,
          { bold: true, color: i === 0 ? 'white' : 'faint' });
      });
      if (spec.fab) {
        const fw = textWidth(spec.fab, 6.4, true) + 18;
        const fx = px + pw / 2 - fw / 2;
        rect(fx, navTop + 14, fw, 13, 'green', 6.5);
        text(spec.fab, fx + 9, navTop + 18.4, 6.4, { bold: true, color: 'white' });
      }
      return;
    }

    if (spec.button) {
      const bw = textWidth(spec.button, 7, true) + 18;
      const byTop = Math.min(pt - 2, top - h + 20);
      rect(px, byTop, bw, 15, 'green', 5);
      text(spec.button, px + 9, byTop - 10.4, 7, { bold: true, color: 'white' });
      if (spec.second) {
        const sw2 = textWidth(spec.second, 6.6, true) + 16;
        rect(px + bw + 6, byTop, sw2, 15, 'white', 5);
        strokeRect(px + bw + 6, byTop, sw2, 15, 'line', 5);
        text(spec.second, px + bw + 14, byTop - 10.4, 6.6, { bold: true, color: 'body' });
      }
    }
  };

  const flowScreen = (section, x, top, w, h) => {
    rect(x, top, w, h, 'bg', 10);
    const px = x + 12;
    text('Kaam ka safar  ·  status', px, top - 18, 7.8, { bold: true, color: 'ink' });
    let cx0 = px;
    let pt = top - 38;
    ['Naya', 'Cutting', 'Silai', 'Fitting', 'Tayyar', 'Diya'].forEach((label, i) => {
      const tone = ['naya', 'cutting', 'silai', 'fitting', 'tayyar', 'diya'][i];
      const wPill = textWidth(label, 7, true) + 20;
      if (cx0 + wPill > x + w - 12) { cx0 = px; pt -= 18; }
      pill(cx0, pt, label, tone, 7);
      cx0 += wPill + 6;
    });
    text('Status badalne se dashboard, reports aur late ka nishan khud update hote hain.', px, top - h + 18, 6.8, { color: 'body' });
  };

  sections.forEach((s) => {
    const dh = s.id === 'status' ? 92 : 124;
    ensure(dh + 120);
    const badgeY = y;
    rect(M, badgeY, 30, 20, 'greenSoft', 6);
    text(s.no, M + 8, badgeY - 14, 9.4, { bold: true, color: 'green' });
    text(s.kicker, M + 40, badgeY - 14, 8.4, { bold: true, color: 'faint' });
    y = badgeY - 30;
    text(s.title, M, y, 16.5, { bold: true, color: 'ink' });
    y -= 8;
    line(M, y, PAGE_W - M, y, 'line', 0.8);
    y -= 18;

    wrap(s.intro, 9.8, CONTENT_W).forEach((l, i) => { text(l, M, y - i * 13.5, 9.8, { color: 'body' }); });
    y -= wrap(s.intro, 9.8, CONTENT_W).length * 13.5 + 12;

    if (s.id === 'status') flowScreen(s, M, y, CONTENT_W, dh);
    else drawScreen(s, M, y, CONTENT_W, dh);
    y -= dh + 20;

    (s.points || []).forEach(([label, body]) => {
      const lines = wrap(body, 9.4, CONTENT_W - 22);
      ensure(18 + lines.length * 12.5 + 6);
      circle(M + 3.5, y - 4, 2.6, 'green');
      text(label, M + 14, y, 10, { bold: true, color: 'ink' });
      lines.forEach((l, i) => text(l, M + 14, y - 12 - i * 12.5, 9.4, { color: 'body' }));
      y -= 16 + lines.length * 12.5;
    });

    if (s.tip) {
      const tipLines = wrap(s.tip, 9, CONTENT_W - 34);
      const boxH = 26 + tipLines.length * 12;
      ensure(boxH + 10);
      rect(M, y, CONTENT_W, boxH, 'greenSoft', 8);
      rect(M, y, 3, boxH, 'green', 1.5);
      text('TIP', M + 14, y - 14, 8, { bold: true, color: 'green' });
      tipLines.forEach((l, i) => text(l, M + 34, y - 14 - i * 12, 9, { color: [0.16, 0.32, 0.27] }));
      y -= boxH + 10;
    }
    y -= 16;
  });

  /* --------------------------------------------------------------- closing */
  ensure(150);
  y -= 10;
  rect(M, y, CONTENT_W, 124, 'navy', 12);
  text('SHUKRIYA', M + 22, y - 28, 8.6, { bold: true, color: [0.55, 0.68, 0.82] });
  text('Ab aap tayyar hain.', M + 22, y - 54, 18, { bold: true, color: 'white' });
  wrap('Pehla kaam: Settings mein dukaan ka naam likhein, sample data hatayein aur aik backup bana lein. Us ke baad pehla order likh dein.', 9.4, CONTENT_W - 44)
    .forEach((l, i) => text(l, M + 22, y - 76 - i * 13, 9.4, { color: [0.78, 0.84, 0.9] }));
  text('AM DRESS POINT  -  CLOTH HOUSE', M + 22, y - 108, 8.4, { bold: true, color: 'green' });

  /* ------------------------------------------------------------- footers */
  pages.forEach((p, i) => {
    if (i === 0) return;
    p.ops.push('0.9 0.914 0.937 RG', '0.8 w', `${M} ${M + 12} m ${PAGE_W - M} ${M + 12} l S`);
    p.ops.push(`${COLORS.faint.join(' ')} rg`, 'BT', '/F1 8.4 Tf', `${M} ${M - 2} Td`, '(AM Dress Point  -  Mukammal User Guide) Tj', 'ET');
    const num = `${i + 1} / ${pages.length}`;
    p.ops.push('BT', '/F1 8.4 Tf', `${PAGE_W - M - textWidth(num, 8.4)} ${M - 2} Td`, `(${num}) Tj`, 'ET');
  });

  return assemble(pages, meta);
}

function assemble(pages, meta) {
  const encoder = new TextEncoder();
  const objects = [];
  const add = (body) => { objects.push(body); return objects.length; };

  const fontRegular = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  const fontBold = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');

  const entries = pages.map(p => {
    const contentId = add({ stream: p.ops.join('\n') });
    const pageId = add(null);
    return { contentId, pageId };
  });

  const pagesId = add(null);
  const catalogId = add(null);
  const infoId = meta.title ? add(`<< /Title (${esc(meta.title)}) /Producer (AM Dress Point) /Creator (AM Dress Point) >>`) : null;

  objects[pagesId - 1] = `<< /Type /Pages /Count ${pages.length} /Kids [${entries.map(e => `${e.pageId} 0 R`).join(' ')}] >>`;
  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  entries.forEach(({ pageId, contentId }) => {
    objects[pageId - 1] = `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> /Contents ${contentId} 0 R >>`;
  });

  let out = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets = [];
  objects.forEach((body, i) => {
    offsets[i] = out.length;
    if (typeof body === 'string') out += `${i + 1} 0 obj\n${body}\nendobj\n`;
    else out += `${i + 1} 0 obj\n<< /Length ${encoder.encode(body.stream).length} >>\nstream\n${body.stream}\nendstream\nendobj\n`;
  });
  const xrefStart = out.length;
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 0; i < objects.length; i += 1) out += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  out += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R${infoId ? ` /Info ${infoId} 0 R` : ''} >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return out;
}

export function downloadPdf(sections, meta) {
  const raw = buildGuidePdf(sections, meta);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i) & 0xff;
  return new Blob([bytes], { type: 'application/pdf' });
}
