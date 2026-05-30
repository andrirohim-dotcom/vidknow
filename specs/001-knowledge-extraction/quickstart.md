# Quickstart Guide: Knowledge Extraction & Reporting

**Date**: 2026-05-30
**Feature**: Knowledge Extraction & Reporting

## Prerequisites

- Node.js 20+ installed
- Docker Desktop running (for Supabase)
- Git installed
- pnpm package manager (recommended)

## 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/vidknow.git
cd vidknow

# Install dependencies
pnpm install
```

## 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
```

**Required Environment Variables**:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from-supabase-status>
SUPABASE_SERVICE_ROLE_KEY=<from-supabase-status>

# OpenAI (for AI extraction)
OPENAI_API_KEY=sk-your-openai-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Start Supabase Local

```bash
# Initialize Supabase (first time only)
npx supabase init

# Start Supabase services
npx supabase start
```

**Note**: First run takes 2-3 minutes to pull Docker images.

**Output**:
```
supabase local development setup is complete.

API URL: http://localhost:54321
Studio URL: http://localhost:54323
Anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Run Database Migrations

```bash
# Apply all migrations
npx supabase db reset

# Or apply specific migration
npx supabase migration up
```

## 5. Seed Test Data (Optional)

```bash
# Seed database with test data
npx supabase db seed
```

## 6. Start Development Server

```bash
# Start Next.js dev server
pnpm dev
```

**Access**:
- App: http://localhost:3000
- Supabase Studio: http://localhost:54323

## 7. Create Your First Profile

1. Open http://localhost:3000
2. Sign up or log in
3. Navigate to Profiles
4. Click "Create Profile"
5. Enter name (e.g., "Work Learning")
6. Select a color
7. Click "Save"

## 8. Extract Knowledge from a Video

1. Click "Extract" in the navigation
2. Paste a YouTube video URL
3. Select your profile
4. Click "Start Extraction"
5. Wait for processing (typically 30-60 seconds)
6. View your knowledge report

**Test URLs**:
- YouTube: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- X.com: `https://x.com/user/status/1234567890`
- TikTok: `https://www.tiktok.com/@user/video/1234567890`

## 9. View Knowledge Library

1. Click "Knowledge" in the navigation
2. Browse your saved extractions
3. Use search to find specific topics
4. Filter by category or difficulty
5. Click any item to view full report

## 10. Export a Report

1. Open a knowledge report
2. Click "Export" button
3. Select format (HTML or PDF)
4. Wait for generation
5. Download or share the file

## Development Commands

```bash
# Start development
pnpm dev

# Run tests
pnpm test              # Unit tests
pnpm test:e2e          # E2E tests
pnpm test:coverage     # With coverage

# Lint and format
pnpm lint              # ESLint
pnpm format            # Prettier
pnpm typecheck         # TypeScript

# Database
npx supabase start     # Start Supabase
npx supabase stop      # Stop Supabase
npx supabase db reset  # Reset database
npx supabase status    # Check status

# Build
pnpm build             # Production build
pnpm start             # Start production server
```

## Troubleshooting

### Supabase Won't Start

```bash
# Check Docker is running
docker info

# Reset Supabase
npx supabase stop
npx supabase start
```

### Database Connection Issues

```bash
# Check Supabase status
npx supabase status

# Verify environment variables
cat .env.local
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
pnpm dev

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

## Next Steps

1. Read [Data Model](./data-model.md) for database schema
2. Review [API Contracts](./contracts/api-contracts.md) for endpoint details
3. Check [Research](./research.md) for technology decisions
4. Run `/speckit.tasks` to generate implementation tasks
