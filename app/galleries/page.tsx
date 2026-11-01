import {
  GalleryThemeCard,
  galleryThemes,
} from '@/components/gallery-theme-card';

export const metadata = { title: 'Galleries' };

export default function Galleries() {
  return (
    <main id="main-content" className="galleries page">
      <div className="ambient-art" aria-hidden="true" />

      <header className="gallery-heading margin-top-galleries">
{/*         <p className="eyebrow">The memories are waiting</p>
        <h1 className="script-heading">Galleries</h1> */}
        <h2 className="script-semi-heading">
          Philippine Pop Culture Through the Decades
        </h2>
        <p>
          Explore the 2000s, 2010s, and 2020s through three lenses: Technology,
          Performance, and Body &amp; Self-Image.
        </p>
      </header>

      <section className="theme-grid" aria-label="Explore gallery themes">
        {galleryThemes.map((theme) => (
          <GalleryThemeCard key={theme.id} theme={theme} />
        ))}
      </section>

      <p className="gallery-footnote">
        Three lenses. A thousand memories. <span aria-hidden="true" />
      </p>
    </main>
  );
}
