'use client';

import { useRef, useState, type PointerEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const memories = [
  { text: 'Rewinding a mixtape. One favorite song, again.', decade: '1990s' },
  { text: 'One last text before your load runs out.', decade: '2000s' },
  { text: 'A playlist shared. A whole barkada singing.', decade: '2010s' },
  { text: 'New voices. The next song to call our own.', decade: '2020s' },
];

export default function HeroCopy() {
  const host = useRef<HTMLDivElement>(null);
  const [memory, setMemory] = useState(-1);
  const current = memories[memory];

  function follow(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const style = event.currentTarget.style;
    style.setProperty('--light-x', `${x * 100}%`);
    style.setProperty('--light-y', `${y * 100}%`);
    style.setProperty('--title-x', `${(x - .5) * 10}px`);
    style.setProperty('--title-y', `${(y - .5) * 7}px`);
  }

  function reset() {
    host.current?.style.setProperty('--title-x', '0px');
    host.current?.style.setProperty('--title-y', '0px');
  }

  return <div ref={host} className="hero-copy interactive-hero" onPointerMove={follow} onPointerLeave={reset}>
    <p className="eyebrow">A journey through<br />Philippine popular culture</p>
    <div className="hero-title-wrap">
      <h1><span>Digital</span><span>Mirror</span></h1>
      <button className="memory-sun" aria-label="Reveal a memory" aria-controls="hero-memory" onClick={() => setMemory(value => (value + 1) % memories.length)}>
        <span className="memory-sun-icon" key={memory} aria-hidden="true">☀</span>
        <span className="sun-tip">Tap for a memory</span>
      </button>
    </div>
    <p className="hero-subtitle">Relive the moments.<br />Rediscover the culture.</p>
    <Link className="portal-button" href="/galleries">Enter the time portal <ArrowRight size={20} /></Link>
    <div id="hero-memory" className="hero-memory" aria-live="polite" aria-atomic="true">
      {current ? <div key={memory} className="memory-reveal"><p><Sparkles size={14} />{current.text}</p><Link href={`/galleries/${current.decade}`}>Rediscover the {current.decade} <ArrowRight size={13} /></Link></div> : <p className="small-note"><Sparkles size={13} /> Four decades. Countless memories. One shared story.</p>}
    </div>
  </div>;
}
