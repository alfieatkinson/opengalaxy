// src/lib/profile/types.ts

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
