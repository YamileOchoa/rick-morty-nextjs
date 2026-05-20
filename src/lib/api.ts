import { ApiResponse, Character, SearchParams } from "@/types/character";

const BASE_URL = "https://rickandmortyapi.com/api";

// SSG - caché forzado (force-cache es el default, pero lo hacemos explícito)
export async function getAllCharacters(page = 1): Promise<ApiResponse> {
  const res = await fetch(`${BASE_URL}/character?page=${page}`, {
    cache: "force-cache", // SSG: se cachea en build time
  });
  if (!res.ok) throw new Error("Error al obtener personajes");
  return res.json();
}

// ISR - revalidación cada 10 días
export async function getCharacterById(id: number): Promise<Character> {
  const res = await fetch(`${BASE_URL}/character/${id}`, {
    next: { revalidate: 864000 }, // ISR: 10 días en segundos
  });
  if (!res.ok) throw new Error(`Personaje ${id} no encontrado`);
  return res.json();
}

// ISR - para generateStaticParams necesitamos todos los IDs
export async function getAllCharacterIds(): Promise<number[]> {
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function fetchPage(page: number, retries = 3): Promise<ApiResponse> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const res = await fetch(`${BASE_URL}/character?page=${page}`, {
          cache: "force-cache",
        });
        const contentType = res.headers.get("content-type") || "";
        if (!res.ok || !contentType.includes("application/json")) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      } catch (err) {
        if (attempt < retries - 1) {
          await delay(500 * (attempt + 1)); // backoff: 500ms, 1000ms...
        } else {
          throw err;
        }
      }
    }
    throw new Error(`No se pudo obtener la página ${page}`);
  }

  // Página 1 para saber el total
  const first = await fetchPage(1);
  const totalPages = first.info.pages;
  const ids: number[] = first.results.map((c) => c.id);

  // Resto en lotes de 5 para no saturar la API
  const BATCH = 5;
  for (let start = 2; start <= totalPages; start += BATCH) {
    const batch = Array.from(
      { length: Math.min(BATCH, totalPages - start + 1) },
      (_, i) => fetchPage(start + i),
    );
    const pages = await Promise.all(batch);
    pages.forEach((p) => p.results.forEach((c) => ids.push(c.id)));
    await delay(200); // pequeña pausa entre lotes
  }

  return ids;
}

// CSR - búsqueda desde el cliente (se llama desde un componente 'use client')
export async function searchCharacters(
  params: SearchParams,
): Promise<ApiResponse> {
  const query = new URLSearchParams();
  if (params.name) query.set("name", params.name);
  if (params.status) query.set("status", params.status);
  if (params.type) query.set("type", params.type);
  if (params.gender) query.set("gender", params.gender);

  const res = await fetch(`${BASE_URL}/character?${query.toString()}`);
  if (!res.ok) {
    if (res.status === 404)
      return {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      };
    throw new Error("Error en la búsqueda");
  }
  return res.json();
}
