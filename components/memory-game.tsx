'use client';

import { useEffect, useState } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { decades } from '../lib/data';

type Card = { id: number; value: string; decade: string };
type Difficulty = 'easy' | 'normal' | 'hard';
const difficultyRows: Record<Difficulty, number> = { easy: 2, normal: 4, hard: 8 };

function makeCards(difficulty: Difficulty): Card[] {
  const pairCount = difficultyRows[difficulty] * 2;
  const picks = Array.from({ length: pairCount }, (_, index) => {
    const decade = decades[index % decades.length];
    return { value: decade.objects[Math.floor(Math.random() * decade.objects.length)], decade: decade.id };
  });
  const cards = picks.flatMap((pick, index) => [
    { id: index * 2, ...pick },
    { id: index * 2 + 1, ...pick },
  ]);
  return cards.sort(() => Math.random() - .5);
}

export default function MemoryGame() {
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');

  useEffect(() => {
    const saved = Number(window.localStorage.getItem(`digital-museum-memory-best-${difficulty}`));
    if (saved > 0) setBest(saved);
  }, [difficulty]);

  function startGame() {
    setCards(makeCards(difficulty));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  }

  function changeDifficulty(next: Difficulty) {
    setDifficulty(next);
    setBest(null);
    setCards(makeCards(next));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  }

  function begin() {
    startGame();
    setOpen(true);
  }

  function choose(card: Card) {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.value)) return;
    const next = [...flipped, card.id];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((value) => value + 1);
      const first = cards.find((item) => item.id === next[0]);
      if (first?.value === card.value) {
        setMatched((value) => [...value, card.value]);
        setFlipped([]);
      } else {
        window.setTimeout(() => setFlipped([]), 850);
      }
    }
  }

  useEffect(() => {
    if (matched.length !== cards.length / 2 || moves === 0) return;
    setBest((current) => {
      const score = current === null ? moves : Math.min(current, moves);
      window.localStorage.setItem(`digital-museum-memory-best-${difficulty}`, String(score));
      return score;
    });
  }, [matched, moves, cards.length, difficulty]);

  return <>
    <button className="game-launcher" onClick={begin}><span aria-hidden="true">▦</span> Play Memory Match</button>
    {open && <div className="game-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section className="memory-game" role="dialog" aria-modal="true" aria-labelledby="memory-game-title">
        <header className="memory-game-header"><div><p className="eyebrow">A LITTLE MUSEUM GAME</p><h2 id="memory-game-title">Memory Match</h2></div><button className="icon-button" aria-label="Close game" onClick={() => setOpen(false)}><X /></button></header>
        <p className="memory-game-intro">Find the matching pairs hidden across four decades. Choose how big a challenge you want.</p>
        <div className="game-difficulties" role="group" aria-label="Game difficulty">
          {(['easy', 'normal', 'hard'] as const).map((level) => <button key={level} aria-pressed={difficulty === level} onClick={() => changeDifficulty(level)}>{level}<span>{difficultyRows[level]} rows</span></button>)}
        </div>
        <div className="memory-game-status"><span>Turns <strong>{moves}</strong></span><span>Best <strong>{best ?? '—'}</strong></span><button className="game-reset" onClick={startGame}><RotateCcw size={14} /> New round</button></div>
        <div className={`memory-board memory-board-${difficulty}`} aria-label={`${difficultyRows[difficulty]} row memory match board`}>
          {cards.map((card) => {
            const revealed = flipped.includes(card.id) || matched.includes(card.value);
            return <button key={card.id} className={`memory-card${revealed ? ' revealed' : ''}${matched.includes(card.value) ? ' matched' : ''}`} onClick={() => choose(card)} aria-label={revealed ? `${card.value}, ${card.decade}` : 'Hidden memory'} aria-pressed={revealed}>
              {revealed ? <><strong>{card.value}</strong><span>{card.decade}</span></> : <span aria-hidden="true">✦</span>}
            </button>;
          })}
        </div>
        {matched.length === cards.length / 2 && cards.length > 0 && <p className="game-win" role="status">All memories found in {moves} turns. Lovely remembering!</p>}
      </section>
    </div>}
  </>;
}
