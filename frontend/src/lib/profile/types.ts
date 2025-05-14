// src/lib/profile/types.ts

import { Media } from '@/lib/media/types'

export interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  created_at: string
  updated_at: string
  is_active: boolean
  is_staff: boolean
}

export interface UserPreferences {
  public_profile: boolean
  show_sensitive: boolean
  blur_sensitive: boolean
}

export interface PaginatedFavourites {
  count: number
  next: string | null
  previous: string | null
  results: { media: Media & { favourites_count: number }; added_at: string }[]
}
