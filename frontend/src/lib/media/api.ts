// src/lib/media/api.ts

import type { Media } from "@/lib/media/types";

export async function fetchMediaById(id: string): Promise<Media | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/media/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) {
    console.error(`Failed to fetch media with id ${id}:`, res.statusText);
    return null;
  }
  return res.json();
}

// List endpoint here
// export async function fetchMediaList(): Promise<Media[]> { … }
