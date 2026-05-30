# VidKnow

A fullstack web application that extracts knowledge from YouTube, X.com, and TikTok videos, generating insightful reports for individual learners.

## Features

- **Knowledge Extraction**: Paste video URLs and get comprehensive knowledge reports
- **Multi-Platform Support**: YouTube, X.com (Twitter), and TikTok
- **Insightful Reports**: Step-by-step implementation guides, tools lists, difficulty ratings
- **Knowledge Management**: Save, organize, and revisit extracted knowledge
- **Multi-Profile Support**: Organize knowledge by different life areas
- **Export**: Generate PDF and HTML reports for sharing
- **AI-Powered**: Uses DeepSeek or OpenAI for intelligent extraction

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18+, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **AI**: DeepSeek API (default) / OpenAI API
- **State**: Zustand, React Query
- **Testing**: Vitest, Playwright, MSW

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for Supabase)
- npm (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/andrirohim-dotcom/vidknow.git
cd vidknow

# Install dependencies
npm install

# Start Supabase
npx supabase start

# Run development server
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# AI Provider (deepseek or openai)
AI_PROVIDER=deepseek

# DeepSeek API (https://platform.deepseek.com/)
DEEPSEEK_API_KEY=your-deepseek-api-key
```

**AI Provider Options**:
- **DeepSeek** (recommended): Use `deepseek-chat` model. Register at https://platform.deepseek.com/
- **OpenAI**: Set `AI_PROVIDER=openai` and configure `OPENAI_API_KEY`

## Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm test             # Run unit tests
npm run test:e2e     # Run e2e tests
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

## Documentation

- [Implementation Plan](./specs/001-knowledge-extraction/plan.md)
- [Feature Specification](./specs/001-knowledge-extraction/spec.md)
- [Data Model](./specs/001-knowledge-extraction/data-model.md)
- [API Contracts](./specs/001-knowledge-extraction/contracts/api-contracts.md)
- [Quickstart Guide](./specs/001-knowledge-extraction/quickstart.md)

## License

MIT
