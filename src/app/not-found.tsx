import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="font-display text-8xl font-black text-[var(--border)] mb-4">404</p>
      <p className="font-display text-[var(--green)] text-xl tracking-widest mb-2">DIMENSIÓN NO ENCONTRADA</p>
      <p className="text-gray-500 text-sm mb-8">Este personaje no existe en ninguna dimensión conocida.</p>
      <Link href="/" className="px-6 py-2 border border-[var(--green)] text-[var(--green)] font-display text-sm tracking-widest hover:bg-[var(--green)] hover:text-[var(--bg)] transition-all">
        VOLVER AL PORTAL
      </Link>
    </div>
  );
}
