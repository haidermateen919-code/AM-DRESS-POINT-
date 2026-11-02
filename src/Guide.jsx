import React, { useRef, useState } from 'react';
import { ArrowDownToLine, BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import { Modal } from './ui.jsx';
import GuideVisual from './GuideVisuals.jsx';
import { GUIDE_SECTIONS, GUIDE_TITLE } from './guide.js';
import { downloadPdf } from './pdf.js';
import { download } from './export.js';
import { dateKey } from './model.js';

export function guideFileName() {
  return `am-dress-point-guide-${dateKey()}.pdf`;
}

export function saveGuidePdf(shopName, notify) {
  try {
    const dateText = new Intl.DateTimeFormat('en-PK', { month: 'long', year: 'numeric' }).format(new Date());
    const blob = downloadPdf(GUIDE_SECTIONS, { title: GUIDE_TITLE, dateText, shopName });
    download(guideFileName(), blob, 'application/pdf');
    notify?.('Guide ki PDF download ho gayi.');
  } catch (err) {
    console.warn(err);
    notify?.('PDF banane mein masla hua. Dobara koshish karein.');
  }
}

export default function Guide({ onClose, notify, shopName }) {
  const refs = useRef({});
  const [active, setActive] = useState(GUIDE_SECTIONS[0].id);

  function jump(id) {
    setActive(id);
    refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <Modal title="Mukammal guide" subtitle="Aasan alfaz mein — har feature ka tareeqa, chhoti tasveeron ke sath." onClose={onClose} wide>
      <div className="guide-top">
        <div className="guide-index" role="tablist" aria-label="Guide ke hisse">
          {GUIDE_SECTIONS.map(s => (
            <button key={s.id} type="button" role="tab" aria-selected={active === s.id}
              className={'guide-chip' + (active === s.id ? ' active' : '')} onClick={() => jump(s.id)}>
              <span>{s.no}</span>{s.title.replace(/\s*\(.*?\)/g, '')}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-primary btn-small guide-save" onClick={() => saveGuidePdf(shopName, notify)}>
          <ArrowDownToLine size={16}/> PDF download
        </button>
      </div>

      <div className="guide-doc">
        {GUIDE_SECTIONS.map(s => (
          <article className="guide-section" key={s.id} id={'guide-' + s.id}
            ref={el => { refs.current[s.id] = el; }}>
            <header className="guide-sec-head">
              <span className="guide-badge">{s.no}</span>
              <div>
                <span className="guide-kicker">{s.kicker}</span>
                <h3>{s.title}</h3>
              </div>
            </header>
            <GuideVisual kind={s.visual}/>
            <p className="guide-intro">{s.intro}</p>
            {s.flow && (
              <div className="guide-flow">
                {s.flow.map((step, i) => (
                  <React.Fragment key={step}>
                    <span>{step}</span>
                    {i < s.flow.length - 1 && <i aria-hidden="true">→</i>}
                  </React.Fragment>
                ))}
              </div>
            )}
            <ul className="guide-points">
              {s.points.map(([label, text]) => (
                <li key={label}><strong>{label}</strong><span>{text}</span></li>
              ))}
            </ul>
            {s.tip && (
              <div className="guide-tip"><Lightbulb size={15}/><span>{s.tip}</span></div>
            )}
          </article>
        ))}

        <div className="guide-end">
          <Sparkles size={18}/>
          <div>
            <strong>Ab aap tayyar hain.</strong>
            <p>Pehla kaam: Settings mein dukaan ka naam likhein, sample data hatayein aur aik backup bana lein.</p>
          </div>
        </div>

        <div className="guide-actions">
          <button type="button" className="btn btn-primary" onClick={() => saveGuidePdf(shopName, notify)}>
            <ArrowDownToLine size={16}/> Poori guide PDF download karein
          </button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Band karein</button>
        </div>
      </div>
    </Modal>
  );
}

export function GuideCard({ onOpen, notify, shopName }) {
  return (
    <section className="card guide-card">
      <div className="guide-card-body">
        <div className="guide-card-text">
          <span className="mini-eyebrow">GUIDE · MADAD</span>
          <h2>App kaise chalayein?</h2>
          <p>Har feature ka tareeqa — order, naap, hisaab, karigar aur backup — aasan roman urdu mein, chhoti tasveeron ke sath. Chahein to PDF bhi download kar lein.</p>
          <div className="guide-card-actions">
            <button className="btn btn-primary" onClick={onOpen}><BookOpen size={16}/> Guide kholein</button>
            <button className="btn btn-outline" onClick={() => saveGuidePdf(shopName, notify)}><ArrowDownToLine size={16}/> PDF download</button>
          </div>
        </div>
        <div className="guide-card-visual"><GuideVisual kind="intro"/></div>
      </div>
    </section>
  );
}
