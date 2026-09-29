import type { Metadata } from 'next';
import '@fontsource/caveat/500.css';
import '@fontsource/caveat/600.css';
import '@fontsource/caveat/700.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/500.css';
import './globals.css';
import { Shell } from '@/components/shell';
export const metadata:Metadata={title:{default:'Digital Mirror — Relive the moments',template:'%s | Digital Mirror'},description:'A journey through Philippine popular culture. Explore the music, stories, and everyday memories of the 1990s to the 2020s.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Shell>{children}</Shell></body></html>}
