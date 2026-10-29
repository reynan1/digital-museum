'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Lightbulb,
  Menu,
  Music2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Sun,
  Volume2,
  VolumeOff,
  VolumeX,
  X,
} from 'lucide-react';
import MemoryGame from './memory-game';

const tracks = [
  {
    title: 'Golden-hour Memories',
    file: 'golden-hour',
    era: 'Original instrumental Ã‚Â· 2000s mood',
  },
  {
    title: 'Postcards from Manila',
    file: 'postcards',
    era: 'Original instrumental Ã‚Â· 1990s mood',
  },
  {
    title: 'Neon Homecoming',
    file: 'neon',
    era: 'Original instrumental Ã‚Â· 2010s mood',
  },
];

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/galleries', label: 'Galleries' },
  { href: '/exam', label: 'Quiz' },
  { href: '/survey', label: 'Survey' },
];

const MusicContext = createContext({
  playing: false,
  toggle: () => {},
});

type VoiceContextValue = {
  voiceMuted: boolean;
  toggleVoice: () => void;
  speak: (text: string, options?: VoiceSpeakOptions) => void;
};

type VoiceSpeakOptions = {
  onStart?: () => void;
  onEnd?: () => void;
  onBlocked?: () => void;
  lock?: boolean;
  force?: boolean;
  cacheAudio?: boolean;
  useCachedAudio?: boolean;
  preferBrowser?: boolean;
};

const VoiceContext = createContext<VoiceContextValue>({
  voiceMuted: false,
  toggleVoice: () => {},
  speak: () => {},
});

export function useVoice() {
  return useContext(VoiceContext);
}

function format(value: number) {
  return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(
    2,
    '0',
  )}`;
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [error, setError] = useState('');

  const audio = useRef<HTMLAudioElement>(null);
  const pendingPlay = useRef(false);
  const speechRequest = useRef<AbortController | null>(null);
  const speechAudio = useRef<HTMLAudioElement | null>(null);
  const speechLifecycle = useRef<VoiceSpeakOptions | null>(null);
  const speechLocked = useRef(false);
  const speechCache = useRef(new Map<string, string>());
  const lastSpoken = useRef({ text: '', at: 0 });

  const finishSpeech = useCallback(() => {
    const onEnd = speechLifecycle.current?.onEnd;
    speechLifecycle.current = null;
    speechLocked.current = false;
    onEnd?.();
  }, []);

  const stopSpeech = useCallback(() => {
    speechRequest.current?.abort();
    speechAudio.current?.pause();
    window.speechSynthesis?.cancel();
    finishSpeech();
  }, [finishSpeech]);

  const speakWithBrowser = useCallback(
    (text: string) => {
      if (
        typeof window === 'undefined' ||
        !('speechSynthesis' in window) ||
        typeof SpeechSynthesisUtterance === 'undefined'
      ) {
        return false;
      }

      const fallback = new SpeechSynthesisUtterance(text);
      fallback.rate = 0.96;
      fallback.pitch = 1.02;

      const finishFallback = () => {
        fallback.onend = null;
        fallback.onerror = null;
        finishSpeech();
      };

      try {
        fallback.onend = finishFallback;
        fallback.onerror = finishFallback;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(fallback);
        return true;
      } catch {
        return false;
      }
    },
    [finishSpeech],
  );

  const speak = useCallback(
    (text: string, options?: VoiceSpeakOptions) => {
      const cleanText = text.replace(/\s+/g, ' ').trim();

      if (!cleanText || cleanText.length > 120 || voiceMuted) {
        stopSpeech();
        return;
      }

      if (speechLocked.current && !options?.force) {
        return;
      }

      const now = Date.now();

      if (
        !options?.force &&
        lastSpoken.current.text === cleanText &&
        now - lastSpoken.current.at < 1300
      ) {
        return;
      }

      lastSpoken.current = {
        text: cleanText,
        at: now,
      };

      stopSpeech();
      setVoiceError('');
      speechLifecycle.current = options || null;
      speechLocked.current = options?.lock === true;
      options?.onStart?.();

      const playCachedAudio = (url: string) => {
        const speechTrack = new Audio(url);
        speechAudio.current = speechTrack;
        speechTrack.onended = () => {
          if (speechAudio.current === speechTrack) {
            finishSpeech();
          }
        };
        return speechTrack.play();
      };

      const cachedUrl = options?.useCachedAudio
        ? speechCache.current.get(cleanText)
        : undefined;

      if (cachedUrl) {
        void playCachedAudio(cachedUrl).catch((speechError) => {
          if (speechError instanceof Error && speechError.name === 'NotAllowedError') {
            options?.onBlocked?.();
            finishSpeech();
            setVoiceError('Your browser blocked audio. Click “Play welcome” to hear Laura.');
            return;
          }

          if (speakWithBrowser(cleanText)) {
            return;
          }

          finishSpeech();
        });
        return;
      }

      if (options?.preferBrowser && speakWithBrowser(cleanText)) {
        return;
      }

      speechRequest.current = new AbortController();
      const signal = speechRequest.current.signal;

      void fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: cleanText }),
        signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            const details = await response.json().catch(() => ({}));

            throw new Error(
              response.status === 503
                ? 'Add your ElevenLabs API key and restart the server.'
                : details.providerMessage ||
                    'ElevenLabs speech failed. Check the server or voice ID.',
            );
          }

          const url = URL.createObjectURL(await response.blob());

          if (signal.aborted) {
            URL.revokeObjectURL(url);
            return;
          }

          if (options?.cacheAudio) {
            speechCache.current.set(cleanText, url);
          }

          try {
            await playCachedAudio(url);
          } catch (speechError) {
            if (speechError instanceof Error && speechError.name === 'NotAllowedError') {
              options?.onBlocked?.();
              finishSpeech();
              setVoiceError('Your browser blocked audio. Click “Play welcome” to hear Laura.');
              return;
            }

            throw speechError;
          }
        })
        .catch((speechError) => {
          if (signal.aborted) {
            return;
          }

          if (speakWithBrowser(cleanText)) {
            return;
          }

          finishSpeech();
          setVoiceError(
            speechError instanceof Error
              ? speechError.message
              : 'ElevenLabs speech failed.',
          );
        });
    },
    [finishSpeech, speakWithBrowser, stopSpeech, voiceMuted],
  );

  useEffect(() => {
    const finePointer = window.matchMedia(
      '(hover: hover) and (pointer: fine)',
    );

    if (!finePointer.matches) {
      return;
    }

    const updatePointerPosition = (event: PointerEvent) => {
      document.documentElement.style.setProperty(
        '--pointer-x',
        `${event.clientX}px`,
      );
      document.documentElement.style.setProperty(
        '--pointer-y',
        `${event.clientY}px`,
      );
      document.documentElement.classList.add('pointer-lamp-active');
    };

    window.addEventListener('pointermove', updatePointerPosition, {
      passive: true,
    });

    return () => {
      window.removeEventListener('pointermove', updatePointerPosition);
      document.documentElement.classList.remove('pointer-lamp-active');
    };
  }, []);

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    const element = audio.current;

    if (!element) {
      return;
    }

    const syncAudioState = () => {
      if (Number.isFinite(element.duration)) {
        setDuration(element.duration);
      }

      setTime(element.currentTime);
    };

    syncAudioState();
    element.addEventListener('loadedmetadata', syncAudioState);
    element.addEventListener('durationchange', syncAudioState);

    return () => {
      element.removeEventListener('loadedmetadata', syncAudioState);
      element.removeEventListener('durationchange', syncAudioState);
    };
  }, [track]);

  useEffect(() => {
    if (audio.current) {
      audio.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    function onPointerOver(event: PointerEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const control = target.closest(
        'a,button,[role="link"],[data-speak],h1,h2,h3,h4,h5,h6,p,li,dt,dd,summary,label,span,strong,small,em,figcaption',
      );

      if (!control || control.getAttribute('aria-hidden') === 'true') {
        return;
      }

      if (control.closest('.hero-welcome-message')) {
        return;
      }

      const text = (
        control.getAttribute('data-speak') ||
        control.getAttribute('aria-label') ||
        control.textContent ||
        ''
      )
        .replace(/\s+/g, ' ')
        .trim();

      if (!text || text.length > 120) {
        return;
      }

      speak(text);
    }

    window.addEventListener('pointerover', onPointerOver);

    return () => {
      window.removeEventListener('pointerover', onPointerOver);
      stopSpeech();
    };
  }, [speak, stopSpeech]);

  useEffect(() => {
    if (!voiceMuted) {
      return;
    }

    stopSpeech();
  }, [stopSpeech, voiceMuted]);

  async function play() {
    try {
      await audio.current?.play();
      setError('');
    } catch {
      setError('Audio could not start. Please try again.');
      setPlaying(false);
    }
  }

  function toggle() {
    if (audio.current?.paused) {
      void play();
      return;
    }

    audio.current?.pause();
  }

  function next(delta: number) {
    pendingPlay.current = playing;
    setTime(0);
    setTrack((value) => {
      return (value + delta + tracks.length) % tracks.length;
    });
  }

  function toggleVoice() {
    setVoiceMuted(!voiceMuted);
  }

  function toggleMenu() {
    setMenu(!menu);
  }

  function goToPreviousTrack() {
    next(-1);
  }

  function goToNextTrack() {
    next(1);
  }

  function handleSeekChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextTime = Number(event.target.value);

    if (audio.current) {
      audio.current.currentTime = nextTime;
      setTime(nextTime);
    }
  }

  function toggleVolume() {
    if (volume === 0) {
      setVolume(0.5);
      return;
    }

    setVolume(0);
  }

  function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setVolume(Number(event.target.value));
  }

  function handleLoadedMetadata() {
    setDuration(audio.current?.duration || 0);

    if (pendingPlay.current) {
      pendingPlay.current = false;
      void play();
    }
  }

  function handleTimeUpdate() {
    setTime(audio.current?.currentTime || 0);
  }

  function handlePlay() {
    setPlaying(true);
  }

  function handlePause() {
    setPlaying(false);
  }

  function handleEnded() {
    pendingPlay.current = true;
    setTrack((value) => {
      return (value + 1) % tracks.length;
    });
  }

  function handleAudioError() {
    setError('The audio file is unavailable.');
  }

  const currentTrack = tracks[track];

  return (
      <VoiceContext.Provider value={{ voiceMuted, toggleVoice, speak }}>
        <MusicContext.Provider value={{ playing, toggle }}>
      <div className="pointer-lamp" aria-hidden="true">
        <Lightbulb size={24} />
      </div>

      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <Link
          href="/"
          className="brand"
          aria-label="Digital Mirror home"
        >
          <Sun />
          <span>
            DIGITAL
            <br />
            MIRROR
          </span>
        </Link>

        <nav
          className={menu ? 'navigation open' : 'navigation'}
          aria-label="Main navigation"
        >
          {navigationItems.map((item) => {
            const isCurrentPage =
              item.href === '/'
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="voice-mute-button"
          type="button"
          aria-pressed={voiceMuted}
          aria-label={voiceMuted ? 'Unmute voice' : 'Mute voice'}
          onClick={toggleVoice}
        >
          {voiceMuted ? <VolumeOff size={17} /> : <Volume2 size={17} />}
          <span>{voiceMuted ? 'Voice muted' : 'Voice on'}</span>
        </button>

        <button className="music-button" onClick={toggle}>
          <Music2 size={17} />
          <span>{playing ? 'Pause Music' : 'Play Music'}</span>
        </button>

        <button
          className="menu-button icon-button"
          aria-label={menu ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menu}
          onClick={toggleMenu}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>

      {children}

      {voiceError && (
        <div className="voice-error" role="status">
          {voiceError}
        </div>
      )}

      <MemoryGame />

      <footer className="music-player" aria-label="Music player">
        <div className={`record ${playing ? 'spinning' : ''}`}>
          <span>DM</span>
        </div>

        <div className="track-info">
          <strong>{currentTrack.title}</strong>
          <span>{currentTrack.era}</span>
        </div>

        <div className="transport">
          <button
            className="icon-button"
            aria-label="Previous track"
            onClick={goToPreviousTrack}
          >
            <SkipBack size={17} />
          </button>

          <button
            className="play-button"
            aria-label={playing ? 'Pause' : 'Play'}
            onClick={toggle}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            className="icon-button"
            aria-label="Next track"
            onClick={goToNextTrack}
          >
            <SkipForward size={17} />
          </button>
        </div>

        <div className="seek-control">
          <span>{format(time)}</span>
          <input
            aria-label="Seek playback"
            type="range"
            min="0"
            max={duration || 1}
            step=".1"
            value={time}
            onChange={handleSeekChange}
          />
          <span>{format(duration)}</span>
        </div>

        <div className="volume-control">
          <button
            className="icon-button"
            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            onClick={toggleVolume}
          >
            {volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          <input
            aria-label="Volume"
            type="range"
            min="0"
            max="1"
            step=".01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>

        <span className="player-label">THE SOUND OF A MEMORY</span>

        <audio
          ref={audio}
          src={`/audio/${currentTrack.file}.wav`}
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onError={handleAudioError}
        />

        {error && (
          <span className="audio-error" role="alert">
            {error}
          </span>
        )}
      </footer>
        </MusicContext.Provider>
      </VoiceContext.Provider>
  );
}

export function ListenButton() {
  const { playing, toggle } = useContext(MusicContext);

  return (
    <button className="text-link" onClick={toggle}>
      <Music2 size={16} />
      {playing ? 'Pause the soundtrack' : 'Play the soundtrack'}
    </button>
  );
}
