-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE platform_type AS ENUM ('youtube', 'xcom', 'tiktok');
CREATE TYPE availability_status AS ENUM ('available', 'private', 'unavailable', 'processing');
CREATE TYPE extraction_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE export_format AS ENUM ('html', 'pdf');
CREATE TYPE export_status AS ENUM ('pending', 'generating', 'completed', 'failed');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  subscription_tier subscription_tier DEFAULT 'free',
  storage_used_mb INTEGER DEFAULT 0,
  storage_limit_mb INTEGER DEFAULT 5120,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  avatar_url TEXT,
  color VARCHAR(7) DEFAULT '#6366f1',
  is_default BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video sources table
CREATE TABLE video_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform platform_type NOT NULL,
  url TEXT NOT NULL,
  video_id VARCHAR(255) NOT NULL,
  title TEXT,
  description TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  channel_name VARCHAR(255),
  channel_url TEXT,
  published_at TIMESTAMPTZ,
  availability_status availability_status DEFAULT 'processing',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform, video_id)
);

-- Knowledge extractions table
CREATE TABLE knowledge_extractions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_source_id UUID REFERENCES video_sources(id) ON DELETE CASCADE NOT NULL,
  status extraction_status DEFAULT 'pending',
  progress_percent INTEGER DEFAULT 0,
  transcript TEXT,
  transcript_language VARCHAR(10),
  extracted_at TIMESTAMPTZ,
  processing_duration_ms INTEGER,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge reports table
CREATE TABLE knowledge_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  extraction_id UUID REFERENCES knowledge_extractions(id) ON DELETE CASCADE UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  summary TEXT NOT NULL,
  key_concepts JSONB NOT NULL,
  implementation_steps JSONB NOT NULL,
  tools_list JSONB NOT NULL,
  difficulty_level difficulty_level NOT NULL,
  estimated_time_hours DECIMAL(5,2),
  prerequisites JSONB DEFAULT '[]',
  learning_objectives JSONB DEFAULT '[]',
  relevance_score INTEGER CHECK (relevance_score >= 1 AND relevance_score <= 10),
  feasibility_score INTEGER CHECK (feasibility_score >= 1 AND feasibility_score <= 10),
  value_score INTEGER CHECK (value_score >= 1 AND value_score <= 10),
  warnings JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge categories table
CREATE TABLE knowledge_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#10b981',
  parent_id UUID REFERENCES knowledge_categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge item categories (many-to-many)
CREATE TABLE knowledge_item_categories (
  extraction_id UUID REFERENCES knowledge_extractions(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES knowledge_categories(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (extraction_id, category_id)
);

-- Exports table
CREATE TABLE exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  extraction_id UUID REFERENCES knowledge_extractions(id) ON DELETE CASCADE NOT NULL,
  format export_format NOT NULL,
  status export_status DEFAULT 'pending',
  file_url TEXT,
  file_size_bytes INTEGER,
  generation_duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_user_default ON profiles(user_id, is_default) WHERE is_default = true;
CREATE INDEX idx_video_sources_availability ON video_sources(availability_status);
CREATE INDEX idx_knowledge_extractions_user ON knowledge_extractions(user_id);
CREATE INDEX idx_knowledge_extractions_profile ON knowledge_extractions(profile_id);
CREATE INDEX idx_knowledge_extractions_video ON knowledge_extractions(video_source_id);
CREATE INDEX idx_knowledge_extractions_status ON knowledge_extractions(status);
CREATE INDEX idx_knowledge_reports_user ON knowledge_reports(user_id);
CREATE INDEX idx_knowledge_reports_difficulty ON knowledge_reports(difficulty_level);
CREATE INDEX idx_knowledge_categories_user ON knowledge_categories(user_id);
CREATE INDEX idx_knowledge_categories_parent ON knowledge_categories(parent_id);
CREATE INDEX idx_knowledge_item_categories_extraction ON knowledge_item_categories(extraction_id);
CREATE INDEX idx_knowledge_item_categories_category ON knowledge_item_categories(category_id);
CREATE INDEX idx_exports_user ON exports(user_id);
CREATE INDEX idx_exports_extraction ON exports(extraction_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_extractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_item_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own profiles" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own profiles" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profiles" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own profiles" ON profiles FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Video sources are publicly readable" ON video_sources FOR SELECT USING (true);
CREATE POLICY "System can insert video sources" ON video_sources FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update video sources" ON video_sources FOR UPDATE USING (true);

CREATE POLICY "Users can view own extractions" ON knowledge_extractions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own extractions" ON knowledge_extractions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own extractions" ON knowledge_extractions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reports" ON knowledge_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own reports" ON knowledge_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reports" ON knowledge_reports FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own categories" ON knowledge_categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own categories" ON knowledge_categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON knowledge_categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON knowledge_categories FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own item categories" ON knowledge_item_categories FOR SELECT USING (
  EXISTS (SELECT 1 FROM knowledge_extractions WHERE id = extraction_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create own item categories" ON knowledge_item_categories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM knowledge_extractions WHERE id = extraction_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete own item categories" ON knowledge_item_categories FOR DELETE USING (
  EXISTS (SELECT 1 FROM knowledge_extractions WHERE id = extraction_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view own exports" ON exports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own exports" ON exports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own exports" ON exports FOR DELETE USING (auth.uid() = user_id);