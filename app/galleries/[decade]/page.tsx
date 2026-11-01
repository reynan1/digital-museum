import { notFound } from 'next/navigation';
import { categories, decades, type Category } from '@/lib/data';
import { GalleryDetail } from '@/components/gallery-detail';

export function generateStaticParams() {
  return decades.map((decade) => ({ decade: decade.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ decade: string }>;
}) {
  const { decade } = await params;
  return { title: decade };
}

export default async function Detail({
  params,
  searchParams,
}: {
  params: Promise<{ decade: string }>;
  searchParams: Promise<{ category?: string | string[]; slide?: string | string[] }>;
}) {
  const [{ decade }, { category: requestedCategory, slide: requestedSlide }] = await Promise.all([
    params,
    searchParams,
  ]);
  const era = decades.find((item) => item.id === decade);

  if (!era) notFound();

  const category = Array.isArray(requestedCategory)
    ? requestedCategory[0]
    : requestedCategory;
  const initialCategory = categories.find(
    (item): item is Category => item === category,
  );
  const slideValue = Array.isArray(requestedSlide) ? requestedSlide[0] : requestedSlide;
  const parsedSlide = Number(slideValue);
  const initialSlide = Number.isInteger(parsedSlide) && parsedSlide > 0
    ? parsedSlide
    : undefined;

  return (
    <GalleryDetail
      decade={era}
      initialCategory={initialCategory}
      initialSlide={initialSlide}
    />
  );
}
