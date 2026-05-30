export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export type PlatformType = 'youtube' | 'xcom' | 'tiktok';
export type AvailabilityStatus = 'available' | 'private' | 'unavailable' | 'processing';
export type ExtractionStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ExportFormat = 'html' | 'pdf';
export type ExportStatus = 'pending' | 'generating' | 'completed' | 'failed';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: SubscriptionTier;
  storage_used_mb: number;
  storage_limit_mb: number;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  color: string;
  is_default: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface VideoSource {
  id: string;
  platform: PlatformType;
  url: string;
  video_id: string;
  title?: string;
  description?: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  channel_name?: string;
  channel_url?: string;
  published_at?: string;
  availability_status: AvailabilityStatus;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeExtraction {
  id: string;
  user_id: string;
  profile_id: string;
  video_source_id: string;
  status: ExtractionStatus;
  progress_percent: number;
  transcript?: string;
  transcript_language?: string;
  extracted_at?: string;
  processing_duration_ms?: number;
  error_message?: string;
  retry_count: number;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeReport {
  id: string;
  extraction_id: string;
  user_id: string;
  summary: string;
  key_concepts: KeyConcept[];
  implementation_steps: ImplementationStep[];
  tools_list: Tool[];
  difficulty_level: DifficultyLevel;
  estimated_time_hours?: number;
  prerequisites: string[];
  learning_objectives: string[];
  relevance_score?: number;
  feasibility_score?: number;
  value_score?: number;
  warnings: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface KeyConcept {
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

export interface ImplementationStep {
  step: number;
  title: string;
  description: string;
  expected_outcome: string;
}

export interface Tool {
  name: string;
  url?: string;
  description: string;
  required: boolean;
}

export interface KnowledgeCategory {
  id: string;
  user_id: string;
  name: string;
  color: string;
  parent_id?: string;
  sort_order: number;
  created_at: string;
}

export interface KnowledgeItemCategory {
  extraction_id: string;
  category_id: string;
  created_at: string;
}

export interface Export {
  id: string;
  user_id: string;
  extraction_id: string;
  format: ExportFormat;
  status: ExportStatus;
  file_url?: string;
  file_size_bytes?: number;
  generation_duration_ms?: number;
  created_at: string;
  expires_at?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
    request_id: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}