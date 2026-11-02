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
    const [r, g, b] = COLORS[name] || [0, 0, 0];
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
  const drawDiagram = (kind, x, top, w, h) => {
    rect(x, top, w, h, 'bg', 10);
    const px = x + 14;
    const pt = top - 16;
    const iw = w - 28;

    if (kind === 'flow') {
      const labels = ['Naya', 'Cutting', 'Silai', 'Fitting', 'Tayyar', 'Diya'];
      const gap = 7;
      const cw = (iw - gap * 5) / 6;
      labels.forEach((l, i) => {
        const cx0 = px + i * (cw + gap);
        const active = i === 4;
        rect(cx0, pt, cw, 22, active ? 'greenSoft' : 'white', 11);
        strokeRect(cx0, pt, cw, 22, active ? 'greenLine' : 'line', 11);
        text(l, cx0 + 7, pt - 14, 8.2, { bold: true, color: active ? 'green' : 'body' });
      });
      wrap('Status badalne se dashboard, reports aur late ka nishan khud update hote hain.', 8.4, iw)
        .forEach((l, i) => text(l, px, top - h + 26 + i * 11, 8.4, { color: 'body' }));
      return;
    }

    if (kind === 'bars') {
      const values = [26, 40, 30, 52, 36, 58, 46];
      const baseY = top - h + 26;
      const bw = (iw - 6 * 9) / 7;
      values.forEach((v, i) => {
        const vh = v * 0.92;
        rect(px + i * (bw + 9), baseY + vh, bw, vh, i === 5 ? 'green' : [0.87, 0.91, 0.89], 3);
        text(['S', 'M', 'T', 'W', 'T', 'F', 'S'][i], px + i * (bw + 9) + bw / 2 - 2.3, baseY - 7, 7.2, { color: 'faint' });
      });
      line(px, baseY + 0.5, px + iw, baseY + 0.5, 'line', 0.8);
      return;
    }

    if (kind === 'cards') {
      const gap = 9;
      const cw = (iw - gap * 2) / 3;
      [0, 1, 2].forEach((i) => {
        const cx0 = px + i * (cw + gap);
        const ch = h - 30;
        rect(cx0, pt, cw, ch, 'white', 8);
        strokeRect(cx0, pt, cw, ch, 'line', 8);
        circle(cx0 + 17, pt - 16, 8, i === 0 ? 'greenSoft' : 'bg');
        rect(cx0 + 30, pt - 14, cw - 42, 4.2, i === 0 ? 'greenLine' : 'line', 2);
        rect(cx0 + 10, pt - 31, cw - 20, 4.2, 'line', 2);
        rect(cx0 + 10, pt - 41, cw - 34, 4.2, 'line', 2);
      });
      return;
    }

    /* screen wireframe */
    rect(px, pt, iw, 26, 'navy', 6);
    rect(px + 9, pt - 11, iw * 0.32, 4.4, [0.42, 0.53, 0.7], 2);
    rect(px + 9, pt - 20, iw * 0.5, 6, 'white', 3);
    const tw = (iw - 3 * 7) / 4;
    [0, 1, 2, 3].forEach((i) => {
      const cx0 = px + i * (tw + 7);
      rect(cx0, pt - 34, tw, 20, 'white', 6);
      strokeRect(cx0, pt - 34, tw, 20, 'line', 6);
      circle(cx0 + 9, pt - 44, 4, i === 0 ? 'greenSoft' : 'bg');
      rect(cx0 + 17, pt - 46, tw - 24, 3.4, 'line', 1.7);
    });
    [0, 1].forEach((r) => {
      rect(px, pt - 44 - r * 11, iw, 8, 'white', 4);
      strokeRect(px, pt - 44 - r * 11, iw, 8, 'line', 4);
      circle(px + 8, pt - 48 - r * 11, 2.8, 'bg');
      rect(px + 15, pt - 49.4 - r * 11, iw * 0.34, 2.8, 'line', 1.4);
    });
  };

  const diagramFor = {
    intro: 'cards', dashboard: 'screen', order: 'screen', flow: 'flow', naap: 'cards',
    karigar: 'cards', paisa: 'bars', reports: 'bars', backup: 'cards', sync: 'cards',
    mobile: 'screen', faq: 'cards',
  };

  newPage();
  sections.forEach((s) => {
    ensure(128);
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

    const kind = diagramFor[s.visual] || 'cards';
    const dh = 72;
    if (y - dh < M + 40) newPage();
    drawDiagram(kind, M, y, CONTENT_W, dh);
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
