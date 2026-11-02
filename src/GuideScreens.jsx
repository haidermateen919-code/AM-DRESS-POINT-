import React from 'react';
import { CalendarClock, ClipboardList, Plus, Ruler, TrendingUp, Wallet } from 'lucide-react';
import { Initials, StatusPill } from './ui.jsx';
import NaapPreview from './NaapPreview.jsx';

/* Guide ke andar app ki ASLI screens — wohi classes, wohi rang, wohi buttons.
   (Yeh nakshay nahi hain; app ke apne components se bane hue live screens hain.) */

function Frame({ children, label }) {
  return (
    <div className="gs-frame" role="img" aria-label={label}>
      <div className="gs-bar"><span className="gs-brand">AM</span><span>AM Dress Point</span><i /></div>
      <div className="gs-body">{children}</div>
    </div>
  );
}

const StatMini = ({ icon: Icon, label, value, detail, tone }) => (
  <div className="stat-card gs-stat">
    <div className="stat-top"><span>{label}</span><span className={'stat-icon ' + tone}><Icon size={14} /></span></div>
    <div className="stat-value">{value}</div>
    <div className="stat-detail">{detail}</div>
  </div>
);

export default function GuideScreen({ kind }) {
  switch (kind) {
    case 'intro':
      return (
        <Frame label="Asli app ka dashboard">
          <div className="gs-intro">
            <div className="hero-banner gs-hero">
              <img src="/img/hero-dashboard.jpg" alt="" />
              <div className="hero-scrim" />
              <div className="hero-copy">
                <span className="hero-eyebrow">AM DRESS POINT · CLOTH HOUSE</span>
                <strong>Aaj ka kaam, <em>aasan.</em></strong>
                <small>6 order khulay · 3 joray aaj due</small>
              </div>
            </div>
            <div className="gs-tiles">
              <span><i className="q-order"><Plus size={13} /></i>Naya order</span>
              <span><i className="q-customer"><CalendarClock size={13} /></i>Customer</span>
              <span><i className="q-hisaab"><Wallet size={13} /></i>Hisaab</span>
              <span><i className="q-reports"><TrendingUp size={13} /></i>Reports</span>
            </div>
          </div>
        </Frame>
      );

    case 'dashboard':
      return (
        <Frame label="Asli dashboard">
          <div className="hero-banner gs-hero">
            <img src="/img/hero-dashboard.jpg" alt="" />
            <div className="hero-scrim" />
            <div className="hero-copy">
              <span className="hero-eyebrow">AM DRESS POINT · CLOTH HOUSE</span>
              <strong>Har naap, <em>perfect fitting.</em></strong>
            </div>
          </div>
          <div className="stats-grid gs-stats">
            <StatMini icon={ClipboardList} label="Kaam jaari" value="14 joray" detail="6 open orders" tone="sage" />
            <StatMini icon={CalendarClock} label="Aaj ki delivery" value="3 joray" detail="2 orders aaj due" tone="sand" />
          </div>
          <div className="card gs-due">
            <div className="due-row">
              <Initials name="Ahmed Khan" />
              <span className="due-person"><strong>Ahmed Khan</strong><small>AD-1042 · 2 joray</small></span>
              <span className="due-date"><CalendarClock size={13} />Aaj</span>
              <span className="due-status"><StatusPill status="silai" /></span>
            </div>
            <div className="due-row">
              <Initials name="Bilal Aslam" />
              <span className="due-person"><strong>Bilal Aslam</strong><small>AD-1038 · 1 jora</small></span>
              <span className="due-date late"><CalendarClock size={13} />Late</span>
              <span className="due-status"><StatusPill status="tayyar" /></span>
            </div>
          </div>
        </Frame>
      );

    case 'order':
      return (
        <Frame label="Asli naya order form">
          <div className="gs-modal">
            <div className="gs-modal-head"><strong>Naya order</strong><small>AD-1043 · Ahmed Khan</small></div>
            <div className="gs-fields">
              <label className="field"><span>Kapray ki qisam</span><input readOnly value="Shalwar Kameez" /></label>
              <label className="field"><span>Joray</span><input readOnly value="2" /></label>
              <label className="field"><span>Rate (per jora)</span><input readOnly value="3,200" /></label>
              <label className="field"><span>Delivery date</span><input readOnly value="18 Nov 2026" /></label>
            </div>
            <div className="gs-btn-row">
              <button type="button" className="btn btn-primary" tabIndex={-1}><Plus size={14} /> Order save karein</button>
              <button type="button" className="btn btn-ghost" tabIndex={-1}>Cancel</button>
            </div>
          </div>
        </Frame>
      );

    case 'flow':
      return (
        <Frame label="Asli status pills">
          <div className="gs-statuses">
            {['naya', 'cutting', 'silai', 'fitting', 'tayyar', 'diya'].map(s => (
              <StatusPill key={s} status={s} />
            ))}
          </div>
          <div className="gs-note">Status badalne se dashboard, reports aur late ka nishan khud update hote hain.</div>
        </Frame>
      );

    case 'orders':
      return (
        <Frame label="Asli orders list">
          <div className="gs-list">
            {[
              ['Ahmed Khan', 'AD-1042', 'silai', 'Rs. 1,200'],
              ['Bilal Aslam', 'AD-1038', 'tayyar', 'Rs. 0'],
              ['Usman Ali', 'AD-1035', 'cutting', 'Rs. 2,000'],
            ].map(([name, num, status, bal]) => (
              <div className="gs-order" key={num}>
                <Initials name={name} />
                <span className="gs-order-main"><strong>{name}</strong><small>{num} · 2 joray</small></span>
                <StatusPill status={status} />
                <span className={'gs-amt' + (bal === 'Rs. 0' ? ' zero' : '')}>{bal}</span>
              </div>
            ))}
          </div>
        </Frame>
      );

    case 'naap':
      return (
        <Frame label="Asli naap screen ka live preview">
          <div className="gs-naap">
            <NaapPreview
              type="Shalwar Kameez"
              values={{ length: '42', chest: '24', sleeve: '23', daman: '26', shalwarLength: '40', bottom: '15' }}
              width="aadha"
              color="navy"
            />
          </div>
          <div className="gs-fields two">
            <label className="field"><span>Lambai</span><input readOnly value="42" /></label>
            <label className="field"><span>Chaati</span><input readOnly value="24" /></label>
          </div>
        </Frame>
      );

    case 'paisa':
      return (
        <Frame label="Asli hisaab screen">
          <div className="card gs-money">
            <div className="gs-money-row"><span className="gs-dot green" /><div><strong>Ahmed Khan</strong><small>AD-1042 · payment</small></div><b className="in">+2,500</b></div>
            <div className="gs-money-row"><span className="gs-dot red" /><div><strong>Dhaaga aur button</strong><small>Kharcha</small></div><b className="out">-1,200</b></div>
            <div className="gs-money-row"><span className="gs-dot green" /><div><strong>Bilal Aslam</strong><small>AD-1038 · payment</small></div><b className="in">+4,000</b></div>
          </div>
          <div className="card gs-total">
            <div><span className="mini-eyebrow">AAJ KI WASOOLI</span><strong>Rs. 6,500</strong></div>
            <div><span className="mini-eyebrow">BAQAYA</span><strong className="warn">Rs. 12,300</strong></div>
          </div>
        </Frame>
      );

    case 'reports':
      return (
        <Frame label="Asli reports chart">
          <div className="card gs-chart">
            <div className="chart-top"><div><strong>Rs. 94,500</strong><span> total wasooli</span></div><div className="chart-tag"><TrendingUp size={13} /> 7 din</div></div>
            <div className="bar-chart gs-bars">
              {[38, 62, 46, 78, 54, 88, 70].map((h, i) => (
                <div className="bar-col" key={i}>
                  <div className="bar-area"><div className={'bar' + (i === 5 ? ' bar-current' : '')} style={{ height: `${h}%` }} /></div>
                  <span>{['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </Frame>
      );

    case 'karigar':
      return (
        <Frame label="Asli karigar screen">
          <div className="gs-workers">
            {[['Akram', 'AK', '6 joray', 68], ['Master Saleem', 'MS', '4 joray', 46], ['Rashid', 'RH', '3 joray', 32]].map(([name, initials, count, pct]) => (
              <div className="card gs-worker" key={name}>
                <Initials name={name} />
                <div className="gs-worker-main">
                  <strong>{name}</strong><small>{count} · mazdoori banti hai</small>
                  <div className="gs-bar"><span style={{ width: `${pct}%` }} /></div>
                </div>
              </div>
            ))}
          </div>
        </Frame>
      );

    case 'backup':
      return (
        <Frame label="Asli settings ka backup card">
          <div className="card backup-card gs-backup">
            <div className="setting-icon"><Wallet size={17} /></div>
            <span className="mini-eyebrow">ZAROORI</span>
            <h2>Backup banate rahein.</h2>
            <p>Is device ka data browser storage mein hai.</p>
            <div className="gs-btn-row">
              <button type="button" className="btn btn-green" tabIndex={-1}>Backup download karein</button>
            </div>
          </div>
        </Frame>
      );

    case 'sync':
      return (
        <Frame label="Asli sync card">
          <div className="card gs-sync">
            <div className="gs-sync-head"><strong>Doosray device se sync</strong><span className="sync-indicator synced">Synced</span></div>
            <div className="sync-explain">Data encrypt ho kar server par jata hai. Sync key private rakhein.</div>
            <textarea className="secret-key" readOnly value="DD1.7fK2pQ9xR4tV8mN3bL6sW1yZ5aC0hJ2eU" aria-label="Sync key" />
            <div className="gs-btn-row">
              <button type="button" className="btn btn-soft" tabIndex={-1}>Key copy karein</button>
            </div>
          </div>
        </Frame>
      );

    case 'mobile':
      return (
        <Frame label="Asli mobile navigation">
          <div className="gs-phone">
            <div className="gs-phone-top"><strong>Aaj ka kaam</strong><span>3 joray due</span></div>
            <div className="gs-phone-list">
              <div className="gs-order"><Initials name="Ahmed Khan" /><span className="gs-order-main"><strong>Ahmed Khan</strong><small>AD-1042 · aaj</small></span><StatusPill status="silai" /></div>
              <div className="gs-order"><Initials name="Bilal Aslam" /><span className="gs-order-main"><strong>Bilal Aslam</strong><small>AD-1038 · late</small></span><StatusPill status="tayyar" /></div>
            </div>
            <div className="fab gs-fab"><Plus size={15} /> Naya order</div>
            <div className="mobile-nav gs-nav">
              {['Home', 'Orders', 'Naap', 'Hisaab', 'More'].map((label, i) => (
                <button key={label} className={i === 0 ? 'active' : ''} tabIndex={-1} type="button">
                  <Ruler size={15} /><span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </Frame>
      );

    case 'faq':
    default:
      return (
        <Frame label="Asli guide">
          <div className="gs-faq">
            <div className="gs-bubble q">Data kahan rehta hai?</div>
            <div className="gs-bubble a">Aap ke phone ke browser ke andar. Kisi company ke server par nahi (jab tak sync on na ho).</div>
            <div className="gs-bubble q">Phone badalna ho to?</div>
            <div className="gs-bubble a">Purane phone se backup download karein, naye phone par restore karein.</div>
          </div>
        </Frame>
      );
  }
}
