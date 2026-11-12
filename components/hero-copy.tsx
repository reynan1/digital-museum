'use client';

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useVoice } from './shell';

const welcomeLines = [
  { text: 'Beyond this mirror, beyond this portal—time unfolds.', pauseAfter: 0 },
  { text: 'Welcome to our Digital Museum. I’m Laura, your tour guide on a journey through Philippine pop culture.', pauseAfter: 0.5 },
  { text: 'As we step through, we’ll explore the trends that shaped the Philippines from 2000 to 2010,', pauseAfter: 0 },
  { text: 'see how they’ve evolved in the present, and then look into one last mirror that hasn’t happened yet.', pauseAfter: 0 },
  { text: 'Follow me.', pauseAfter: 0 },
  { text: 'Our tour begins now.', pauseAfter: 0 },
] as const;

function getWelcomeLineIndex(currentTime: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) {
    return 0;
  }

  const weights = welcomeLines.map(({ text, pauseAfter }) =>
    text.trim().split(/\s+/).length + pauseAfter * 2.7,
  );
  const position = (currentTime / duration) * weights.reduce((sum, weight) => sum + weight, 0);
  let elapsedWeight = 0;

  for (let index = 0; index < weights.length; index += 1) {
    elapsedWeight += weights[index];
    if (position < elapsedWeight) {
      return index;
    }
  }

  return welcomeLines.length - 1;
}

const memories = [
  { text: 'Rewinding a mixtape. One favorite song, again.', decade: '1990s' },
  { text: 'One last text before your load runs out.', decade: '2000s' },
  { text: 'A playlist shared. A whole barkada singing.', decade: '2010s' },
  { text: 'New voices. The next song to call our own.', decade: '2020s' },
];

export default function HeroCopy() {
  const host = useRef<HTMLDivElement>(null);
  const [memory, setMemory] = useState(-1);
  const [entering, setEntering] = useState(false);
  const [welcomeLine, setWelcomeLine] = useState(0);
  const [welcomeNeedsGesture, setWelcomeNeedsGesture] = useState(false);
  const { voiceMuted, setVoiceMuted } = useVoice();
  const router = useRouter();
  const current = memories[memory];
  const guide = useRef<HTMLDivElement>(null);
  const hostGirl = useRef<HTMLImageElement>(null);
  const absorbedGirl = useRef<HTMLImageElement>(null);
  const hostVoice = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setVoiceMuted(false);
    return () => setVoiceMuted(true);
  }, [setVoiceMuted]);

  useEffect(() => {
    const audio = hostVoice.current;

    if (!audio) {
      return;
    }

    let cancelled = false;
    const handlePlay = () => setWelcomeLine(0);
    const handleEnded = () => {
      setWelcomeLine(welcomeLines.length - 1);
    };
    const handleTimeUpdate = () => {
      setWelcomeLine(getWelcomeLineIndex(audio.currentTime, audio.duration));
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    if (voiceMuted) {
      audio.pause();
      audio.currentTime = 0;
      setWelcomeLine(0);
      setWelcomeNeedsGesture(false);
    } else {
      audio.currentTime = 0;
      void audio
        .play()
        .then(() => {
          if (!cancelled) {
            setWelcomeNeedsGesture(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setWelcomeNeedsGesture(true);
          }
        });
    }

    return () => {
      cancelled = true;
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [voiceMuted]);

  function replayWelcome() {
    const audio = hostVoice.current;

    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    setWelcomeLine(0);
    void audio
      .play()
      .then(() => setWelcomeNeedsGesture(false))
      .catch(() => setWelcomeNeedsGesture(true));
  }

  useLayoutEffect(() => {
    const girl = hostGirl.current;
    const absorbed = absorbedGirl.current;

    if (!girl || !absorbed) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const context = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(girl, { autoAlpha: 1, clearProps: 'transform' });
        gsap.set(absorbed, { autoAlpha: 0, clearProps: 'transform' });
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .set(absorbed, { autoAlpha: 0, x: 0, y: 0, scale: 1, rotate: 0, clearProps: 'filter' })
        .set(girl, { autoAlpha: 0, x: -72, y: 28, scale: .8, rotate: -6, transformOrigin: '50% 100%' })
        .to(girl, { autoAlpha: 1, x: 0, y: 0, scale: 1, rotate: 0, duration: 1.05 });

      gsap.to(girl, {
        y: -8,
        rotate: 1,
        duration: 2.8,
        delay: 1.1,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }, guide);

    return () => context.revert();
  }, []);

  function enterPortal(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    if (entering) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      router.push('/galleries');
      return;
    }

    setEntering(true);
    window.dispatchEvent(new Event('digital-mirror:open-portal'));

    const girl = hostGirl.current;
    const absorbed = absorbedGirl.current;

    if (!girl || !absorbed) {
      window.setTimeout(() => router.push('/galleries'), 900);
      return;
    }

    const guideBounds = guide.current?.getBoundingClientRect();
    const portalCenterX = window.innerWidth * .5;
    const portalCenterY = window.innerHeight * .47;
    const pullX = guideBounds ? portalCenterX - (guideBounds.left + guideBounds.width * .5) : -72;
    const pullY = guideBounds ? portalCenterY - (guideBounds.top + guideBounds.height * .5) : -52;

    gsap.killTweensOf([girl, absorbed]);
    const absorption = gsap.timeline({
      onComplete: () => router.push('/galleries'),
    });
    absorption
      .to(girl, { autoAlpha: 0, duration: .16, ease: 'power2.out' })
      .set(absorbed, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        filter: 'drop-shadow(0 18px 18px #0007) drop-shadow(0 0 25px #f5bd6640)',
        transformOrigin: '50% 54%',
      })
      .to(absorbed, {
        x: pullX,
        y: pullY,
        scale: .12,
        autoAlpha: 0,
        rotate: -24,
        filter: 'blur(5px) drop-shadow(0 0 24px #8befff)',
        duration: .74,
        ease: 'power3.in',
      });
  }

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

  return <>
  <div ref={host} className="hero-copy interactive-hero" onPointerMove={follow} onPointerLeave={reset}>
    <p className="eyebrow">A journey through<br />Philippine popular culture</p>
    <div className="hero-title-wrap">
      <h1><span>Digital</span><span>Mirror</span></h1>
      <button className="memory-sun" aria-label="Reveal a memory" aria-controls="hero-memory" onClick={() => setMemory(value => (value + 1) % memories.length)}>
        <span className="memory-sun-icon" key={memory} aria-hidden="true">☀</span>
        <span className="sun-tip">Tap for a memory</span>
      </button>
    </div>
    <p className="hero-subtitle">Relive the moments.<br />Rediscover the culture.</p>
    <Link className={entering ? 'portal-button opening' : 'portal-button'} href="/galleries" aria-busy={entering} onClick={enterPortal}>
      {entering ? 'Opening the time portal...' : 'Enter the time portal'} <ArrowRight size={20} />
    </Link>
    <div id="hero-memory" className="hero-memory" aria-live="polite" aria-atomic="true">
      {current ? <div key={memory} className="memory-reveal"><p><Sparkles size={14} />{current.text}</p><Link href={`/galleries/${current.decade}`}>Rediscover the {current.decade} <ArrowRight size={13} /></Link></div> : <p className="small-note"><Sparkles size={13} /> Four decades. Countless memories. One shared story.</p>}
    </div>
  </div>
  <div ref={guide} className="hero-guide" aria-label="Your guide to the Digital Mirror digital museum">
    <div className="hero-welcome-message is-visible" role="status" aria-live="polite">
      <span className="hero-welcome-speaker">Laura <small>tour guide</small></span>
      <span className="hero-welcome-subtitle" key={welcomeLine}>{welcomeLines[welcomeLine].text}</span>
      {welcomeNeedsGesture && <button className="hero-welcome-replay" type="button" onClick={replayWelcome}><Play size={12} fill="currentColor" /> Play Laura&apos;s welcome</button>}
    </div>
    <img ref={hostGirl} className="hero-host-girl" src="/host-girl.webp" alt="Your animated guide welcoming you to the Digital Mirror digital museum" />
    <img ref={absorbedGirl} className="hero-host-girl hero-host-girl-absorbed" src="/host-girl-absorbed.webp" alt="" aria-hidden="true" />
    <audio ref={hostVoice} src="/audio/home-host.mp3" preload="auto" aria-label="Laura welcomes you to the Digital Mirror digital museum" />
  </div>
  </>
}
