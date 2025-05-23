export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      article_images: {
        Row: {
          article_id: string
          caption: string | null
          created_at: string
          id: string
          is_primary: boolean | null
          source: string | null
          updated_at: string
          url: string
        }
        Insert: {
          article_id: string
          caption?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean | null
          source?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          article_id?: string
          caption?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean | null
          source?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_images_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_types: {
        Row: {
          created_at: string
          id: string
          label: string
          name: string
          structure: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          name: string
          structure?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          name?: string
          structure?: Json
          updated_at?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          article_type_id: string
          content: string
          created_at: string
          id: string
          platform: string | null
          published_at: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          workflow_data: Json
          workflow_step: string
        }
        Insert: {
          article_type_id: string
          content: string
          created_at?: string
          id?: string
          platform?: string | null
          published_at?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          workflow_data?: Json
          workflow_step?: string
        }
        Update: {
          article_type_id?: string
          content?: string
          created_at?: string
          id?: string
          platform?: string | null
          published_at?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          workflow_data?: Json
          workflow_step?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_article_type_id_fkey"
            columns: ["article_type_id"]
            isOneToOne: false
            referencedRelation: "article_types"
            referencedColumns: ["id"]
          },
        ]
      }
      assistant_settings: {
        Row: {
          created_at: string
          id: string
          language: string | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_history: {
        Row: {
          chat_session_id: string
          content: string
          created_at: string
          id: string
          is_ai: boolean
          type: string | null
          user_id: string
        }
        Insert: {
          chat_session_id: string
          content: string
          created_at?: string
          id?: string
          is_ai?: boolean
          type?: string | null
          user_id: string
        }
        Update: {
          chat_session_id?: string
          content?: string
          created_at?: string
          id?: string
          is_ai?: boolean
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      news_sources: {
        Row: {
          auth_config: Json | null
          category: string
          created_at: string
          frequency: string
          id: string
          last_checked_at: string | null
          name: string
          status: string
          url: string
          user_id: string | null
        }
        Insert: {
          auth_config?: Json | null
          category: string
          created_at?: string
          frequency: string
          id?: string
          last_checked_at?: string | null
          name: string
          status?: string
          url: string
          user_id?: string | null
        }
        Update: {
          auth_config?: Json | null
          category?: string
          created_at?: string
          frequency?: string
          id?: string
          last_checked_at?: string | null
          name?: string
          status?: string
          url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birth_date: string | null
          country: string | null
          first_name: string | null
          id: string
          language_preference: string | null
          last_name: string | null
          specialties: string[] | null
          whatsapp_number: string | null
        }
        Insert: {
          birth_date?: string | null
          country?: string | null
          first_name?: string | null
          id: string
          language_preference?: string | null
          last_name?: string | null
          specialties?: string[] | null
          whatsapp_number?: string | null
        }
        Update: {
          birth_date?: string | null
          country?: string | null
          first_name?: string | null
          id?: string
          language_preference?: string | null
          last_name?: string | null
          specialties?: string[] | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      raw_news: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          id: string
          link: string | null
          published_at: string | null
          source_id: string | null
          source_name: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          link?: string | null
          published_at?: string | null
          source_id?: string | null
          source_name?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          link?: string | null
          published_at?: string | null
          source_id?: string | null
          source_name?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "raw_news_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "news_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      suggested_titles: {
        Row: {
          article_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          titles: string[]
          updated_at: string
        }
        Insert: {
          article_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          titles?: string[]
          updated_at?: string
        }
        Update: {
          article_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          titles?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      transcriptions: {
        Row: {
          completed_at: string | null
          content: string | null
          created_at: string
          file_path: string | null
          id: string
          name: string
          source_type: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          content?: string | null
          created_at?: string
          file_path?: string | null
          id?: string
          name: string
          source_type?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          content?: string | null
          created_at?: string
          file_path?: string | null
          id?: string
          name?: string
          source_type?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_owns_resource: {
        Args: { resource_user_id: string }
        Returns: boolean
      }
      is_org_member: {
        Args: { org_id: string }
        Returns: boolean
      }
      simulate_article: {
        Args: { for_user_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
