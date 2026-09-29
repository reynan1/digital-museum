import HeroCopy from '../components/hero-copy';
import HomeExplorer from '../components/home-explorer';
import PortalScene from '../components/portal-scene';
import Link from 'next/link';
import { Mouse } from 'lucide-react';
export default function Home(){return <main id="main-content" className="home page"><PortalScene/><HeroCopy/><HomeExplorer/><div className="hero-bottom"><span>EST. IN OUR MEMORIES</span><Link href="/about"><Mouse size={20}/> Discover our story</Link><span>1990 — TODAY</span></div></main>}


