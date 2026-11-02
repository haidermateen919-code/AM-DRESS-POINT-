import React from 'react';

/* Guide ke chhote visuals — har feature ka mini naksha (pure SVG, koi image file nahi). */

const C = {
  navy: '#0b1b3a', navy2: '#22304d', green: '#0f9d6e', green2: '#12b981',
  line: '#e4e8ef', faint: '#c7d0dd', ink: '#101828', body: '#8b95a5',
  bg: '#f6f8fb', red: '#c85a60', amber: '#d99413', violet: '#6366f1', sky: '#0e7490',
};

const Bar = ({ x, y, w, h = 6, fill = C.faint, r = 3 }) => (
  <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} />
);
const Card = ({ x, y, w, h, faint = false }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={8} fill="#fff" stroke={C.line} strokeWidth="1" />
    {faint && <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} rx={7} fill={C.bg} />}
  </g>
);
const PhoneCase = ({ x, y, w, h, children }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={12} fill="#fff" stroke={C.line} strokeWidth="1.2" />
    <rect x={x + 8} y={y + 7} width={w - 16} height={7} rx={3.5} fill="#eef2f7" />
    {children}
  </g>
);

function Frame({ children, label }) {
  return (
    <svg className="guide-visual" viewBox="0 0 300 186" role="img" aria-label={label}>
      <rect x="0" y="0" width="300" height="186" rx="14" fill={C.bg} />
      {children}
    </svg>
  );
}

export default function GuideVisual({ kind }) {
  switch (kind) {
    case 'intro':
      return (
        <Frame label="App ka taaruf">
          <rect x="20" y="24" width="44" height="44" rx="12" fill={C.navy} />
          <path d="M32 56 L42 32 L52 56" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
          <Bar x={76} y={30} w={104} h={9} fill={C.ink} />
          <Bar x={76} y={45} w={72} h={7} />
          <Bar x={20} y={84} w={80} h={7} fill={C.faint} />
          {[
            ['#e8f8f1', C.green, 20],
            ['#eef2ff', C.violet, 112],
            ['#fff5e6', C.amber, 204],
          ].map(([bg, dot, x], i) => (
            <g key={i}>
              <rect x={x} y={100} width={76} height={62} rx={9} fill={bg} />
              <circle cx={x + 16} cy={116} r={5} fill={dot} opacity=".85" />
              <Bar x={x + 10} y={130} w={48} h={6} fill="#fff" />
              <Bar x={x + 10} y={142} w={34} h={5} fill="#fff" />
            </g>
          ))}
        </Frame>
      );

    case 'dashboard':
      return (
        <Frame label="Dashboard ka naksha">
          <rect x="16" y="16" width="268" height="56" rx="10" fill={C.navy} />
          <rect x="16" y="16" width="268" height="56" rx="10" fill="url(#gHero)" />
          <defs>
            <linearGradient id="gHero" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0b1b3a" stopOpacity=".95" />
              <stop offset="100%" stopColor="#22406b" stopOpacity=".25" />
            </linearGradient>
          </defs>
          <Bar x={28} y={30} w={54} h={5} fill="#5d7196" />
          <Bar x={28} y={42} w={120} h={9} fill="#fff" />
          <Bar x={28} y={56} w={86} h={5} fill="#4b6a95" />
          <circle cx="252" cy="44" r="12" fill="#ffffff" opacity=".12" />
          {['Naya order', 'Customer', 'Hisaab', 'Reports'].map((t, i) => (
            <g key={t}>
              <rect x={16 + i * 68} y={80} width={60} height={34} rx={8} fill="#fff" stroke={C.line} />
              <circle cx={16 + i * 68 + 13} cy={90} r={6} fill={i === 0 ? '#e8f8f1' : '#f1f4f9'} />
              <Bar x={16 + i * 68 + 8} y={101} width={44} h={4} fill={C.faint} />
            </g>
          ))}
          {[0, 1, 2].map(i => (
            <g key={i}>
              <rect x={16 + i * 91} y={122} width={82} height={30} rx={7} fill="#fff" stroke={C.line} />
              <Bar x={24 + i * 91} y={130} w={26} h={4} />
              <Bar x={24 + i * 91} y={139} w={40} h={6} fill={i === 3 ? C.green : C.ink} />
            </g>
          ))}
          <rect x="16" y="158" width="268" height="20" rx="6" fill="#fff" stroke={C.line} />
          <circle cx="28" cy="168" r="5" fill="#eef2f7" />
          <Bar x={38} y={165} w={60} h={5} />
          <Bar x={220} y={165} w={50} h={5} fill="#dbe6df" />
        </Frame>
      );

    case 'order':
      return (
        <Frame label="Naya order ka form">
          <Card x={16} y={14} w={268} h={158} />
          <Bar x={28} y={24} w={72} h={7} fill={C.ink} />
          <Bar x={28} y={38} w={40} h={4} />
          <rect x="28" y="46" width="112" height="18" rx="5" fill="#fff" stroke={C.line} />
          <Bar x={34} y={53} w={54} h={4} fill={C.faint} />
          <Bar x={154} y={38} w={40} h={4} />
          <rect x="154" y="46" width="118" height="18" rx="5" fill="#fff" stroke={C.line} />
          <Bar x={160} y={53} w={44} h={4} fill={C.faint} />
          {[0, 1].map(i => (
            <g key={i}>
              <Bar x={28} y={76 + i * 30} w={44} h={4} />
              <rect x="28" y={84 + i * 30} width="244" height="18" rx="5" fill="#fff" stroke={C.line} />
              <Bar x={34} y={91 + i * 30} w={i ? 90 : 62} h={4} fill={C.faint} />
            </g>
          ))}
          <rect x="28" y="144" width="92" height="20" rx="6" fill={C.green} />
          <Bar x={44} y={151} w={60} h={5} fill="#fff" />
          <rect x="214" y="144" width="58" height="20" rx="6" fill="#f1f4f9" />
          <Bar x={228} y={151} w={30} h={5} fill={C.faint} />
        </Frame>
      );

    case 'flow':
      return (
        <Frame label="Order ke chhah marhale">
          {['Naya', 'Cutting', 'Silai', 'Fitting', 'Tayyar', 'Diya'].map((t, i) => {
            const x = 12 + (i % 3) * 96, y = 30 + Math.floor(i / 3) * 56;
            const tones = [
              ['#f1f3f6', '#667085'], ['#fdf3e7', '#b25e09'], ['#fdf0e6', '#b54708'],
              ['#eef2ff', '#3538cd'], ['#e8f8f1', '#067647'], ['#e7f4f7', '#0e6e83'],
            ][i];
            return (
              <g key={t}>
                <rect x={x} y={y} width={84} height={34} rx={17} fill={tones[0]} />
                <circle cx={x + 18} cy={y + 17} r={8} fill="#fff" opacity=".8" />
                <text x={x + 17} y={y + 21} fontSize="9" fontWeight="700" fill={tones[1]} textAnchor="middle">{i + 1}</text>
                <text x={x + 32} y={y + 21} fontSize="10" fontWeight="700" fill={tones[1]}>{t}</text>
                {i % 3 !== 2 && (
                  <path d={`M${x + 86} ${y + 17} h8`} stroke={C.faint} strokeWidth="1.6" strokeLinecap="round" />
                )}
              </g>
            );
          })}
          <Bar x={12} y={148} w={120} h={6} fill={C.faint} />
          <Bar x={12} y={160} w={80} h={5} />
        </Frame>
      );

    case 'naap':
      return (
        <Frame label="Naap aur live preview">
          <Card x={14} y={14} w={104} h={158} />
          <ellipse cx="66" cy="150" rx="30" ry="7" fill="#eef2f7" />
          <path d="M42 44 Q66 36 90 44 L96 54 L104 128 Q66 136 28 128 L36 54 Z" fill="#dfe7f2" stroke="#cbd7e6" />
          <path d="M42 44 Q66 36 90 44 L96 54 L104 128 Q66 136 28 128 L36 54 Z" fill="url(#gShade)" />
          <defs>
            <linearGradient id="gShade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#000" stopOpacity=".12" />
              <stop offset="40%" stopColor="#fff" stopOpacity=".5" />
              <stop offset="100%" stopColor="#000" stopOpacity=".14" />
            </linearGradient>
          </defs>
          <ellipse cx="66" cy="45" rx="8" ry="4" fill="#b9c6d8" />
          <path d="M30 44 Q22 60 22 74" stroke="#cbd7e6" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M102 44 Q110 60 110 74" stroke="#cbd7e6" strokeWidth="9" fill="none" strokeLinecap="round" />
          <rect x="126" y="14" width="160" height="20" rx="7" fill="#e8f8f1" />
          <circle cx="136" cy="24" r="3" fill={C.green} />
          <text x="144" y="27" fontSize="8" fontWeight="800" fill="#0b7f59">LIVE PREVIEW</text>
          {[0, 1, 2, 3].map(i => (
            <g key={i}>
              <Bar x={126 + (i % 2) * 82} y={44 + Math.floor(i / 2) * 34} w={34} h={4} />
              <rect x={126 + (i % 2) * 82} y={52 + Math.floor(i / 2) * 34} width={70} height={18} rx="5" fill="#fff" stroke={C.line} />
              <Bar x={132 + (i % 2) * 82} y={59 + Math.floor(i / 2) * 34} w={i % 2 ? 26 : 34} h={4} fill="#d5dce6" />
            </g>
          ))}
          <Bar x={126} y={112} w={40} h={4} />
          {['#efe7d8', '#fbfbfb', '#8fa9c2', '#22304d', '#fbf3f3'].map((c, i) => (
            <circle key={c} cx={132 + i * 20} cy={130} r={7} fill={c} stroke={i === 3 ? C.green : C.line} strokeWidth={i === 3 ? 2 : 1} />
          ))}
          <rect x="126" y="146" width="160" height="26" rx="7" fill="#f1f5f3" />
          <Bar x={134} y={155} w={64} h={5} fill="#cfe0d8" />
          <Bar x={134} y={164} w={40} h={4} fill="#dbe7e1" />
        </Frame>
      );

    case 'karigar':
      return (
        <Frame label="Karigar ka kaam">
          {[0, 1, 2].map(i => (
            <g key={i}>
              <rect x={14 + i * 92} y={24} width={84} height={116} rx={10} fill="#fff" stroke={C.line} />
              <circle cx={14 + i * 92 + 20} cy={46} r={12} fill={['#e8f8f1', '#eef2ff', '#fdf3e7'][i]} />
              <text x={14 + i * 92 + 20} y={50} fontSize="10" fontWeight="800" textAnchor="middle" fill={['#0b7f59', '#4338ca', '#b25e09'][i]}>
                {['AK', 'MS', 'RH'][i]}
              </text>
              <Bar x={14 + i * 92 + 38} y={40} w={34} h={5} fill={C.ink} />
              <Bar x={14 + i * 92 + 38} y={50} w={24} h={4} />
              <Bar x={14 + i * 92 + 12} y={76} w={58} h={5} />
              <rect x={14 + i * 92 + 12} y={88} width={58} height={6} rx={3} fill="#eef2f7" />
              <rect x={14 + i * 92 + 12} y={88} width={[44, 30, 50][i]} height={6} rx={3} fill={[C.green, C.violet, C.amber][i]} />
              <Bar x={14 + i * 92 + 12} y={104} w={28} h={4} />
              <Bar x={14 + i * 92 + 12} y={114} w={44} h={4} fill="#dbe1ea" />
            </g>
          ))}
          <Bar x={14} y={154} w={140} h={6} fill={C.faint} />
          <Bar x={14} y={166} w={96} h={5} />
        </Frame>
      );

    case 'paisa':
      return (
        <Frame label="Hisaab kitaab">
          <Card x={14} y={16} w={130} h={154} />
          <Bar x={26} y={28} w={54} h={6} fill={C.ink} />
          {[0, 1, 2, 3].map(i => (
            <g key={i}>
              <circle cx={34} cy={52 + i * 30} r={8} fill={['#e8f8f1', '#e8f8f1', '#fdf2f2', '#e8f8f1'][i]} />
              <path d={`M30 ${48 + i * 30} l4 4 l6-8`} stroke={['#0b7f59', '#0b7f59', '#a63f47', '#0b7f59'][i]} strokeWidth="1.6" fill="none" />
              <Bar x={48} y={48 + i * 30} w={40} h={4} />
              <Bar x={48} y={56 + i * 30} w={26} h={3} fill="#d5dce6" />
              <text x={132} y={52 + i * 30} fontSize="9" fontWeight="800" textAnchor="end" fill={i === 2 ? C.red : C.green}>
                {['+2,500', '+4,000', '-1,200', '+3,000'][i]}
              </text>
            </g>
          ))}
          <Card x={156} y={16} w={130} h={76} />
          <text x={168} y={40} fontSize="8" fill={C.body}>TOTAL WASOOLI</text>
          <text x={168} y={58} fontSize="15" fontWeight="800" fill={C.ink}>Rs. 94,500</text>
          <rect x="168" y="68" width="106" height="6" rx="3" fill="#eef2f7" />
          <rect x="168" y="68" width="78" height="6" rx="3" fill={C.green} />
          <Card x={156} y={102} w={130} h={68} />
          <text x={168} y={122} fontSize="8" fill={C.body}>BAQAYA</text>
          <text x={168} y={140} fontSize="15" fontWeight="800" fill={C.red}>Rs. 12,300</text>
          <Bar x={168} y={150} w={80} h={4} fill="#eef2f7" />
        </Frame>
      );

    case 'reports':
      return (
        <Frame label="Reports ke charts">
          <Card x={14} y={16} w={172} h={122} />
          <Bar x={26} y={26} w={60} h={6} fill={C.ink} />
          {[38, 62, 46, 78, 54, 88, 70].map((h, i) => (
            <rect key={i} x={28 + i * 21} y={116 - h} width={13} height={h} rx={4}
              fill={i === 5 ? C.green : '#dbe7e2'} />
          ))}
          <Bar x={26} y={122} w={140} h={3} fill="#eef2f7" />
          <Card x={196} y={16} w={90} h={122} />
          <circle cx="241" cy="58" r="24" fill="none" stroke="#eef2f7" strokeWidth="10" />
          <circle cx="241" cy="58" r="24" fill="none" stroke={C.green} strokeWidth="10"
            strokeDasharray="70 151" strokeLinecap="round" transform="rotate(-90 241 58)" />
          <circle cx="241" cy="58" r="24" fill="none" stroke={C.violet} strokeWidth="10"
            strokeDasharray="40 151" strokeDashoffset="-70" strokeLinecap="round" transform="rotate(-90 241 58)" />
          <text x="241" y="62" fontSize="11" fontWeight="800" textAnchor="middle" fill={C.ink}>62</text>
          <Bar x={206} y={98} w={60} h={4} />
          <Bar x={206} y={108} w={44} h={4} />
          <Bar x={206} y={118} w={52} h={4} />
          <rect x="14" y="148" width="272" height="26" rx="8" fill="#fff" stroke={C.line} />
          <text x="26" y="165" fontSize="9" fontWeight="700" fill={C.green}>CSV download</text>
          <Bar x={196} y={158} w={76} h={6} fill="#eef2f7" />
        </Frame>
      );

    case 'backup':
      return (
        <Frame label="Backup aur restore">
          <rect x="16" y="30" width="86" height="112" rx="10" fill="#fff" stroke={C.line} />
          <path d="M40 34 h30 l14 14 v58 a6 6 0 0 1 -6 6 h-38 a6 6 0 0 1 -6 -6 v-66 a6 6 0 0 1 6 -6 Z" fill="#f1f4f9" stroke={C.line} />
          <Bar x={30} y={72} w={44} h={5} />
          <Bar x={30} y={84} w={32} h={4} />
          <circle cx="59" cy="104" r="12" fill={C.green} />
          <path d="M59 98 v10 m-4 -4 l4 4 l4 -4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M112 86 h20 m-6 -6 l6 6 l-6 6" stroke={C.faint} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <PhoneCase x={140} y={26} w={68} h={126}>
            <rect x="150" y="42" width="48" height="30" rx="7" fill="#e8f8f1" />
            <Bar x={156} y={52} w={30} h={4} fill="#9fd9c4" />
            <Bar x={156} y={61} w={20} h={3} fill="#bfe6d8" />
            {[0, 1, 2].map(i => (
              <g key={i}>
                <rect x="150" y={80 + i * 20} width="48" height="15" rx="5" fill="#f6f8fb" />
                <Bar x={155} y={86 + i * 20} w={26} h={4} fill="#d5dce6" />
              </g>
            ))}
          </PhoneCase>
          <path d="M216 86 h18 m-6 -6 l6 6 l-6 6" stroke={C.faint} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <circle cx="258" cy="86" r="20" fill="#eef2ff" />
          <path d="M250 80 h16 v12 h-16 z" fill="none" stroke={C.violet} strokeWidth="1.6" rx="2" />
          <path d="M254 80 v-4 a4 4 0 0 1 8 0 v4" stroke={C.violet} strokeWidth="1.6" fill="none" />
        </Frame>
      );

    case 'sync':
      return (
        <Frame label="Do phone sync">
          <PhoneCase x={22} y={28} w={62} h={118}>
            <rect x="30" y="44" width="46" height="26" rx="6" fill="#e8f8f1" />
            <Bar x={36} y={52} w={28} h={4} fill="#9fd9c4" />
            <Bar x={36} y={61} w={18} h={3} fill="#bfe6d8" />
            {[0, 1].map(i => <rect key={i} x="30" y={78 + i * 20} width="46" height="14" rx="5" fill="#f6f8fb" />)}
          </PhoneCase>
          <path d="M92 74 h24 m-5 -5 l5 5 l-5 5" stroke={C.faint} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <rect x="120" y="52" width="60" height="46" rx="10" fill="#0b1b3a" />
          <rect x="132" y="64" width="36" height="22" rx="4" fill="#1d2f52" />
          <circle cx="150" cy="75" r="5" fill="none" stroke="#6fe3b4" strokeWidth="1.6" />
          <path d="M147 75 h6 M150 72 v6" stroke="#6fe3b4" strokeWidth="1.4" />
          <path d="M184 74 h24 m-5 -5 l5 5 l-5 5" stroke={C.faint} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <PhoneCase x={216} y={28} w={62} h={118}>
            <rect x="224" y="44" width="46" height="26" rx="6" fill="#eef2ff" />
            <Bar x={230} y={52} w={28} h={4} fill="#c7cbf5" />
            <Bar x={230} y={61} w={18} h={3} fill="#d7daf9" />
            {[0, 1].map(i => <rect key={i} x="224" y={78 + i * 20} width="46" height="14" rx="5" fill="#f6f8fb" />)}
          </PhoneCase>
          <Bar x={94} y={160} w={112} h={5} fill={C.faint} />
        </Frame>
      );

    case 'mobile':
      return (
        <Frame label="Mobile par app">
          <rect x="86" y="10" width="128" height="166" rx="18" fill="#fff" stroke={C.line} strokeWidth="2" />
          <rect x="94" y="18" width="112" height="30" rx="8" fill={C.navy} />
          <Bar x={100} y={26} w={30} h={4} fill="#4b6a95" />
          <Bar x={100} y={36} w={52} h={5} fill="#fff" />
          <rect x="94" y="54" width="112" height="44" rx="8" fill="#f6f8fb" />
          <Bar x={100} y={62} w={48} h={4} fill={C.faint} />
          <rect x="100" y="72" width="100" height="18" rx="5" fill="#fff" stroke={C.line} />
          {[0, 1].map(i => (
            <rect key={i} x="94" y={104 + i * 16} width="112" height="12" rx="4" fill="#fff" stroke={C.line} />
          ))}
          <rect x="132" y="128" width="56" height="18" rx="9" fill={C.green} />
          <rect x="86" y="150" width="128" height="26" rx="8" fill="#fff" />
          <path d="M86 150 h128" stroke={C.line} />
          {[0, 1, 2, 3, 4].map(i => (
            <circle key={i} cx={104 + i * 23} cy={163} r={5} fill={i === 0 ? C.green : '#dfe4ec'} />
          ))}
          <path d="M36 84 h26 m-6 -6 l6 6 l-6 6" stroke={C.faint} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <text x="8" y="72" fontSize="8" fontWeight="700" fill={C.body}>Naya order</text>
          <path d="M238 60 h26 m-6 -6 l6 6 l-6 6" stroke={C.faint} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <text x="238" y="50" fontSize="8" fontWeight="700" fill={C.body}>More</text>
        </Frame>
      );

    case 'faq':
    default:
      return (
        <Frame label="Sawal jawab">
          <rect x="18" y="24" width="168" height="44" rx="12" fill="#fff" stroke={C.line} />
          <Bar x={30} y={36} w={104} h={6} fill={C.ink} />
          <Bar x={30} y={50} w={72} h={5} />
          <rect x="112" y="84" width="170" height="52" rx="12" fill="#e8f8f1" />
          <Bar x={124} y={96} w={128} h={5} fill="#8fcdb6" />
          <Bar x={124} y={108} w={98} h={5} fill="#a9dcc9" />
          <Bar x={124} y={120} w={112} h={5} fill="#a9dcc9" />
          <rect x="18" y="140" width="120" height="30" rx="10" fill="#fff" stroke={C.line} />
          <Bar x={30} y={152} w={80} h={5} />
          <circle cx="256" cy="152" r="14" fill={C.navy} />
          <text x="256" y="157" fontSize="12" fontWeight="800" fill="#fff" textAnchor="middle">?</text>
        </Frame>
      );
  }
}
