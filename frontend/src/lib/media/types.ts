// src/lib/media/types.ts

export interface Tag {
  name: string
  accuracy: number
}

export interface Media {
  openverse_id: string
  title: string
  indexed_on: string
  foreign_landing_url: string
  url: string
  creator: string | null
  creator_url: string | null
  license: string
  license_version: string | null
  license_url: string
  attribution: string
  source: string
  category: string | null
  file_size: number | null
  file_type: string | null
  mature: boolean
  thumbnail_url: string
  height: number | null
  width: number | null
  duration: number | null
  media_type: 'image' | 'audio'
  accessed_at?: string // Only present in MediaDetailView
  favourites_count?: number
  tags?: Tag[]
  related_media?: MediaShort[]
}

export interface MediaShort {
  openverse_id: string
  title: string
  url: string
  thumbnail_url: string
  mature: boolean
  media_type: 'image' | 'audio'
  favourites_count?: number
}
