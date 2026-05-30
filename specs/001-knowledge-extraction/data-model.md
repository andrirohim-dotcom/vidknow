# Data Model: Knowledge Extraction & Reporting

**Date**: 2026-05-30
**Feature**: Knowledge Extraction & Reporting

## Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│    User     │────<│   Profile   │────<│Knowledge Extract│
│             │     │             │     │                 │
└─────────────┘     └─────────────┘     └─────────────────┘
       │                   │                     │
       │                   │                     │
       └───────────────────┴─────────────────────┘
                           │
                    ┌──────┴──────┐
                    │Video Source │
                    └─────────────┘
```

## Tables

### 1. users

Represents registered user accounts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid_generate_v4() | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| full_name | VARCHAR(255) | | User display name |
| avatar_url | TEXT | | Profile picture URL |
| subscription_tier | ENUM('free', 'pro', 'enterprise') | default 'free' | Subscription level |
| storage_used_mb | INTEGER | default 0 | Current storage usage |
| storage_limit_mb | INTEGER | default 5120 | Storage limit (5GB default) |
| preferences | JSONB | default '{}' | User preferences |
| created_at | TIMESTAMPTZ | default NOW() | Account creation date |
| updated_at | TIMESTAMPTZ | default NOW() | Last update timestamp |

**Indexes**:
- `idx_users_email` on (email)

**RLS Policies**:
- Users can only read/update their own profile
- Users cannot delete their account (admin action)

### 2. profiles

User-created learning categories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid_generate_v4() | Unique identifier |
| user_id | UUID | FK -> users(id), NOT NULL | Owner reference |
| name | VARCHAR(100) | NOT NULL | Profile name (e.g., "Work Learning") |
| description | TEXT | | Profile description |
| avatar_url | TEXT | | Profile icon/avatar |
| color | VARCHAR(7) | default '#6366f1' | Accent color (hex) |
| is_default | BOOLEAN | default false | Default profile flag |
| sort_order | INTEGER | default 0 | Display order |
| created_at | TIMESTAMPTZ | default NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | default NOW() | Last update timestamp |

**Indexes**:
- `idx_profiles_user_id` on (user_id)
- `idx_profiles_user_default` on (user_id, is_default) WHERE is_default = true

**RLS Policies**:
- Users can only CRUD their own profiles
- Default profile cannot be deleted

### 3. video_sources

External video platform references.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid_generate_v4() | Unique identifier |
| platform | ENUM('youtube', 'xcom', 'tiktok') | NOT NULL | Video platform |
| url | TEXT | NOT NULL | Original video URL |
| video_id | VARCHAR(255) | NOT NULL | Platform-specific video ID |
| title | TEXT | | Video title |
| description | TEXT | | Video description |
| thumbnail_url | TEXT | | Video thumbnail |
| duration_seconds | INTEGER | | Video duration |
| channel_name | VARCHAR(255) | | Creator/channel name |
| channel_url | TEXT | | Creator channel URL |
| published_at | TIMESTAMPTZ | | Publication date |
| availability_status | ENUM('available', 'private', 'unavailable', 'processing') | default 'processing' | Current status |
| metadata | JSONB | default '{}' | Additional metadata |
| created_at | TIMESTAMPTZ | default NOW() | Record creation |
| updated_at | TIMESTAMPTZ | default NOW() | Last update |

**Indexes**:
- `idx_video_sources_platform_video` on (platform, video_id) UNIQUE
- `idx_video_sources_availability` on (availability_status)

**RLS Policies**:
- Video sources are public read (shared across users)
- Only system can insert/update video sources

### 4. knowledge_extractions

Processed video results with extracted knowledge.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid_generate_v4() | Unique identifier |
| user_id | UUID | FK -> users(id), NOT NULL | Owner reference |
| profile_id | UUID | FK -> profiles(id), NOT NULL | Target profile |
| video_source_id | UUID | FK -> video_sources(id), NOT NULL | Source video |
| status | ENUM('pending', 'processing', 'completed', 'failed') | default 'pending' | Processing status |
| progress_percent | INTEGER | default 0 | Processing progress (0-100) |
| transcript | TEXT | | Raw transcript text |
| transcript_language | VARCHAR(10) | | Transcript language code |
| extracted_at | TIMESTAMPTZ | | Extraction completion time |
| processing_duration_ms | INTEGER | | Processing time in milliseconds |
| error_message | TEXT | | Error details if failed |
| retry_count | INTEGER | default 0 | Number of retry attempts |
| created_at | TIMESTAMPTZ | default NOW() | Record creation |
| updated_at | TIMESTAMPTZ | default NOW() | Last update |

**Indexes**:
- `idx_knowledge_extractions_user` on (user_id)
- `idx_knowledge_extractions_profile` on (profile_id)
- `idx_knowledge_extractions_video` on (video_source_id)
- `idx_knowledge_extractions_status` on (status)

**RLS Policies**:
- Users can only read/update their own extractions
- Users cannot delete extractions (soft delete only)

### 5. knowledge_reports

Structured output from knowledge extraction.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid_generate_v4() | Unique identifier |
| extraction_id | UUID | FK -> knowledge_extractions(id), UNIQUE, NOT NULL | Parent extraction |
| user_id | UUID | FK -> users(id), NOT NULL | Owner reference |
| summary | TEXT | NOT NULL | Executive summary |
| key_concepts | JSONB | NOT NULL | Array of key concepts |
| implementation_steps | JSONB | NOT NULL | Step-by-step guide |
| tools_list | JSONB | NOT NULL | Required tools with links |
| difficulty_level | ENUM('beginner', 'intermediate', 'advanced') | NOT NULL | Difficulty rating |
| estimated_time_hours | DECIMAL(5,2) | | Time to implement |
| prerequisites | JSONB | default '[]' | Required knowledge |
| learning_objectives | JSONB | default '[]' | What user will learn |
| relevance_score | INTEGER | CHECK (1-10) | Relevance to user profile |
| feasibility_score | INTEGER | CHECK (1-10) | Implementation feasibility |
| value_score | INTEGER | CHECK (1-10) | Business/personal value |
| warnings | JSONB | default '[]' | Content warnings |
| metadata | JSONB | default '{}' | Additional metadata |
| created_at | TIMESTAMPTZ | default NOW() | Report creation |
| updated_at | TIMESTAMPTZ | default NOW() | Last update |

**Indexes**:
- `idx_knowledge_reports_extraction` on (extraction_id) UNIQUE
- `idx_knowledge_reports_user` on (user_id)
- `idx_knowledge_reports_difficulty` on (difficulty_level)

**RLS Policies**:
- Users can only read/update their own reports

### 6. knowledge_categories

Tags for organizing knowledge items.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid_generate_v4() | Unique identifier |
| user_id | UUID | FK -> users(id), NOT NULL | Owner reference |
| name | VARCHAR(100) | NOT NULL | Category name |
| color | VARCHAR(7) | default '#10b981' | Category color (hex) |
| parent_id | UUID | FK -> knowledge_categories(id) | Parent category (hierarchy) |
| sort_order | INTEGER | default 0 | Display order |
| created_at | TIMESTAMPTZ | default NOW() | Creation timestamp |

**Indexes**:
- `idx_knowledge_categories_user` on (user_id)
- `idx_knowledge_categories_parent` on (parent_id)

**RLS Policies**:
- Users can only CRUD their own categories

### 7. knowledge_item_categories

Many-to-many relationship between extractions and categories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| extraction_id | UUID | FK -> knowledge_extractions(id), NOT NULL | Knowledge item |
| category_id | UUID | FK -> knowledge_categories(id), NOT NULL | Category |
| created_at | TIMESTAMPTZ | default NOW() | Assignment timestamp |

**Primary Key**: (extraction_id, category_id)

**Indexes**:
- `idx_knowledge_item_categories_extraction` on (extraction_id)
- `idx_knowledge_item_categories_category` on (category_id)

### 8. exports

Generated export files (PDF/HTML).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid_generate_v4() | Unique identifier |
| user_id | UUID | FK -> users(id), NOT NULL | Owner reference |
| extraction_id | UUID | FK -> knowledge_extractions(id), NOT NULL | Source extraction |
| format | ENUM('html', 'pdf') | NOT NULL | Export format |
| status | ENUM('pending', 'generating', 'completed', 'failed') | default 'pending' | Generation status |
| file_url | TEXT | | Download URL (Supabase Storage) |
| file_size_bytes | INTEGER | | File size |
| generation_duration_ms | INTEGER | | Generation time |
| created_at | TIMESTAMPTZ | default NOW() | Export request time |
| expires_at | TIMESTAMPTZ | | Link expiration (7 days) |

**Indexes**:
- `idx_exports_user` on (user_id)
- `idx_exports_extraction` on (extraction_id)

**RLS Policies**:
- Users can only read/delete their own exports

## Validation Rules

### users
- Email must be valid format
- storage_used_mb <= storage_limit_mb
- subscription_tier must be valid enum value

### profiles
- name required, 1-100 characters
- color must be valid hex color
- Only one default profile per user

### knowledge_extractions
- profile_id must belong to same user
- video_source_id must exist
- status transitions: pending -> processing -> completed/failed

### knowledge_reports
- summary required, min 50 characters
- key_concepts must be non-empty array
- All scores must be 1-10
- difficulty_level must be valid enum

## State Transitions

### Knowledge Extraction Status

```
pending → processing → completed
                    ↘ failed → (retry) → processing
```

### Export Status

```
pending → generating → completed
                  ↘ failed
```

## Migration Strategy

1. Create tables with proper constraints
2. Enable Row Level Security on all tables
3. Create indexes for performance
4. Add foreign key constraints
5. Create RLS policies for data isolation
