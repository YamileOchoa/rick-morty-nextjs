import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Rick & Morty | Portal Database',
  description: 'Explora todos los personajes del multiverso de Rick and Morty',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="scanline">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-[var(--border)] mt-16 py-8 text-center text-sm text-green-900 font-display tracking-widest">
          <p>⚛ PORTAL DATABASE — WUBBA LUBBA DUB DUB ⚛</p>
        </footer>
      </body>
    </html>
  );
}
