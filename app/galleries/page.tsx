import { DecadeCard } from '@/components/decade-card';
import { decades } from '@/lib/data';
export const metadata={title:'Galleries'};
export default function Galleries(){return <main id="main-content" className="galleries page"><div className="ambient-art"/><header className="gallery-heading"><p className="eyebrow">The memories are waiting</p><h1 className="script-heading">Galleries</h1><h2>Explore by decade</h2><p>Step into the music, films, fashion, games, food,<br className="desktop-break"/> technology, and stories that defined an era.</p></header><section className="decade-grid" aria-label="Explore decades">{decades.map((d,i)=><DecadeCard key={d.id} decade={d} index={i}/>)}</section><p className="gallery-footnote">Some things change. The feeling stays. <span>✦</span></p></main>}
