import Image from "next/image";
import Link from "next/link";
import { getAllCharacterIds, getCharacterById } from "@/lib/api";
import { notFound } from "next/navigation";

// ISR: revalidación cada 10 días
export const revalidate = 864000;

// Generación estática de todas las rutas por ID
export async function generateStaticParams() {
  const ids = await getAllCharacterIds();
  return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const character = await getCharacterById(Number(params.id));
    return { title: `${character.name} | Rick & Morty Portal DB` };
  } catch {
    return { title: "Personaje no encontrado" };
  }
}

const statusStyles = {
  Alive: {
    dot: "bg-[var(--green)] shadow-[0_0_10px_#00ff88]",
    text: "text-[var(--green)]",
    badge: "border-green-800 text-[var(--green)]",
  },
  Dead: {
    dot: "bg-red-500",
    text: "text-red-400",
    badge: "border-red-800 text-red-400",
  },
  unknown: {
    dot: "bg-gray-500",
    text: "text-gray-400",
    badge: "border-gray-700 text-gray-400",
  },
};

export default async function CharacterPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  let character;
  try {
    character = await getCharacterById(id);
  } catch {
    notFound();
  }

  const style = statusStyles[character.status] || statusStyles.unknown;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--green)] font-display text-xs tracking-widest mb-8 transition-colors"
      >
        ← VOLVER AL INICIO
      </Link>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Imagen */}
        <div className="md:col-span-2 space-y-4">
          <div className="relative rounded-lg overflow-hidden portal-glow">
            <Image
              src={character.image}
              alt={character.name}
              width={400}
              height={400}
              className="w-full object-cover"
              priority // Primera imagen visible => no lazy
            />
            <div className="absolute top-3 left-3">
              <span className="font-display text-xs tracking-widest bg-[var(--bg)]/80 text-[var(--green)] px-2 py-1 rounded border border-[var(--border)]">
                #{String(character.id).padStart(3, "0")}
              </span>
            </div>
          </div>

          {/* Status badge */}
          <div
            className={`flex items-center gap-3 border rounded-lg px-4 py-3 bg-[var(--card)] ${style.badge}`}
          >
            <span
              className={`w-3 h-3 rounded-full flex-shrink-0 ${style.dot}`}
            />
            <div>
              <p className="font-display text-xs tracking-widest text-gray-500">
                ESTADO
              </p>
              <p className={`font-display font-bold text-sm ${style.text}`}>
                {character.status}
              </p>
            </div>
          </div>

          {/* ISR info badge */}
          <div className="border border-[var(--border)] rounded-lg px-4 py-3 bg-[var(--card)] text-center">
            <p className="font-display text-xs tracking-widest text-gray-600">
              ESTRATEGIA DE RENDER
            </p>
            <p className="font-display text-xs text-[var(--cyan)] mt-1">
              ISR — revalidate 10 días
            </p>
          </div>
        </div>

        {/* Datos */}
        <div className="md:col-span-3 space-y-6">
          <div>
            <p className="font-display text-xs tracking-[0.4em] text-[var(--cyan)]">
              ENTIDAD REGISTRADA
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-black text-[var(--green)] mt-1 leading-tight">
              {character.name}
            </h1>
          </div>

          {/* Grid de campos */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "ESPECIE", value: character.species },
              { label: "GÉNERO", value: character.gender },
              { label: "TIPO", value: character.type || "N/A" },
              { label: "ESTADO", value: character.status },
            ].map((field) => (
              <div
                key={field.label}
                className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-3"
              >
                <p className="font-display text-xs tracking-widest text-gray-600">
                  {field.label}
                </p>
                <p className="text-sm text-green-300 mt-1 font-semibold">
                  {field.value}
                </p>
              </div>
            ))}
          </div>

          {/* Origen y Ubicación */}
          <div className="space-y-3">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
              <p className="font-display text-xs tracking-widest text-[var(--cyan)] mb-1">
                ORIGEN
              </p>
              <p className="text-green-300 font-semibold">
                {character.origin.name}
              </p>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
              <p className="font-display text-xs tracking-widest text-[var(--cyan)] mb-1">
                UBICACIÓN ACTUAL
              </p>
              <p className="text-green-300 font-semibold">
                {character.location.name}
              </p>
            </div>
          </div>

          {/* Episodios */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
            <p className="font-display text-xs tracking-widest text-[var(--cyan)] mb-3">
              EPISODIOS — {character.episode.length} apariciones
            </p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {character.episode.map((ep) => {
                const epNum = ep.split("/").pop();
                return (
                  <span
                    key={ep}
                    className="font-display text-xs px-2 py-1 border border-[var(--border)] text-gray-400 rounded hover:border-[var(--green)] hover:text-[var(--green)] transition-colors"
                  >
                    EP {epNum}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 space-y-2">
            <p className="font-display text-xs tracking-widest text-[var(--cyan)] mb-2">
              METADATA
            </p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600 font-display tracking-wider">
                  CREADO
                </span>
                <span className="text-gray-400">
                  {new Date(character.created).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-display tracking-wider">
                  URL API
                </span>
                <span className="text-gray-400 truncate ml-4">
                  {character.url}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación entre personajes */}
      <div className="flex justify-between mt-10 pt-6 border-t border-[var(--border)]">
        {id > 1 && (
          <Link
            href={`/character/${id - 1}`}
            className="font-display text-xs tracking-widest text-gray-500 hover:text-[var(--green)] transition-colors"
          >
            ← ANTERIOR
          </Link>
        )}
        <div className="flex-1" />
        <Link
          href={`/character/${id + 1}`}
          className="font-display text-xs tracking-widest text-gray-500 hover:text-[var(--green)] transition-colors"
        >
          SIGUIENTE →
        </Link>
      </div>
    </div>
  );
}
