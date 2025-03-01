export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      flocks: {
        Row: {
          id: string
          name: string
          bird_type: 'Layer' | 'Broiler' | 'Dual Purpose'
          count: number
          age_weeks: number
          avg_weight: number
          health_status: 'Excellent' | 'Good' | 'Fair' | 'Poor'
          last_updated: string
          notes: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          bird_type: 'Layer' | 'Broiler' | 'Dual Purpose'
          count: number
          age_weeks: number
          avg_weight: number
          health_status: 'Excellent' | 'Good' | 'Fair' | 'Poor'
          last_updated: string
          notes: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          bird_type?: 'Layer' | 'Broiler' | 'Dual Purpose'
          count?: number
          age_weeks?: number
          avg_weight?: number
          health_status?: 'Excellent' | 'Good' | 'Fair' | 'Poor'
          last_updated?: string
          notes?: string
          user_id?: string
          created_at?: string
        }
      }
      feed_records: {
        Row: {
          id: string
          date: string
          flock_id: string
          feed_type: string
          quantity_kg: number
          cost_per_kg: number
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          flock_id: string
          feed_type: string
          quantity_kg: number
          cost_per_kg: number
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          flock_id?: string
          feed_type?: string
          quantity_kg?: number
          cost_per_kg?: number
          user_id?: string
          created_at?: string
        }
      }
      egg_production: {
        Row: {
          id: string
          date: string
          flock_id: string
          quantity: number
          damaged: number
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          flock_id: string
          quantity: number
          damaged: number
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          flock_id?: string
          quantity?: number
          damaged?: number
          user_id?: string
          created_at?: string
        }
      }
      health_alerts: {
        Row: {
          id: string
          date: string
          flock_id: string
          severity: 'Low' | 'Medium' | 'High'
          message: string
          is_read: boolean
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          flock_id: string
          severity: 'Low' | 'Medium' | 'High'
          message: string
          is_read: boolean
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          flock_id?: string
          severity?: 'Low' | 'Medium' | 'High'
          message?: string
          is_read?: boolean
          user_id?: string
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          subscription_tier: 'free' | 'premium' | 'enterprise'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_tier: 'free' | 'premium' | 'enterprise'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_tier?: 'free' | 'premium' | 'enterprise'
          created_at?: string
        }
      }
    }
  }
}
