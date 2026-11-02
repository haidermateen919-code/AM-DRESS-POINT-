import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

/* Kapray ke rang — sirf visual pehchaan ke liye, naap ke sath save hote hain. */
export const FABRIC_COLORS = [
  { id: 'ivory', label: 'Ivory', hex: '#efe7d8' },
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

const BASELINE = {
  length: 38, chest: 22, daman: 24, sleeve: 17, neck: 15,
  shalwarLength: 40, bottom: 14,
};

/* ---------------------------------------------------------------- 3D figure */
function Garment({ type, values, width, color }) {
  const v = values || {};
  const mul = width === 'poora' ? 1.1 : width === 'mixed' ? 1.04 : 1;

  const length = num(v.length, BASELINE.length, 22, 52);
  const chest = num(v.chest, 22, 14, 36) * mul;
  const daman = num(v.daman, chest, 12, 44) * mul;
  const sleeve = num(v.sleeve, 17, 0, 34);
  const neck = num(v.neck, 15, 10, 24);
  const lowerLength = num(v.shalwarLength ?? v.length, 40, 22, 54);
  const paincha = num(v.bottom, 14, 8, 26) * mul;

  const isShalwar = type === 'Shalwar';
  const isTrouser = type === 'Trouser';
  const isWaistcoat = type === 'Waistcoat';
  const hasUpper = !isShalwar && !isTrouser;
  const hasLower = type === 'Shalwar Kameez' || isShalwar || isTrouser;

  /* frame */
  const cx = 100;
  const shoulderY = 42;
  const bodyRef = 82;                                  // ref height of the kameez block
  const lenK = clamp((40 + (length - 22) * 2.0) / bodyRef, .62, 1.16);
  const hemY = shoulderY + bodyRef * lenK;

  const halfW = 26 + (chest - 22) * 1.05;
  const shoulderHalf = halfW * 0.9;
  const hemHalf = clamp(halfW + (daman - chest) * .58, halfW - 4, halfW + 12);

  const waistY = hasUpper ? hemY - 7 : shoulderY + 16;
  const legK = clamp((44 + (lowerLength - 22) * 1.15) / 56, .6, 1.15);
  const legBase = 56;
  const legLen = legBase * legK;
  const legW = clamp(9 + paincha * .5, 11, 21) * (isTrouser ? .86 : 1);
  const stride = clamp(4 + paincha * .26, 5, 13) * (isTrouser ? .9 : 1);

  const sleeveLen = clamp(sleeve * 1.7, 0, 62) * (isWaistcoat ? 0 : 1);
  const sleeveW = clamp(8 + (chest - 14) * .28, 9, 15);
  const collarR = 6 + (neck - 10) * .5;
  const sleeveTop = shoulderY + 7;
  const sleeveInX = cx + shoulderHalf * (hasUpper ? 0 : 0);
  const sleeveOutX = (side) => cx + side * (shoulderHalf + 5 + sleeveLen * .34);
  const sleeveEndY = sleeveTop + sleeveLen * .92;
  void sleeveInX;

  const fill = fabricHex(color);
  const light = ['ivory', 'white', 'beige', 'sky'].includes(color);

  /* torso path — chest + daman seedha asar karte hain */
  const torso = [
    `M${cx - shoulderHalf * .82} ${shoulderY + 1}`,
    `Q${cx} ${shoulderY - 6} ${cx + shoulderHalf * .82} ${shoulderY + 1}`,
    `L${cx + shoulderHalf} ${shoulderY + 10}`,
    `Q${cx + halfW} ${shoulderY + 10} ${cx + halfW * 1.01} ${shoulderY + 22}`,
    `L${cx + hemHalf} ${shoulderY + bodyRef}`,
    `Q${cx} ${shoulderY + bodyRef + 4} ${cx - hemHalf} ${shoulderY + bodyRef}`,
    `L${cx - halfW * 1.01} ${shoulderY + 22}`,
    `Q${cx - halfW} ${shoulderY + 10} ${cx - shoulderHalf} ${shoulderY + 10}`,
    'Z',
  ].join(' ');

  return (
    <svg className="ng-svg" viewBox="0 0 200 236" role="img"
      aria-label={`${type} ka realistic naap preview`}>
      <defs>
        {/* kapre ki golai (cylinder shading) */}
        <linearGradient id="ng-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity=".34" />
          <stop offset="14%" stopColor="#000" stopOpacity=".12" />
          <stop offset="38%" stopColor="#fff" stopOpacity=".26" />
          <stop offset="52%" stopColor="#fff" stopOpacity=".1" />
          <stop offset="78%" stopColor="#000" stopOpacity=".16" />
          <stop offset="100%" stopColor="#000" stopOpacity=".38" />
        </linearGradient>
        <linearGradient id="ng-depth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity=".16" />
          <stop offset="28%" stopColor="#000" stopOpacity="0" />
          <stop offset="82%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity=".2" />
        </linearGradient>
        <linearGradient id="ng-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1b3a" stopOpacity=".22" />
          <stop offset="100%" stopColor="#0b1b3a" stopOpacity="0" />
        </linearGradient>
        {/* bunai / twill texture */}
        <pattern id="ng-weave" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <path d="M0 0V5" stroke="#000" strokeOpacity=".055" strokeWidth="1.4" />
          <path d="M2.6 0V5" stroke="#fff" strokeOpacity=".07" strokeWidth="1" />
        </pattern>
        <clipPath id="ng-torso-clip"><path d={torso} /></clipPath>
      </defs>

      {/* zameen par saya */}
      <ellipse cx={cx} cy={hasLower ? Math.min(224, waistY + legLen + 14) : hemY + 12}
        rx={hemHalf * .95} ry="7" fill="url(#ng-floor)" opacity=".55" />
      <ellipse cx={cx} cy={hasLower ? Math.min(224, waistY + legLen + 12) : hemY + 10}
        rx={hemHalf * .55} ry="3.2" fill="#0b1b3a" opacity=".12" />

      {/* ---------------- shalwar / trouser (kapray ke peeche) ---------------- */}
      {hasLower && (
        <g style={{ transform: `scaleY(${legK})`, transformOrigin: `${cx}px ${waistY}px`, transition: 'transform .38s cubic-bezier(.22,.61,.36,1)' }}>
          <g>
            <rect x={cx - (isTrouser ? 17 : 15)} y={waistY - 9} width={isTrouser ? 34 : 30} height="18" rx="7"
              fill={fill} stroke="#000" strokeOpacity=".18" strokeWidth="1" />
            {[-1, 1].map(side => (
              <g key={side}>
                <path
                  d={`M${cx + side * stride * .35} ${waistY + 4} Q${cx + side * (stride + legW * .28)} ${waistY + legBase * .45} ${cx + side * stride} ${waistY + 4 + legBase}`}
                  fill="none" stroke={fill} strokeWidth={legW} strokeLinecap="round" />
                <path
                  d={`M${cx + side * stride * .35} ${waistY + 4} Q${cx + side * (stride + legW * .28)} ${waistY + legBase * .45} ${cx + side * stride} ${waistY + 4 + legBase}`}
                  fill="none" stroke="url(#ng-shade)" strokeOpacity=".9" strokeWidth={legW} strokeLinecap="round" />
                {/* crease / silai */}
                <path
                  d={`M${cx + side * stride * .6} ${waistY + 10} Q${cx + side * (stride + legW * .12)} ${waistY + legBase * .5} ${cx + side * stride * .92} ${waistY + legBase + 1}`}
                  fill="none" stroke={light ? 'rgba(16,24,40,.14)' : 'rgba(255,255,255,.22)'} strokeWidth="1" strokeDasharray="4 5" />
              </g>
            ))}
            {/* paincha ka kinara */}
            <path d={`M${cx - stride - legW * .42} ${waistY + legBase + 2} h${legW * .84}`}
              stroke={light ? 'rgba(16,24,40,.22)' : 'rgba(0,0,0,.3)'} strokeWidth="1.6" strokeLinecap="round" />
            <path d={`M${cx + stride - legW * .42} ${waistY + legBase + 2} h${legW * .84}`}
              stroke={light ? 'rgba(16,24,40,.22)' : 'rgba(0,0,0,.3)'} strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </g>
      )}

      {/* ---------------- upper body ---------------- */}
      {hasUpper && (
        <g style={{ transform: `scaleY(${lenK})`, transformOrigin: `${cx}px ${shoulderY}px`, transition: 'transform .38s cubic-bezier(.22,.61,.36,1)' }}>
          <path d={torso} fill={fill} />
          <path d={torso} fill="url(#ng-shade)" />
          <path d={torso} fill="url(#ng-depth)" />
          <g clipPath="url(#ng-torso-clip)">
            <rect x={cx - hemHalf - 4} y={shoulderY - 8} width={(hemHalf + 4) * 2} height={bodyRef + 20} fill="url(#ng-weave)" />
            {/* kapre ki silwaten / folds */}
            {[-1, 1].map((side, i) => (
              <path key={i}
                d={`M${cx + side * halfW * .38} ${shoulderY + 26} Q${cx + side * halfW * .52} ${shoulderY + 50} ${cx + side * hemHalf * .42} ${shoulderY + bodyRef - 4}`}
                fill="none" stroke={light ? 'rgba(16,24,40,.1)' : 'rgba(255,255,255,.16)'} strokeWidth="1.6" />
            ))}
            <path d={`M${cx - halfW * .62} ${shoulderY + 30} q6 ${bodyRef * .3} ${-2} ${bodyRef * .6}`}
              fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="2" opacity=".7" />
            {/* daman ki silai */}
            <path d={`M${cx - hemHalf} ${shoulderY + bodyRef - 7} Q${cx} ${shoulderY + bodyRef - 3} ${cx + hemHalf} ${shoulderY + bodyRef - 7}`}
              fill="none" stroke={light ? 'rgba(16,24,40,.16)' : 'rgba(255,255,255,.22)'} strokeWidth="1" strokeDasharray="3 4" />
          </g>
          <path d={torso} fill="none" stroke={light ? 'rgba(16,24,40,.26)' : 'rgba(0,0,0,.34)'} strokeWidth="1.1" />

          {/* gala — andar ki gehraai */}
          <ellipse cx={cx} cy={shoulderY + 3} rx={collarR} ry={collarR * .52} fill="#0b1b3a" opacity=".28" />
          <ellipse cx={cx} cy={shoulderY + 2.2} rx={collarR} ry={collarR * .48} fill={fill} />
          <ellipse cx={cx} cy={shoulderY + 2.2} rx={collarR} ry={collarR * .48}
            fill="none" stroke={light ? 'rgba(16,24,40,.3)' : 'rgba(0,0,0,.4)'} strokeWidth="1.1" />
          {!isWaistcoat && (
            <path d={`M${cx - collarR * .55} ${shoulderY + 4} Q${cx} ${shoulderY + 12} ${cx + collarR * .55} ${shoulderY + 4}`}
              fill={light ? 'rgba(16,24,40,.1)' : 'rgba(0,0,0,.22)'} />
          )}
          {isWaistcoat && (
            <path d={`M${cx - shoulderHalf * .52} ${shoulderY + 4} L${cx} ${shoulderY + 40} L${cx + shoulderHalf * .52} ${shoulderY + 4}`}
              fill="none" stroke={light ? 'rgba(16,24,40,.35)' : 'rgba(0,0,0,.45)'} strokeWidth="1.6" strokeLinejoin="round" />
          )}
          {/* placket + buttons */}
          <path d={`M${cx} ${shoulderY + 6} L${cx} ${shoulderY + bodyRef - 4}`}
            stroke={light ? 'rgba(16,24,40,.2)' : 'rgba(255,255,255,.22)'} strokeWidth="1.2" />
          {[0, 1, 2, 3].map(i => (
            <circle key={i} cx={cx} cy={shoulderY + 16 + i * 17} r="1.7"
              fill={light ? 'rgba(16,24,40,.3)' : 'rgba(255,255,255,.5)'} />
          ))}
        </g>
      )}

      {/* ---------------- bazu (set-in sleeve) ---------------- */}
      {hasUpper && sleeveLen > 2 && [-1, 1].map(side => {
        const path = `M${cx + side * shoulderHalf * .9} ${shoulderY + 6} Q${cx + side * (shoulderHalf + sleeveLen * .16)} ${sleeveTop + sleeveLen * .38} ${sleeveOutX(side)} ${sleeveEndY}`;
        return (
          <g key={side}>
            <path d={path} fill="none" stroke={fill} strokeWidth={sleeveW} strokeLinecap="round" />
            <path d={path} fill="none" stroke="url(#ng-shade)" strokeWidth={sleeveW} strokeLinecap="round" />
            <path d={path} fill="none" stroke={light ? 'rgba(16,24,40,.18)' : 'rgba(0,0,0,.26)'} strokeWidth={sleeveW + 1.6} strokeLinecap="round" opacity=".35" />
            <path d={path} fill="none" stroke={fill} strokeWidth={sleeveW - 1.4} strokeLinecap="round" />
            {/* kaf / cuff */}
            <ellipse cx={sleeveOutX(side)} cy={sleeveEndY} rx={sleeveW * .55} ry={sleeveW * .38}
              transform={`rotate(${side * 26} ${sleeveOutX(side)} ${sleeveEndY})`}
              fill={fill} stroke={light ? 'rgba(16,24,40,.26)' : 'rgba(0,0,0,.32)'} strokeWidth="1" />
            <ellipse cx={sleeveOutX(side)} cy={sleeveEndY} rx={sleeveW * .55} ry={sleeveW * .38}
              transform={`rotate(${side * 26} ${sleeveOutX(side)} ${sleeveEndY})`}
              fill="url(#ng-shade)" opacity=".55" />
          </g>
        );
      })}

      {/* pathar / length ka nishan */}
      <path d={`M26 ${shoulderY} L26 ${hemY}`} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 3" />
      <path d={`M23.5 ${shoulderY} h5 M23.5 ${hemY} h5`} stroke="#94a3b8" strokeWidth="1" />
    </svg>
  );
}

/* naap ka live preview — har value ka asar figure par nazar aata hai */
export default function NaapPreview({ type, values = {}, width = 'aadha', color, onColor, unit = 'inch' }) {
  const safe = values || {};
  const suffix = unit === 'cm' ? ' cm' : '″';

  const rows = [];
  const push = (label, value, key) => { if (String(value ?? '').trim()) rows.push({ label, text: String(value) + suffix, key }); };
  push('Lambai', safe.length, 'length');
  push('Shalwar', safe.shalwarLength, 'shalwarLength');
  push('Chaati', safe.chest, 'chest');
  push('Kamar', safe.waist ?? safe.shalwarWaist, 'waist');
  push('Bazu', safe.sleeve, 'sleeve');
  push('Daman', safe.daman, 'daman');
  push('Paincha', safe.bottom, 'bottom');

  /* jo value abhi badli, us ka bubble dikhayein */
  const previous = useRef({});
  const [bubble, setBubble] = useState(null);
  const timer = useRef(null);
  useEffect(() => {
    const prev = previous.current;
    const changed = rows.find(r => String(prev[r.key] ?? '') !== String(safe[r.key] ?? ''));
    previous.current = { ...safe };
    if (changed && prev[changed.key] !== undefined) {
      setBubble({ label: changed.label, text: changed.text });
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setBubble(null), 1500);
    }
    return () => clearTimeout(timer.current);
  }, [JSON.stringify(safe)]); // eslint-disable-line react-hooks/exhaustive-deps

  const widthNote = width === 'poora' ? 'Poora ghera' : width === 'mixed' ? 'Mixed ghera' : 'Aadha / flat';

  return (
    <div className="naap-preview" aria-live="polite">
      <div className="naap-preview-body">
        <div className="naap-stage">
          <div className="naap-stage-3d">
            <div className="naap-figure-wrap">
              <Garment type={type} values={safe} width={width} color={color} />
            </div>
          </div>
          <span className="naap-live"><Sparkles size={10} /> Live</span>
          {bubble && <span key={bubble.label + bubble.text} className="naap-bubble">{bubble.label} · {bubble.text}</span>}
        </div>
        <div className="naap-preview-info">
          <div className="naap-preview-head">
            <strong>{type}</strong>
            <span>{widthNote} · {unit === 'cm' ? 'cm' : 'inch'}</span>
          </div>
          <div className="naap-chips">
            {rows.length ? rows.slice(0, 4).map(r => <span key={r.key}><small>{r.label}</small>{r.text}</span>)
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
