"use client";

import { useState, useEffect, useCallback } from "react";
import { Character } from "@/types/character";
import { searchCharacters } from "@/lib/api";
import CharacterCard from "./CharacterCard";

const STATUS_OPTIONS = ["", "alive", "dead", "unknown"];
const GENDER_OPTIONS = ["", "female", "male", "genderless", "unknown"];

export default function SearchClient() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async () => {
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const data = await searchCharacters({ name, status, type, gender });
      setCharacters(data.results);
      setCount(data.info.count);
    } catch {
      setError("No se encontraron personajes con esos filtros.");
      setCharacters([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [name, status, type, gender]);

  // Búsqueda en tiempo real con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (name.length >= 2 || status || gender) {
        doSearch();
      } else if (name.length === 0 && !status && !gender && !type) {
        setCharacters([]);
        setSearched(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [name, status, gender, type, doSearch]);

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="font-display text-xs tracking-widest text-[var(--cyan)]">
              NOMBRE
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Rick, Morty..."
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 text-sm text-green-300 placeholder-gray-600 focus:outline-none focus:border-[var(--green)] transition-colors"
            />
          </div>
          {/* Status */}
          <div className="space-y-1">
            <label className="font-display text-xs tracking-widest text-[var(--cyan)]">
              ESTADO
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 text-sm text-green-300 focus:outline-none focus:border-[var(--green)] transition-colors"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s ? s.charAt(0).toUpperCase() + s.slice(1) : "Todos"}
                </option>
              ))}
            </select>
          </div>
          {/* Type */}
          <div className="space-y-1">
            <label className="font-display text-xs tracking-widest text-[var(--cyan)]">
              TIPO
            </label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Ej: Parasite, Robot..."
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 text-sm text-green-300 placeholder-gray-600 focus:outline-none focus:border-[var(--green)] transition-colors"
            />
          </div>
          {/* Gender */}
          <div className="space-y-1">
            <label className="font-display text-xs tracking-widest text-[var(--cyan)]">
              GÉNERO
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 text-sm text-green-300 focus:outline-none focus:border-[var(--green)] transition-colors"
            >
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g ? g.charAt(0).toUpperCase() + g.slice(1) : "Todos"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
          <p className="text-xs text-gray-600 font-display tracking-wider">
            {loading
              ? "BUSCANDO..."
              : searched
                ? `${count} RESULTADOS`
                : "ESCRIBE PARA BUSCAR"}
          </p>
          {(name || status || type || gender) && (
            <button
              onClick={() => {
                setName("");
                setStatus("");
                setType("");
                setGender("");
                setCharacters([]);
                setSearched(false);
              }}
              className="text-xs text-gray-500 hover:text-red-400 font-display tracking-wider transition-colors"
            >
              LIMPIAR FILTROS ✕
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden animate-pulse"
            >
              <div className="bg-[var(--border)] h-48" />
              <div className="p-4 space-y-2">
                <div className="bg-[var(--border)] h-3 rounded w-3/4" />
                <div className="bg-[var(--border)] h-3 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-16 border border-red-900/30 rounded-lg bg-red-950/10">
          <p className="font-display text-4xl text-red-800 mb-3">¯\_(ツ)_/¯</p>
          <p className="text-red-400 font-display tracking-wider text-sm">
            {error}
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && characters.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {characters.map((c, i) => (
            <div
              key={c.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <CharacterCard character={c} />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !searched && (
        <div className="text-center py-20">
          <p className="font-display text-6xl text-[var(--border)] mb-4">⚛</p>
          <p className="font-display text-sm tracking-widest text-gray-600">
            INICIA UNA BÚSQUEDA PARA EXPLORAR EL MULTIVERSO
          </p>
        </div>
      )}
    </div>
  );
}
