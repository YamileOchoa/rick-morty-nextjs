import SearchClient from "@/components/SearchClient";

export const metadata = { title: "Búsqueda | Rick & Morty Portal DB" };

// Esta página es CSR puro (el componente SearchClient tiene 'use client')
export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <p className="font-display text-xs tracking-[0.4em] text-[var(--cyan)]">
          BÚSQUEDA EN TIEMPO REAL
        </p>
        <h1 className="font-display text-3xl font-black text-[var(--green)] mt-2">
          EXPLORAR MULTIVERSO
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Filtra por nombre, estado, tipo o género — CSR con useState/useEffect
        </p>
      </div>
      <SearchClient />
    </div>
  );
}
