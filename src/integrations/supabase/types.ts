export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      listings: {
        Row: {
          created_at: string | null
          description: string | null
          download_count: number | null
          file_size: number | null
          id: string
          image_url: string | null
          last_updated: string | null
          medications: Json | null
          pdf_url: string | null
          status: string | null
          supplier_id: string | null
          title: string
          updated_at: string | null
          version: number | null
          view_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          file_size?: number | null
          id?: string
          image_url?: string | null
          last_updated?: string | null
          medications?: Json | null
          pdf_url?: string | null
          status?: string | null
          supplier_id?: string | null
          title: string
          updated_at?: string | null
          version?: number | null
          view_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          file_size?: number | null
          id?: string
          image_url?: string | null
          last_updated?: string | null
          medications?: Json | null
          pdf_url?: string | null
          status?: string | null
          supplier_id?: string | null
          title?: string
          updated_at?: string | null
          version?: number | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          notification_type: string | null
          read: boolean | null
          related_id: string | null
          status: string | null
          target_role: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          notification_type?: string | null
          read?: boolean | null
          related_id?: string | null
          status?: string | null
          target_role?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          notification_type?: string | null
          read?: boolean | null
          related_id?: string | null
          status?: string | null
          target_role?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          id: string
          image_url: string | null
          medications: Json | null
          status: string | null
          supplier_id: string | null
          target_wilayas: string[] | null
          title: string
          updated_at: string | null
          valid_until: string | null
          view_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          medications?: Json | null
          status?: string | null
          supplier_id?: string | null
          target_wilayas?: string[] | null
          title: string
          updated_at?: string | null
          valid_until?: string | null
          view_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          medications?: Json | null
          status?: string | null
          supplier_id?: string | null
          target_wilayas?: string[] | null
          title?: string
          updated_at?: string | null
          valid_until?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          admin_notes: string | null
          amount: number
          bank_name: string | null
          created_at: string | null
          currency: string | null
          expires_at: string | null
          id: string
          payment_method: string
          plan_type: string
          processed_at: string | null
          processed_by: string | null
          receipt_number: string | null
          receipt_url: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          bank_name?: string | null
          created_at?: string | null
          currency?: string | null
          expires_at?: string | null
          id?: string
          payment_method: string
          plan_type: string
          processed_at?: string | null
          processed_by?: string | null
          receipt_number?: string | null
          receipt_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          bank_name?: string | null
          created_at?: string | null
          currency?: string | null
          expires_at?: string | null
          id?: string
          payment_method?: string
          plan_type?: string
          processed_at?: string | null
          processed_by?: string | null
          receipt_number?: string | null
          receipt_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bank_info: Json | null
          business_name: string
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          phone: string | null
          rating_average: number | null
          register_image_url: string | null
          register_number: string | null
          role: string
          sub_expiry: string | null
          subscription: string | null
          total_ratings: number | null
          updated_at: string | null
          wilaya: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bank_info?: Json | null
          business_name: string
          created_at?: string | null
          email?: string | null
          id: string
          is_active?: boolean | null
          notes?: string | null
          phone?: string | null
          rating_average?: number | null
          register_image_url?: string | null
          register_number?: string | null
          role: string
          sub_expiry?: string | null
          subscription?: string | null
          total_ratings?: number | null
          updated_at?: string | null
          wilaya?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bank_info?: Json | null
          business_name?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          phone?: string | null
          rating_average?: number | null
          register_image_url?: string | null
          register_number?: string | null
          role?: string
          sub_expiry?: string | null
          subscription?: string | null
          total_ratings?: number | null
          updated_at?: string | null
          wilaya?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          pharmacist_id: string | null
          rating: number
          supplier_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          pharmacist_id?: string | null
          rating: number
          supplier_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          pharmacist_id?: string | null
          rating?: number
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_pharmacist_id_fkey"
            columns: ["pharmacist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stats: {
        Row: {
          created_at: string | null
          id: string
          target_id: string | null
          type: string
          user_id: string | null
          visitor_id: string | null
          visitor_wilaya: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          target_id?: string | null
          type: string
          user_id?: string | null
          visitor_id?: string | null
          visitor_wilaya?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          target_id?: string | null
          type?: string
          user_id?: string | null
          visitor_id?: string | null
          visitor_wilaya?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stats_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
