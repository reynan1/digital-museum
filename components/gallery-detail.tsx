'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, ChevronRight, Music2, Tv, Shirt, Gamepad2, Utensils, Smartphone, Heart, X, Sun } from 'lucide-react';
import { categories, decades, getExhibits, yearRanges, type Category, type Exhibit } from '@/lib/data';
import { ListenButton } from './shell';

const icons = [Music2, Tv, Shirt, Gamepad2, Utensils, Smartphone, Heart];
const periods = ['Early years', 'Middle years', 'Later years'];

export function GalleryDetail({ decade }: { decade: typeof decades[number] }) {
  const [category, setCategory] = useState<Category>('Music');
  const [period, setPeriod] = useState(0);
  const [selected, setSelected] = useState<Exhibit | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const exhibits = getExhibits(decade.id, category, period);

  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);

  function changeCategory(next: Category) {
    setCategory(next);
    setSelected(null);
  }

  function changePeriod(next: number) {
    setPeriod(next);
    setSelected(null);
  }

  return <main id="main-content" className="detail page" style={{ '--gallery-accent': decade.color } as CSSProperties}>
    <div className="ambient-art" />
    <div className="breadcrumbs"><Link href="/galleries">Galleries</Link><ChevronRight size={14} /><span>{decade.id}</span></div>
    <section className="detail-hero">
      <div><p className="eyebrow">A DECADE OF SHARED MEMORIES</p><h1 style={{ color: decade.color }}>{decade.id}</h1><h2>{decade.title}</h2><p>{decade.description}</p></div>
      <div className="memory-collage" aria-hidden="true"><div className="mini-polaroid"><div className="collage-image" /><span>the days we remember ♡</span></div><div className="paper mini-note">OPM<br />Teen idols<br />Text culture<br />Pinoy movies<br />Early internet <span>♡</span></div></div>
    </section>
    <nav className="decade-switch" aria-label="Choose a decade">{decades.map((item) => <Link key={item.id} href={`/galleries/${item.id}`} aria-current={item.id === decade.id ? 'page' : undefined}>{item.id}</Link>)}</nav>

    <section className="exhibit-browser" aria-label={`${decade.id} exhibits`}>
      <aside className="category-list" aria-label="Gallery aspects">{categories.map((item, index) => { const Icon = icons[index]; return <button key={item} aria-pressed={item === category} onClick={() => changeCategory(item)}><Icon size={19} />{item}</button>; })}</aside>
      <div className="exhibit-panel">
        <header className="exhibit-panel-heading"><div><p className="eyebrow">EXPLORE BY YEAR</p><h2><Sun size={23} />{category}</h2></div><span>{String(categories.indexOf(category) + 1).padStart(2, '0')} / 07</span></header>
        <div className="year-filters" role="group" aria-label="Filter exhibits by year range">{yearRanges[decade.id].map((range, index) => <button key={range} aria-pressed={period === index} onClick={() => changePeriod(index)}><span>{periods[index]}</span><strong>{range}</strong></button>)}</div>
        <div className="exhibit-grid">{exhibits.map((exhibit, index) => <article key={`${exhibit.title}-${exhibit.year}`} className="exhibit-card">
          <button className="exhibit-image-button" aria-label={`Open ${exhibit.title} image`} onClick={() => setSelected(exhibit)}>
            <span className={`exhibit-art art-${index}`}><img src={exhibit.image} alt={`${exhibit.title}, a ${category.toLowerCase()} memory from ${exhibit.year}`} loading="lazy" /><span className="exhibit-number">{exhibit.year}</span><span className="art-symbol">{['♫', '✦'][index]}</span></span>
          </button>
          <button className="exhibit-title" onClick={() => setSelected(exhibit)}>{exhibit.title}<ArrowUpRight size={15} /></button>
        </article>)}</div>
        <div className="exhibit-bottom"><p>Showing {exhibits.length} stories from {yearRanges[decade.id][period]}. Open one to explore.</p><ListenButton /></div>
      </div>
    </section>

    <dialog ref={dialog} className="story-dialog" onCancel={() => setSelected(null)} onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
      {selected && <><button className="icon-button close-dialog" aria-label="Close story" onClick={() => setSelected(null)}><X /></button><img className="story-art" src={selected.image} alt={selected.title} /><div className="story-copy"><p className="eyebrow">{selected.tag} · {selected.year}</p><h2>{selected.title}</h2><p>{selected.description}</p><p className="memory-prompt">What does this bring back for you?</p><small>Photo: <a href={selected.imageCreditUrl} target="_blank" rel="noreferrer">{selected.imageCredit}</a></small></div></>}
    </dialog>
  </main>;
}
