import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg font-black tracking-widest text-[var(--green)] hover:text-[var(--cyan)] transition-colors"
        >
          ⚛ RICK &amp; MORTY
        </Link>
        <div className="flex gap-6 text-sm font-display tracking-wider">
          <Link
            href="/"
            className="text-green-400 hover:text-[var(--green)] transition-colors"
          >
            INICIO
          </Link>
          <Link
            href="/search"
            className="text-green-400 hover:text-[var(--green)] transition-colors"
          >
            BÚSQUEDA
          </Link>
        </div>
      </div>
    </nav>
  );
}
