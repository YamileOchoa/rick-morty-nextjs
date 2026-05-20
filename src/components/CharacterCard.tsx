import Image from "next/image";
import Link from "next/link";
import { Character } from "@/types/character";

interface Props {
  character: Character;
}

const statusColor = {
  Alive: "text-[var(--green)]",
  Dead: "text-red-400",
  unknown: "text-gray-500",
};
const statusDot = {
  Alive: "bg-[var(--green)] shadow-[0_0_8px_#00ff88]",
  Dead: "bg-red-500",
  unknown: "bg-gray-500",
};

export default function CharacterCard({ character }: Props) {
  return (
    <Link href={`/character/${character.id}`}>
      <article className="portal-glow bg-[var(--card)] rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
        <div className="relative overflow-hidden">
          {/* Lazy Loading con Next/Image */}
          <Image
            src={character.image}
            alt={character.name}
            width={300}
            height={300}
            loading="lazy" // Lazy Loading explícito
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-transparent to-transparent" />
          <div className="absolute bottom-2 left-2 right-2">
            <p className="font-display text-xs tracking-widest text-[var(--green)] opacity-70">
              #{String(character.id).padStart(3, "0")}
            </p>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <h2 className="font-display font-bold text-sm tracking-wide text-[var(--green)] truncate group-hover:text-[var(--cyan)] transition-colors">
            {character.name}
          </h2>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[character.status]}`}
            />
            <span
              className={`text-xs font-semibold ${statusColor[character.status]}`}
            >
              {character.status}
            </span>
            <span className="text-gray-600">—</span>
            <span className="text-xs text-gray-400 truncate">
              {character.species}
            </span>
          </div>
          <div className="pt-1 border-t border-[var(--border)]">
            <p className="text-xs text-gray-500 truncate">
              {character.location.name}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
