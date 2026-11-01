'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Lightbulb, X } from 'lucide-react';
import type { Category, decades } from '@/lib/data';

type PollChoice = 'more-like-me' | 'less-like-me' | 'unsure-yet';

const technologySlides = [
  {
    src: '/technology-evolution-slide.png',
    alt: 'Technology Evolution exhibit comparing 2000s cellphones and computers with present-day connected devices, across a digital museum portal.',
  },
  {
    src: '/technology-social-connections-slide.png',
    alt: 'Social connections in the 2000s compared with today, showing students sharing a text message and friends connecting through current devices.',
  },
  {
    src: '/technology-economic-evolution-slide.png',
    alt: 'Economic evolution from local shops and cash-based transactions in the 2000s to e-commerce, digital payments, and online business today.',
  },
  {
    src: '/technology-performance-slide.png',
    alt: 'Performance in the 2000s compared with today, showing live concerts, broadcast media, streaming, and interactive audiences.',
  },
  {
    src: '/technology-politics-slide.png',
    alt: 'Political communication in the 2000s compared with today, from public rallies and broadcast media to livestreams and online campaigning.',
  },
  {
    src: '/technology-culture-slide.png',
    alt: 'Culture in the 2000s compared with today, from television, radio, and magazines to creators remixing and sharing culture online.',
  },
  {
    src: '/technology-body-self-image-slide.png',
    alt: 'Body and self-image in the 2000s compared with today, from physical mirrors and curated beauty standards to cameras, filters, and social media.',
  },
  {
    src: '/technology-environmental-slide.png',
    alt: 'Environmental care in the 2000s compared with today, from local cleanliness habits to technology-supported, shared greener spaces.',
  },
  {
    src: '/technology-education-slide.png',
    alt: 'Education in the 2000s compared with today, from textbooks and classroom learning to digital tools, collaboration, and online resources.',
  },
  {
    src: '/technology-corridor-slide.png',
    alt: 'The Digital Mirror corridor showing past, present, and future versions of the museum host together in a shared story.',
  },
  {
    src: '/technology-unfinished-mirror-slide.png',
    alt: 'The Unfinished Mirror, a blurred reflection representing a future still being shaped by choices.',
  },
  {
    src: '/technology-prediction-wall-slide.png',
    alt: 'Four plausible 2030 predictions about AI companions, fluid identity, trusted media, and Filipino creators reaching global audiences.',
  },
  {
    src: '/technology-constant-slide.png',
    alt: 'The Constant: across changing devices and eras, people still seek connection, recognition, and belonging.',
  },
  {
    src: '/technology-stepping-back-out-slide.png',
    alt: 'Stepping Back Out: the final mirror shows the visitor surrounded by the museum exhibits and a glowing path forward.',
  },
];

const pollResultSlides: Record<PollChoice, { src: string; alt: string; label: string }> = {
  'more-like-me': {
    src: '/technology-more-like-me-result.png',
    alt: 'More Like Me: a visitor sees her present-day self reflected through past technologies and a vision of 2030.',
    label: 'More like me reflection',
  },
  'less-like-me': {
    src: '/technology-less-like-me-result.png',
    alt: 'Less Like Me: a visitor looks toward a blurred reflection in an ornate digital mirror.',
    label: 'Less like me reflection',
  },
  'unsure-yet': {
    src: '/technology-unsure-yet-result.png',
    alt: "I'm Not Sure Yet: a visitor faces an unfinished digital mirror, leaving the future open to possibility.",
    label: "I'm not sure yet reflection",
  },
};

export function GalleryDetail({
  decade,
  initialCategory,
  initialSlide,
}: {
  decade: (typeof decades)[number];
  initialCategory?: Category;
  initialSlide?: number;
}) {
  const isTechnology = initialCategory === 'Technology';
  const [slideIndex, setSlideIndex] = useState(() =>
    Math.min(Math.max((initialSlide ?? 1) - 1, 0), technologySlides.length - 1),
  );
  const [pollOpen, setPollOpen] = useState(false);
  const [pollChoice, setPollChoice] = useState<PollChoice | null>(null);
  const [pollResult, setPollResult] = useState<PollChoice | null>(null);
  const pollDialog = useRef<HTMLDialogElement>(null);
  const slide = technologySlides[slideIndex];
  const resultSlide = pollResult ? pollResultSlides[pollResult] : null;
  const isPollSlide = slideIndex === 11;
  const isLastSlide = slideIndex === technologySlides.length - 1;

  useEffect(() => {
    const dialog = pollDialog.current;
    if (!dialog) return;

    if (isTechnology && pollOpen && !dialog.open) dialog.showModal();
    else if ((!isTechnology || !pollOpen) && dialog.open) dialog.close();
  }, [isTechnology, pollOpen]);

  function advanceSlide() {
    if (isPollSlide) {
      setPollChoice(null);
      setPollOpen(true);
      return;
    }

    if (isLastSlide) {
      setSlideIndex(0);
      setPollChoice(null);
      setPollResult(null);
      return;
    }

    setSlideIndex((current) => Math.min(technologySlides.length - 1, current + 1));
  }

  return (
    <main
      id="main-content"
      className="detail page detail--slides-only"
      aria-label={`${decade.id} gallery`}
    >
      <div
        className={`ambient-art detail-ambient-art${isTechnology ? ' detail-ambient-art--technology' : ''}`}
        aria-hidden="true"
      />
      {isTechnology && (
        <section
          id={resultSlide ? `${pollResult}-result` : `slide-${slideIndex + 1}`}
          className="gallery-slide"
          aria-label={
            resultSlide
              ? resultSlide.label
              : `Technology slide ${slideIndex + 1} of ${technologySlides.length}`
          }
        >
          <img
            src={resultSlide ? resultSlide.src : slide.src}
            alt={resultSlide ? resultSlide.alt : slide.alt}
          />
          <Link
            href="/galleries"
            className="slide-close"
            aria-label="Close slideshow and return to galleries"
          >
            <X size={21} aria-hidden="true" />
          </Link>
          {resultSlide ? (
            <>
              <button
                className="slide-arrow slide-arrow--previous"
                type="button"
                aria-label="Back to slide 12"
                onClick={() => {
                  setSlideIndex(11);
                  setPollResult(null);
                }}
              >
                <ArrowLeft size={22} aria-hidden="true" />
              </button>
              <button
                className="slide-arrow slide-arrow--next"
                type="button"
                aria-label="Continue to slide 13"
                onClick={() => {
                  setSlideIndex(12);
                  setPollResult(null);
                  setPollChoice(null);
                }}
              >
                <ArrowRight size={22} aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <button
                className="slide-arrow slide-arrow--previous"
                type="button"
                aria-label="Previous slide"
                disabled={slideIndex === 0}
                onClick={() => setSlideIndex((current) => Math.max(0, current - 1))}
              >
                <ArrowLeft size={22} aria-hidden="true" />
              </button>
              <button
                className="slide-arrow slide-arrow--next"
                type="button"
                aria-label={
                  isPollSlide
                    ? 'Open the visitor poll'
                    : isLastSlide
                      ? 'Restart at slide 1'
                      : 'Next slide'
                }
                onClick={advanceSlide}
              >
                <ArrowRight size={22} aria-hidden="true" />
              </button>
            </>
          )}
        </section>
      )}
      <dialog
        ref={pollDialog}
        className="mirror-poll-dialog"
        aria-labelledby="mirror-poll-title"
        onCancel={(event) => {
          event.preventDefault();
          setPollOpen(false);
        }}
      >
        <div
          className="pointer-lamp mirror-poll-pointer-lamp"
          aria-hidden="true"
        >
          <Lightbulb size={24} />
        </div>
        <div className="mirror-poll-card">
          <div className="mirror-poll-copy">
            <header className="mirror-poll-heading">
              <h2 id="mirror-poll-title">The Visitor Poll</h2>
              <span aria-hidden="true" />
            </header>
            <p className="mirror-poll-question">
              In 2030, will your digital self feel more like you, or less?
            </p>
            <div className="mirror-poll-options" role="group" aria-label="Choose your reflection">
              <button
                type="button"
                className={`mirror-poll-option${pollChoice === 'more-like-me' ? ' is-selected' : ''}`}
                aria-pressed={pollChoice === 'more-like-me'}
                onClick={() => {
                  setPollChoice('more-like-me');
                  setPollResult('more-like-me');
                  setPollOpen(false);
                }}
              >
                More like me
              </button>
              <button
                type="button"
                className={`mirror-poll-option${pollChoice === 'less-like-me' ? ' is-selected' : ''}`}
                aria-pressed={pollChoice === 'less-like-me'}
                onClick={() => {
                  setPollChoice('less-like-me');
                  setPollResult('less-like-me');
                  setPollOpen(false);
                }}
              >
                Less like me
              </button>
              <button
                type="button"
                className={`mirror-poll-option${pollChoice === 'unsure-yet' ? ' is-selected' : ''}`}
                aria-pressed={pollChoice === 'unsure-yet'}
                onClick={() => {
                  setPollChoice('unsure-yet');
                  setPollResult('unsure-yet');
                  setPollOpen(false);
                }}
              >
                I'm not sure yet
              </button>
            </div>
            <button
              className="mirror-poll-back"
              type="button"
              onClick={() => setPollOpen(false)}
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Back to slide 12
            </button>
          </div>
          <div
            className="mirror-poll-image"
            role="img"
            aria-label="A visitor facing a glowing digital mirror in the museum."
          />
        </div>
      </dialog>
    </main>
  );
}
