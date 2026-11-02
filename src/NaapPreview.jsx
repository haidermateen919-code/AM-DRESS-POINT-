import React from 'react';
import { Sparkles } from 'lucide-react';

/* Kapray ke rang — sirf visual pehchaan ke liye, naap ke sath save hote hain. */
export const FABRIC_COLORS = [
  { id: 'ivory', label: 'Ivory', hex: '#f0e9db' },
  { id: 'white', label: 'Safaid', hex: '#fbfbfb' },
  { id: 'sky', label: 'Asmani', hex: '#8fa9c2' },
  { id: 'navy', label: 'Navy', hex: '#22304d' },
  { id: 'charcoal', label: 'Charcoal', hex: '#3b4250' },
  { id: 'maroon', label: 'Maroon', hex: '#7d2f38' },
  { id: 'olive', label: 'Olive', hex: '#4d5b3c' },
  { id: 'beige', label: 'Beige', hex: '#cdb79a' },
];

export function fabricHex(id) {
  return (FABRIC_COLORS.find(c => c.id === id) || FABRIC_COLORS[0]).hex;
}
export function fabricLabel(id) {
  return (FABRIC_COLORS.find(c => c.id === id) || FABRIC_COLORS[0]).label;
}

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const num = (value, fallback, lo, hi) => {
  const n = parseFloat(String(value ?? '').replace(',', '.'));
  return Number.isFinite(n) ? clamp(n, lo, hi) : fallback;
};

/* Har qisam ke kapray ka naap — inches se seedha figure ke paimon mein. */
function GarmentFigure({ type, values, width, color, family }) {
  const widthMul = width === 'poora' ? 1.12 : width === 'mixed' ? 1.05 : 1;
  const fill = fabricHex(color);
  const light = ['ivory', 'white', 'beige', 'sky'].includes(color);
  const edge = light ? 'rgba(16,24,40,.30)' : 'rgba(0,0,0,.38)';
  const seam = light ? 'rgba(16,24,40,.18)' : 'rgba(255,255,255,.36)';
  const cx = 80;
  const hasUpper = family === 'upper' || family === 'full';
  const hasLower = family === 'lower' || family === 'full';

  /* kameez / kurta / shirt / waistcoat */
  const length = num(values.length, 38, 24, 50);
  const chest = num(values.chest, 22, 14, 34) * widthMul;
  const daman = num(values.daman, chest, 12, 42) * widthMul;
  const sleeve = num(values.sleeve, 17, 0, 32);
  const neck = num(values.neck, 15, 10, 22);

  const topY = 20;
  const shoulderHalf = 13 + (chest - 14) * 0.72;
  const torsoHalf = shoulderHalf + 1.5;
  const bodyH = 40 + (length - 24) * 2.05;
  const hemY = topY + bodyH;
  const hemHalf = clamp(torsoHalf + (daman - chest) * 0.5, torsoHalf - 3, torsoHalf + 11);

  /* shalwar / trouser */
  const lowerLength = num(values.shalwarLength ?? values.length, 40, 24, 52);
  const paincha = num(values.bottom, 14, 8, 24) * widthMul;
  const legLen = 32 + (lowerLength - 24) * 1.1;
  const waistY = hasUpper ? hemY - 9 : topY + 8;
  const legW = clamp(7 + paincha * 0.45, 10, 19);
  const waistHalf = clamp(9 + paincha * 0.5, 11, 21);
  const stride = clamp(5 + paincha * 0.28, 6, 14);
  const bottomY = hasLower ? waistY + legLen : hemY;

  /* poora figure hamesha frame ke andar rahe */
  const totalH = Math.max(40, bottomY - topY);
  const k = clamp(150 / totalH, .78, 1.2);
  const offsetY = (176 - totalH * k) / 2 - topY * k;

  const sl = type === 'Waistcoat' ? 0 : sleeve * 1.55;
  const sleeveW = clamp(6 + (chest - 14) * 0.3, 7, 12.5);
  const collarR = 3.6 + (neck - 10) * 0.42;

  return (
    <svg className="naap-figure" viewBox="0 0 160 176" role="img" aria-label={`${type} ka live naap preview`}>
      <defs>
        <linearGradient id="naapFabric" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity=".97" />
          <stop offset="100%" stopColor={fill} stopOpacity=".8" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="160" height="176" rx="14" fill="#f7f9fc" />
      <path d="M0 156h160" stroke="#e7e9ee" strokeDasharray="3 5" />
      <ellipse cx="80" cy="156" rx="34" ry="9" fill="#e9eef5" />

      <g transform={`translate(${80 - 80 * k} ${offsetY}) scale(${k})`}>
        {/* bazu (kapray ke neeche, isliye pehle) */}
        {hasUpper && sl > 0 && [-1, 1].map(side => (
          <path key={side}
            d={`M${cx + side * shoulderHalf * 0.86} ${topY + 7} L${cx + side * (shoulderHalf + sl * 0.42)} ${topY + 6 + sl * 0.82}`}
            fill="none" stroke="url(#naapFabric)" strokeWidth={sleeveW} strokeLinecap="round" />
        ))}

        {/* shalwar / trouser */}
        {hasLower && (
          <>
            <rect x={cx - waistHalf} y={waistY - 8} width={waistHalf * 2} height="16" rx="7"
              fill="url(#naapFabric)" stroke={edge} strokeWidth="1" />
            {[-1, 1].map(side => (
              <path key={side}
                d={`M${cx + side * stride * .4} ${waistY} L${cx + side * stride} ${waistY + legLen}`}
                fill="none" stroke="url(#naapFabric)" strokeWidth={legW} strokeLinecap="round" />
            ))}
            {[-1, 1].map(side => (
              <path key={'s' + side}
                d={`M${cx + side * stride * .4} ${waistY + 4} L${cx + side * stride} ${waistY + legLen - 2}`}
                fill="none" stroke={seam} strokeWidth="1" strokeDasharray="3 4" opacity=".65" />
            ))}
          </>
        )}

        {/* upper body */}
        {hasUpper && (
          <>
            <path
              d={`M${cx - shoulderHalf * 0.88} ${topY + 2}
                  Q${cx} ${topY - 4} ${cx + shoulderHalf * 0.88} ${topY + 2}
                  L${cx + shoulderHalf} ${topY + 11}
                  L${cx + hemHalf} ${hemY}
                  Q${cx} ${hemY + 2} ${cx - hemHalf} ${hemY}
                  L${cx - shoulderHalf} ${topY + 11} Z`}
              fill="url(#naapFabric)" stroke={edge} strokeWidth="1.2" strokeLinejoin="round" />
            {/* gala */}
            <path d={`M${cx - collarR} ${topY + 1.5} Q${cx} ${topY + 2 + collarR * 1.5} ${cx + collarR} ${topY + 1.5}`}
              fill="none" stroke={edge} strokeWidth="2.1" strokeLinecap="round" opacity=".9" />
            {type === 'Waistcoat' && (
              <path d={`M${cx - shoulderHalf * 0.55} ${topY + 3} L${cx} ${hemY - 14} L${cx + shoulderHalf * 0.55} ${topY + 3}`}
                fill="none" stroke={edge} strokeWidth="1.1" opacity=".55" />
            )}
            {/* placket + daman ki silai */}
            <path d={`M${cx} ${topY + 9} L${cx} ${hemY - 3}`} stroke={seam} strokeWidth="1" strokeDasharray="3 4" />
            <path d={`M${cx - hemHalf + 2} ${hemY - 6} Q${cx} ${hemY - 2.5} ${cx + hemHalf - 2} ${hemY - 6}`}
              fill="none" stroke={seam} strokeWidth="1" strokeDasharray="2 3" opacity=".8" />
          </>
        )}

        {/* lambai ki naap line */}
        <path d={`M13 ${topY} L13 ${bottomY}`} stroke="#aab4c2" strokeWidth="1" strokeDasharray="2 3" />
        <path d={`M10.5 ${topY} L15.5 ${topY} M10.5 ${bottomY} L15.5 ${bottomY}`} stroke="#aab4c2" strokeWidth="1" />
      </g>
    </svg>
  );
}

/**
 * Naap ka live preview — jo value badalti hai, figure usi hisaab se badalta hai.
 */
export default function NaapPreview({ type, values = {}, width = 'aadha', color, onColor, unit = 'inch' }) {
  const family = type === 'Shalwar' ? 'lower' : type === 'Trouser' ? 'lower' : type === 'Shalwar Kameez' ? 'full' : 'upper';
  const safe = values || {};
  const suffix = unit === 'cm' ? ' cm' : '″';
  const rows = [];
  const push = (label, value) => { if (String(value ?? '').trim()) rows.push([label, String(value) + suffix]); };
  push('Lambai', safe.length);
  push('Shalwar', safe.shalwarLength);
  push('Chaati', safe.chest);
  push('Kamar', safe.waist ?? safe.shalwarWaist);
  push('Bazu', safe.sleeve);
  push('Daman', safe.daman);
  push('Paincha', safe.bottom);
  const shown = rows.slice(0, 4);
  const widthNote = width === 'poora' ? 'Poora ghera' : width === 'mixed' ? 'Mixed ghera' : 'Aadha / flat';

  return (
    <div className="naap-preview" aria-live="polite">
      <div className="naap-preview-body">
        <div className="naap-preview-fig">
          <GarmentFigure type={type} values={safe} width={width} color={color} family={family} />
          <span className="naap-live"><Sparkles size={11} /> Live</span>
        </div>
        <div className="naap-preview-info">
          <div className="naap-preview-head">
            <strong>{type}</strong>
            <span>{widthNote} · {unit === 'cm' ? 'cm' : 'inch'}</span>
          </div>
          <div className="naap-chips">
            {shown.length ? shown.map(([k, v]) => <span key={k}><small>{k}</small>{v}</span>)
              : <span className="naap-chip-empty">Naap likhein — figure yahan banega</span>}
          </div>
          {onColor && (
            <div className="naap-colors" role="group" aria-label="Kapray ka rang">
              {FABRIC_COLORS.map(c => (
                <button key={c.id} type="button" title={c.label} aria-label={c.label}
                  aria-pressed={c.id === color}
                  className={'fabric-swatch' + (c.id === color ? ' active' : '')}
                  style={{ background: c.hex }} onClick={() => onColor(c.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
