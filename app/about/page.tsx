import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
export const metadata={title:'About'};
export default function About(){
  return <main id="main-content" className="about page">
    <div className="about-art"/>
    <section className="about-copy">
        <span className="script-heading">About</span>
        <h1>Digital Mirror</h1>
        <p className="eyebrow">A journey through Philippine popular culture</p>
        <p>Digital Mirror is an interactive museum that celebrates the stories, people, places, and trends that shaped Philippine popular culture from the 1990s to the 2020s.</p>
        <p>Through music, film, fashion, food, games, and everyday life, we explore how generations connect, adapt, and create a uniquely Filipino identity.</p>
        <blockquote className="paper quote">Different eras.<br/>Same spirit.<br/>Always Filipino. 
          <span>☀</span>
        </blockquote>
        <Link className="text-link" href="/galleries">Find your decade <ArrowRight size={17}/></Link>
      </section>
      <aside className="paper purpose">
        <span className="tape"/><p className="eyebrow">Our purpose</p>
        <h2>Keep the memories alive.</h2>
        <p>To preserve and showcase Philippine popular culture, inspire appreciation across generations, and reflect on how our shared experiences continue to shape who we are today.</p>
        <span className="heart">♡</span>
      </aside>
    </main>}
