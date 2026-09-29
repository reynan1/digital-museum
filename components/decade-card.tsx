import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { decades } from '@/lib/data';
export function DecadeCard({decade,index}:{decade:typeof decades[number];index:number}){return <Link href={`/galleries/${decade.id}`} className={`decade-card paper decade-${index}`}><span className="tape"/><div className={`decade-photo era-${index}`}><span className="photo-stamp">{decade.note}</span><div className="keepsake">{['SIDE A • 90 MIN','YOU HAVE 1 NEW MESSAGE','ON REPEAT ↻','RECORDING ●'][index]}</div></div><div className="card-caption"><h2>{decade.id}</h2><p>{decade.title}</p><span className="explore-pill">Explore <ArrowRight size={16}/></span></div></Link>}
