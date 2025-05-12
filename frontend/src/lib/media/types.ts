// src/lib/media/types.ts

export interface Media {
  openverse_id: string;
  title: string;
  indexed_on: string;
  foreign_landing_url: string;
  url: string;
  creator: string | null;
  creator_url: string | null;
  license: string;
  license_version: string | null;
  license_url: string;
  attribution: string;
  category: string | null;
  file_size: number | null;
  file_type: string | null;
  mature: boolean;
  thumbnail_url: string;
  height: number | null;
  width: number | null;
  duration: number | null;
  media_type: "image" | "audio";
  accessed_at?: string; // Only present in MediaDetailView
}
