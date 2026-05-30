# API Contracts: Knowledge Extraction & Reporting

**Date**: 2026-05-30
**Base URL**: `/api/v1`

## Authentication

All endpoints require authentication via Supabase Auth token.

**Headers**:
```
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

## Endpoints

### 1. Knowledge Extraction

#### POST /api/v1/extract

Initiate knowledge extraction from video URL.

**Request**:
```typescript
{
  url: string;          // Video URL (YouTube, X.com, TikTok)
  profile_id: string;   // Target profile UUID
  categories?: string[]; // Optional category IDs
}
```

**Response** (201 Created):
```typescript
{
  id: string;           // Extraction UUID
  status: 'pending';
  video_source: {
    id: string;
    platform: 'youtube' | 'xcom' | 'tiktok';
    title: string;
    thumbnail_url: string;
    duration_seconds: number;
  };
  created_at: string;   // ISO timestamp
}
```

**Error Responses**:
- `400`: Invalid URL format
- `404`: Video not found or unavailable
- `409`: Extraction already in progress for this URL
- `429`: Rate limit exceeded (100 requests/hour)

---

#### GET /api/v1/extract/:id

Get extraction status and progress.

**Response** (200 OK):
```typescript
{
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress_percent: number;  // 0-100
  video_source: {
    id: string;
    platform: string;
    title: string;
    thumbnail_url: string;
  };
  report_id?: string;        // Present when completed
  error_message?: string;    // Present when failed
  created_at: string;
  updated_at: string;
}
```

---

#### GET /api/v1/extract/list

List user's extractions with pagination.

**Query Parameters**:
- `profile_id` (optional): Filter by profile
- `status` (optional): Filter by status
- `page` (default: 1): Page number
- `limit` (default: 20, max: 100): Items per page
- `sort` (default: '-created_at'): Sort field with direction

**Response** (200 OK):
```typescript
{
  data: Array<{
    id: string;
    status: string;
    progress_percent: number;
    video_source: {
      title: string;
      platform: string;
      thumbnail_url: string;
    };
    created_at: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

---

### 2. Knowledge Reports

#### GET /api/v1/reports/:id

Get full knowledge report.

**Response** (200 OK):
```typescript
{
  id: string;
  extraction_id: string;
  summary: string;
  key_concepts: Array<{
    title: string;
    description: string;
    importance: 'high' | 'medium' | 'low';
  }>;
  implementation_steps: Array<{
    step: number;
    title: string;
    description: string;
    expected_outcome: string;
  }>;
  tools_list: Array<{
    name: string;
    url?: string;
    description: string;
    required: boolean;
  }>;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_time_hours: number;
  prerequisites: string[];
  learning_objectives: string[];
  relevance_score: number;    // 1-10
  feasibility_score: number;  // 1-10
  value_score: number;        // 1-10
  warnings: string[];
  created_at: string;
}
```

---

#### PATCH /api/v1/reports/:id

Update report scores and metadata.

**Request**:
```typescript
{
  relevance_score?: number;
  feasibility_score?: number;
  value_score?: number;
  categories?: string[];    // Category IDs to assign
}
```

**Response** (200 OK):
```typescript
{
  id: string;
  updated_fields: string[];
  updated_at: string;
}
```

---

### 3. Knowledge Library

#### GET /api/v1/knowledge

List saved knowledge items with filtering.

**Query Parameters**:
- `profile_id` (optional): Filter by profile
- `category_id` (optional): Filter by category
- `difficulty` (optional): Filter by difficulty level
- `search` (optional): Full-text search query
- `page` (default: 1): Page number
- `limit` (default: 20, max: 100): Items per page
- `sort` (default: '-created_at'): Sort field

**Response** (200 OK):
```typescript
{
  data: Array<{
    id: string;
    extraction_id: string;
    summary: string;
    difficulty_level: string;
    relevance_score: number;
    video_source: {
      title: string;
      platform: string;
      thumbnail_url: string;
    };
    categories: Array<{
      id: string;
      name: string;
      color: string;
    }>;
    created_at: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

---

#### DELETE /api/v1/knowledge/:id

Soft delete a knowledge item.

**Response** (200 OK):
```typescript
{
  id: string;
  deleted: true;
  deleted_at: string;
}
```

---

### 4. Profiles

#### GET /api/v1/profiles

List user's profiles.

**Response** (200 OK):
```typescript
{
  data: Array<{
    id: string;
    name: string;
    description?: string;
    avatar_url?: string;
    color: string;
    is_default: boolean;
    knowledge_count: number;
    created_at: string;
  }>;
}
```

---

#### POST /api/v1/profiles

Create a new profile.

**Request**:
```typescript
{
  name: string;            // 1-100 characters
  description?: string;
  avatar_url?: string;
  color?: string;          // Hex color, default '#6366f1'
}
```

**Response** (201 Created):
```typescript
{
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  color: string;
  is_default: false;
  created_at: string;
}
```

**Error Responses**:
- `400`: Invalid input
- `409`: Profile name already exists

---

#### PATCH /api/v1/profiles/:id

Update profile details.

**Request**:
```typescript
{
  name?: string;
  description?: string;
  avatar_url?: string;
  color?: string;
  sort_order?: number;
}
```

**Response** (200 OK):
```typescript
{
  id: string;
  updated_fields: string[];
  updated_at: string;
}
```

---

#### DELETE /api/v1/profiles/:id

Delete profile and all associated knowledge.

**Response** (200 OK):
```typescript
{
  id: string;
  deleted: true;
  deleted_at: string;
  affected_extractions: number;
}
```

**Error Responses**:
- `400`: Cannot delete default profile
- `409`: Profile has associated extractions

---

### 5. Categories

#### GET /api/v1/categories

List user's categories.

**Response** (200 OK):
```typescript
{
  data: Array<{
    id: string;
    name: string;
    color: string;
    parent_id?: string;
    knowledge_count: number;
    children?: Array<{
      id: string;
      name: string;
      knowledge_count: number;
    }>;
  }>;
}
```

---

#### POST /api/v1/categories

Create a new category.

**Request**:
```typescript
{
  name: string;            // 1-100 characters
  color?: string;          // Hex color, default '#10b981'
  parent_id?: string;      // Parent category for hierarchy
}
```

**Response** (201 Created):
```typescript
{
  id: string;
  name: string;
  color: string;
  parent_id?: string;
  created_at: string;
}
```

---

### 6. Export

#### POST /api/v1/export

Generate export file (HTML or PDF).

**Request**:
```typescript
{
  extraction_id: string;
  format: 'html' | 'pdf';
  options?: {
    include_metadata?: boolean;  // Include AI prompts and config
    custom_branding?: {
      logo_url?: string;
      primary_color?: string;
    };
  };
}
```

**Response** (201 Created):
```typescript
{
  id: string;
  status: 'pending';
  format: string;
  estimated_duration_ms: number;
  created_at: string;
}
```

---

#### GET /api/v1/export/:id

Get export status and download URL.

**Response** (200 OK):
```typescript
{
  id: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  format: string;
  file_url?: string;        // Present when completed
  file_size_bytes?: number;
  expires_at?: string;      // Link expiration
  created_at: string;
}
```

---

### 7. User Profile

#### GET /api/v1/user/profile

Get current user profile.

**Response** (200 OK):
```typescript
{
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: string;
  storage_used_mb: number;
  storage_limit_mb: number;
  preferences: Record<string, any>;
  created_at: string;
}
```

---

#### PATCH /api/v1/user/profile

Update user profile.

**Request**:
```typescript
{
  full_name?: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
}
```

**Response** (200 OK):
```typescript
{
  id: string;
  updated_fields: string[];
  updated_at: string;
}
```

---

## WebSocket Events

### Realtime Subscriptions

**Channel**: `extraction:{user_id}`

```typescript
// Extraction status updates
{
  event: 'status_change';
  data: {
    extraction_id: string;
    status: 'processing' | 'completed' | 'failed';
    progress_percent: number;
    report_id?: string;
  };
}

// Progress updates
{
  event: 'progress';
  data: {
    extraction_id: string;
    progress_percent: number;
    message: string;
  };
}
```

**Channel**: `profile:{user_id}`

```typescript
// Knowledge count updates
{
  event: 'knowledge_count';
  data: {
    profile_id: string;
    count: number;
  };
}
```

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /api/v1/extract | 100 requests | 1 hour |
| GET /api/v1/reports/:id | 1000 requests | 1 hour |
| POST /api/v1/export | 50 requests | 1 hour |
| All other endpoints | 500 requests | 1 hour |

## Error Format

```typescript
{
  error: {
    code: string;           // Machine-readable error code
    message: string;        // Human-readable message
    details?: any;          // Additional error context
    request_id: string;     // Unique request ID for debugging
  };
}
```
