import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const galleryThemes = [
  {
    id: 'technology',
    title: 'TECHNOLOGY',
    ariaLabel: 'Open the first technology slide from the 2000s',
    href: '/galleries/2000s?category=Technology#slide-1',
    note: 'New tools. Same stories.',
  },
  {
    id: 'performance',
    title: 'PERFORMANCE',
    ariaLabel: 'Open Performance slide 4 in gallery details',
    href: '/galleries/2000s?category=Technology&slide=4#slide-4',
    note: 'Different stages. Same passion.',
  },
  {
    id: 'self-image',
    title: 'BODY &\nSELF-IMAGE',
    ariaLabel: 'Open Body and Self-Image slide 7 in gallery details',
    href: '/galleries/2000s?category=Technology&slide=7#slide-7',
    note: 'Style is a story',
  },
] as const;

type GalleryTheme = (typeof galleryThemes)[number];

export function GalleryThemeCard({ theme }: { theme: GalleryTheme }) {
  return (
    <Link
      href={theme.href}
      className={`theme-card theme-card--${theme.id}`}
      aria-label={theme.ariaLabel}
    >
      <span className="theme-card-art" aria-hidden="true" />
      <span className="theme-card-copy" aria-hidden="true">
        <span className="theme-card-title">{theme.title}</span>
        <span className="theme-card-tagline">{theme.note}</span>
        <span className="theme-card-action">
          {theme.id === 'technology' ? 'View first slide' : 'Explore'}{' '}
          <ArrowRight size={17} />
        </span>
      </span>
    </Link>
  );
}
