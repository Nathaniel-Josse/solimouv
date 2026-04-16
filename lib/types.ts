export type UserRole = 'user' | 'admin'

export interface AppUser {
  id: string
  email: string
  display_name: string
  role: UserRole
  is_in_newsletter: boolean
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  year: number
  date: string
  location: string
  is_active: boolean
  created_at: string
}

export interface Registration {
  id: string
  user_id: string
  event_id: string
  guests_count: number
  created_at: string
}

export interface Exhibitor {
  id: string
  event_id: string
  name: string
  description: string
  category: string
  picture_url: string
  association_name: string
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  exhibitor_id: string
  created_at: string
}

export interface StampCard {
  id: string
  user_id: string
  event_id: string
  created_at: string
}

export interface StampEntry {
  id: string
  card_id: string
  exhibitor_id: string
  stamped_at: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: AppUser
        Insert: Omit<AppUser, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AppUser, 'id' | 'created_at'>>
      }
      events: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at'>
        Update: Partial<Omit<Event, 'id' | 'created_at'>>
      }
      registrations: {
        Row: Registration
        Insert: Omit<Registration, 'id' | 'created_at'>
        Update: Partial<Omit<Registration, 'id' | 'created_at'>>
      }
      exhibitors: {
        Row: Exhibitor
        Insert: Omit<Exhibitor, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Exhibitor, 'id' | 'created_at'>>
      }
      favorites: {
        Row: Favorite
        Insert: Omit<Favorite, 'id' | 'created_at'>
        Update: never
      }
      stamp_cards: {
        Row: StampCard
        Insert: Omit<StampCard, 'id' | 'created_at'>
        Update: never
      }
      stamp_entries: {
        Row: StampEntry
        Insert: Omit<StampEntry, 'id'>
        Update: never
      }
    }
  }
}
