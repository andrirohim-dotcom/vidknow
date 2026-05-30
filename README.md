# VidKnow

A fullstack web application that extracts knowledge from YouTube, X.com, and TikTok videos, generating insightful reports for individual learners.

## Features

- **Knowledge Extraction**: Paste video URLs and get comprehensive knowledge reports
- **Multi-Platform Support**: YouTube, X.com (Twitter), and TikTok
- **Insightful Reports**: Step-by-step implementation guides, tools lists, difficulty ratings
- **Knowledge Management**: Save, organize, and revisit extracted knowledge
- **Multi-Profile Support**: Organize knowledge by different life areas
- **Export**: Generate PDF and HTML reports for sharing

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18+, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **AI**: OpenAI API / Anthropic Claude API
- **State**: Zustand, React Query
- **Testing**: Vitest, Playwright, MSW

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for Supabase)
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/vidknow.git
cd vidknow

# Install dependencies
pnpm install

# Start Supabase
npx supabase start

# Run development server
pnpm dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
OPENAI_API_KEY=sk-your-openai-key
```

## Development

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm test         # Run unit tests
pnpm test:e2e     # Run e2e tests
pnpm lint         # Run ESLint
pnpm format       # Format with Prettier
```

## Documentation

- [Implementation Plan](./specs/001-knowledge-extraction/plan.md)
- [Feature Specification](./specs/001-knowledge-extraction/spec.md)
- [Data Model](./specs/001-knowledge-extraction/data-model.md)
- [API Contracts](./specs/001-knowledge-extraction/contracts/api-contracts.md)
- [Quickstart Guide](./specs/001-knowledge-extraction/quickstart.md)

## License

MIT
