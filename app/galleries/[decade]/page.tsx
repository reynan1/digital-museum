import { notFound } from 'next/navigation';
import { decades } from '@/lib/data';
import { GalleryDetail } from '@/components/gallery-detail';
export function generateStaticParams(){return decades.map(d=>({decade:d.id}))}
export async function generateMetadata({params}:{params:Promise<{decade:string}>}){const {decade}=await params;return {title:decade}}
export default async function Detail({params}:{params:Promise<{decade:string}>}){const {decade}=await params;const era=decades.find(d=>d.id===decade);if(!era)notFound();return <GalleryDetail decade={era}/>}
