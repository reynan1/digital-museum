'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

const questions = [
  { prompt: 'Which decade is called “the mixtape years” in the museum?', choices: ['1990s', '2000s', '2010s', '2020s'], answer: 0, note: 'The 1990s gallery highlights cassette mixtapes and the everyday rituals around them.' },
  { prompt: 'Which decade brought the early rise of the internet into Filipino pop culture?', choices: ['1990s', '2000s', '2010s', '2020s'], answer: 1, note: 'The 2000s gallery explores pop culture, early internet, and a new kind of connection.' },
  { prompt: 'Which gallery aspect explores merienda and sari-sari store favorites?', choices: ['Fashion', 'Food', 'Technology', 'TV & Film'], answer: 1, note: 'Food connects familiar snacks, family recipes, and neighborhood memories.' },
  { prompt: 'In which decade did playlists and social feeds shape a new digital generation?', choices: ['1990s', '2000s', '2010s', '2020s'], answer: 2, note: 'The 2010s gallery follows playlists, streaming stories, and social feeds.' },
  { prompt: 'Which aspect includes street games and neighborhood basketball?', choices: ['Music', 'Lifestyle', 'Games & Sports', 'Fashion'], answer: 2, note: 'Games & Sports looks at shared play, friendly matches, and neighborhood fun.' },
  { prompt: 'Which decade’s story is still unfolding with new voices and connected communities?', choices: ['1990s', '2000s', '2010s', '2020s'], answer: 3, note: 'The 2020s gallery celebrates new voices and communities without borders.' },
];

export default function MuseumExam() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [finished, setFinished] = useState(false);
  const score = answers.reduce<number>((total, answer, index) => total + (answer === questions[index].answer ? 1 : 0), 0);
  const selected = answers[step];

  function reset() {
    setStep(0);
    setAnswers(Array(questions.length).fill(null));
    setFinished(false);
  }

  return <main id="main-content" className="community-page page"><div className="ambient-art" />
    <div className="community-wrap">
      <Link className="text-link community-back" href="/galleries"><ArrowLeft size={15} /> Back to galleries</Link>
      <header className="community-heading"><p className="eyebrow">DIGITAL MUSEUM CHALLENGE</p><h1>Memory Lane Quiz</h1><p>How well do you know the memories, music, and everyday culture in our galleries?</p></header>
      <section className="quiz-card" aria-label="Museum knowledge quiz">
        {!finished ? <>
          <div className="quiz-progress-label"><span>Question {step + 1} of {questions.length}</span><span>{Math.round((step / questions.length) * 100)}% complete</span></div>
          <div className="quiz-progress"><span style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
          <h2>{questions[step].prompt}</h2>
          <div className="quiz-choices" role="group" aria-label="Choose your answer">{questions[step].choices.map((choice, index) => <button key={choice} aria-pressed={selected === index} onClick={() => setAnswers((current) => current.map((answer, i) => i === step ? index : answer))}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>)}</div>
          {selected !== null && <p className="quiz-hint"><Sparkles size={15} />{questions[step].note}</p>}
          <div className="quiz-actions"><button className="game-reset" disabled={step === 0} onClick={() => setStep((current) => current - 1)}><ArrowLeft size={15} /> Previous</button>{step < questions.length - 1 ? <button className="community-primary" disabled={selected === null} onClick={() => setStep((current) => current + 1)}>Next <ArrowRight size={16} /></button> : <button className="community-primary" disabled={selected === null} onClick={() => setFinished(true)}>See my score <ArrowRight size={16} /></button>}</div>
        </> : <div className="quiz-result" role="status"><Sparkles size={27} /><p className="eyebrow">YOUR MUSEUM SCORE</p><strong>{score}<span> / {questions.length}</span></strong><h2>{score === questions.length ? 'A true memory keeper!' : score >= 4 ? 'You know your way around!' : 'There are more memories to explore!'}</h2><p>Visit the decade galleries to discover more stories and try again.</p><div><button className="community-primary" onClick={reset}><RotateCcw size={15} /> Try again</button><Link className="game-reset" href="/galleries">Explore galleries <ArrowRight size={15} /></Link></div></div>}
      </section>
      <p className="community-footnote">A little remembering is a lovely way to learn.</p>
    </div>
  </main>;
}
