'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CassetteTape, ChevronDown, ChevronUp, Shuffle, Sparkles } from 'lucide-react';
import { decades } from '../lib/data';

export default function HomeExplorer() {
  const [selected, setSelected] = useState(1);
  const [isHidden, setIsHidden] = useState(true);
  const era = decades[selected];

  function surprise() {
    setSelected(current => (current + 1 + Math.floor(Math.random() * (decades.length - 1))) % decades.length);
  }

  if (isHidden) return <button className="explorer-restore" onClick={() => setIsHidden(false)} aria-label="Show decade explorer"><ChevronUp size={16} /> Explore decades</button>;

  return <section className="home-explorer" aria-label="Choose your decade" style={{ '--era-color': era.color } as CSSProperties}>
    <div className="explorer-heading"><span><Sparkles size={14} /> YOUR NEXT MEMORY</span><div className="explorer-actions"><button onClick={surprise}><Shuffle size={14} /> Surprise me</button><button className="explorer-hide" onClick={() => setIsHidden(true)} aria-label="Hide decade explorer" title="Hide explorer"><ChevronDown size={16} /></button></div></div>
    <div className="era-selector" role="group" aria-label="Decade preview">
      {decades.map((decade, index) => <button key={decade.id} aria-pressed={selected === index} aria-controls="era-preview" onClick={() => setSelected(index)}><span className="era-dot" />{decade.id}</button>)}
    </div>
    <div id="era-preview" aria-live="polite" aria-atomic="true">
      <div className="era-preview-content" key={era.id}>
        <div className={`era-preview-image era-${selected}`} aria-hidden="true"><span>{era.id}</span></div>
        <div className="era-preview-copy"><p className="era-note"><CassetteTape size={14} />{era.note}</p><h2>{era.title}</h2><p className="era-memories">{era.objects[0]}<span> / </span>{era.objects[5]}</p></div>
      </div>
    </div>
    <Link className="era-explore-link" href={`/galleries/${era.id}`}><span>Step into the <strong>{era.id}</strong></span><ArrowUpRight size={19} /></Link>
    <p className="explorer-caption">Pick a decade. Find a little of yourself.</p>
  </section>;
}
