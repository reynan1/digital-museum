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
        <p>Remember the songs your barkada knew by heart in the 2000s? Digital Mirror is an interactive museum that takes you from those years
          to today in 2026, and ahead to what Filipino pop culture could look like in 2030
        </p>
        <p>
          Wander through music, film, fashion, food, games, and everyday life and see how each generation held onto what it loved while making it
          uniquely Filipino. Somewhere along the way, you might catch your own story reflected back at you and start wondering what the next chapter will look like.
        </p>
        <section className="about-team" aria-labelledby="about-team-title">
          <p className="eyebrow">Project team</p>
          <h2 id="about-team-title">Group 5 Members</h2>
          <p className="about-team-context">
            This Digital Mirror project looks at how technology and shared memories shape Filipino popular culture across generations.
          </p>
          <ul>
            <li>Reynan S. Delizo</li>
            <li>Geraldine Tayo</li>
            <li>Jeannica Alexis Pagatpat</li>
            <li>Bob Fortune Maskariño</li>
            <li>Aprilyn Pascua</li>
            <li>Christian Jimmy Uriel Ramos</li>
          </ul>
        </section>
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
