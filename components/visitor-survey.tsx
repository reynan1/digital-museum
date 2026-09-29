'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, Heart } from 'lucide-react';
import { categories, decades } from '@/lib/data';

type SurveyResponse = { rating: number; decade: string; category: string; comment: string; submittedAt: string };

export default function VisitorSurvey() {
  const [rating, setRating] = useState<number | null>(null);
  const [decade, setDecade] = useState('');
  const [category, setCategory] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating === null) return;
    const response: SurveyResponse = { rating, decade, category, comment: comment.trim(), submittedAt: new Date().toISOString() };
    try {
      const previous: SurveyResponse[] = JSON.parse(window.localStorage.getItem('digital-museum-survey-responses') || '[]');
      window.localStorage.setItem('digital-museum-survey-responses', JSON.stringify([...previous, response]));
    } catch {
      // Still show an in-session confirmation if browser storage is unavailable.
    }
    setSubmitted(true);
  }

  return <main id="main-content" className="community-page page"><div className="ambient-art" />
    <div className="community-wrap survey-wrap">
      <Link className="text-link community-back" href="/galleries"><ArrowLeft size={15} /> Back to galleries</Link>
      <header className="community-heading"><p className="eyebrow">HELP US KEEP THE MEMORIES ALIVE</p><h1>Visitor Survey</h1><p>Tell us what resonated with you. Your feedback helps shape future museum visits.</p></header>
      {submitted ? <section className="survey-thanks" role="status"><span><Check size={25} /></span><p className="eyebrow">THANK YOU FOR VISITING</p><h2>Your voice is part of the story.</h2><p>Your response has been saved in this browser. It is not sent to a server.</p><div><button className="community-primary" onClick={() => setSubmitted(false)}>Send another response</button><Link className="game-reset" href="/galleries">Keep exploring <ArrowRight size={15} /></Link></div></section> :
        <form className="survey-card" onSubmit={submit}>
          <fieldset className="survey-question"><legend>How was your museum visit? <span>*</span></legend><p>Choose a rating from 1 (not great) to 5 (wonderful).</p><div className="rating-options">{[1, 2, 3, 4, 5].map((value) => <label key={value} className={rating === value ? 'selected' : ''}><input type="radio" name="visit-rating" value={value} checked={rating === value} onChange={() => setRating(value)} required /><span>{value}</span></label>)}</div><div className="rating-ends"><span>Not great</span><span>Wonderful</span></div></fieldset>
          <label className="survey-field"><span>Which decade did you enjoy most?</span><select value={decade} onChange={(event) => setDecade(event.target.value)}><option value="">Choose a decade (optional)</option>{decades.map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}</select></label>
          <label className="survey-field"><span>Which gallery aspect stood out?</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Choose an aspect (optional)</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="survey-field"><span>Anything you would like to share?</span><textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={500} rows={4} placeholder="A memory, an idea, or something you would like to see next…" /><small>{comment.length}/500</small></label>
          <p className="survey-privacy"><Heart size={14} /> This survey is anonymous. Responses stay in this browser and are not sent to a server.</p>
          <button className="community-primary survey-submit" type="submit" disabled={rating === null}>Send feedback <ArrowRight size={16} /></button>
        </form>}
      <p className="community-footnote">Thanks for helping us celebrate the stories we share.</p>
    </div>
  </main>;
}
