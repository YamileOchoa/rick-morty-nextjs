// SSR + SSG (force-cache): se renderiza en el servidor y se cachea
import CharacterCard from '@/components/CharacterCard';
import { getAllCharacters } from '@/lib/api';
import Link from 'next/link';

// force-cache en fetch => SSG comportamiento (se cachea en build/primer request)
export const dynamic = 'force-static';

export default async function HomePage() {
  const data = await getAllCharacters(1);
  const { results: characters, info } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero */}
      <section className="text-center mb-14 space-y-4">
        <p className="font-display text-xs tracking-[0.4em] text-[var(--cyan)] uppercase">Interdimensional Database</p>
        <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight text-[var(--green)] leading-tight">
          RICK &amp; MORTY
          <span className="block text-2xl md:text-3xl text-[var(--cyan)] mt-1">PORTAL DATABASE</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
          {info.count} entidades registradas en el multiverso. Explora cada dimensión, cada especie, cada destino.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link href="/search"
            className="px-6 py-2 border border-[var(--green)] text-[var(--green)] font-display text-sm tracking-widest hover:bg-[var(--green)] hover:text-[var(--bg)] transition-all duration-300">
            BUSCAR PERSONAJES
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-12 border border-[var(--border)] rounded-lg p-4 bg-[var(--card)]">
        {[
          { label: 'PERSONAJES', value: info.count },
          { label: 'PÁGINAS', value: info.pages },
          { label: 'DIMENSIONES', value: '∞' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-2xl font-black text-[var(--green)]">{s.value}</p>
            <p className="font-display text-xs tracking-widest text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Grid de personajes - SSG con Lazy Loading */}
      <section>
        <h2 className="font-display text-sm tracking-[0.3em] text-[var(--cyan)] mb-6">
          — PRIMERA PÁGINA (SSG + LAZY LOADING)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {characters.map((character) => (
            <div key={character.id} className="animate-fadeIn">
              <CharacterCard character={character} />
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/search"
            className="inline-block px-8 py-3 border border-[var(--border)] text-gray-400 font-display text-sm tracking-widest hover:border-[var(--green)] hover:text-[var(--green)] transition-all duration-300">
            VER TODOS LOS PERSONAJES →
          </Link>
        </div>
      </section>
    </div>
  );
}
