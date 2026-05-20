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

// ISR - para generateStaticParams necesitamos algunos IDs
export async function getAllCharacterIds(): Promise<number[]> {
  const ids: number[] = [];

  // Solo primeras 2 páginas
  for (let page = 1; page <= 2; page++) {
    const res = await fetch(`${BASE_URL}/character?page=${page}`, {
      cache: "force-cache",
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data: ApiResponse = await res.json();

    data.results.forEach((c) => ids.push(c.id));
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
