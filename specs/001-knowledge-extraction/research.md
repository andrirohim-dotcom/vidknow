# Research: Knowledge Extraction & Reporting

**Date**: 2026-05-30
**Feature**: Knowledge Extraction & Reporting
**Purpose**: Best practices and technology decisions for fullstack Next.js + Supabase

## Decision 1: Next.js App Router vs Pages Router

**Decision**: App Router (Next.js 14+)

**Rationale**:
- Server Components reduce client-side JavaScript by 30-40%
- Built-in loading states and error boundaries
- Improved SEO with server-side rendering
- Better streaming and suspense support
- Native React Server Components for data fetching

**Alternatives Considered**:
- Pages Router: Mature but lacks Server Components benefits
- Remix: Good DX but smaller ecosystem
- SvelteKit: Newer, less enterprise adoption

## Decision 2: Supabase Local CLI for Development

**Decision**: Supabase Local CLI with Docker

**Rationale**:
- Full PostgreSQL 15+ with all extensions
- Auth, Realtime, Storage, and Edge Functions locally
- Seed data support for consistent development
- Migrations system for version control
- Production parity (same config for dev/prod)

**Alternatives Considered**:
- SQLite: Not production-ready for this scale
- Firebase: Vendor lock-in, less SQL flexibility
- PlanetScale: Good but MySQL, not PostgreSQL

## Decision 3: Video Transcript Extraction Strategy

**Decision**: Multi-source extraction pipeline

**Rationale**:
- YouTube: youtube-transcript npm package (free, reliable)
- X.com/TikTok: Cheerio scraping + fallback to AI transcription
- Fallback: OpenAI Whisper API for audio transcription
- Rate limiting and caching for API efficiency

**Alternatives Considered**:
- Single API approach: Less reliable across platforms
- Self-hosted Whisper: Higher cost, more complexity
- Third-party services: Additional cost, dependency

## Decision 4: PDF/HTML Export Strategy

**Decision**: Hybrid approach

**Rationale**:
- HTML export: React-PDF/renderer (pure JavaScript, no dependencies)
- PDF export: Puppeteer for complex layouts (headless Chrome)
- Fallback: @react-pdf/renderer for server-side generation
- Template system for consistent branding

**Alternatives Considered**:
- jsPDF: Limited styling capabilities
- html2pdf.js: Quality issues with complex layouts
- External services: Additional cost and latency

## Decision 5: AI Integration Strategy

**Decision**: OpenAI API primary, Claude API fallback

**Rationale**:
- OpenAI GPT-4 for knowledge extraction and analysis
- Claude for fallback and complex reasoning tasks
- Structured output (JSON) for consistent report generation
- Token optimization with prompt engineering

**Alternatives Considered**:
- Local LLMs: Higher infrastructure cost
- Single provider: Risk of downtime
- Custom models: Too expensive for MVP

## Decision 6: State Management Strategy

**Decision**: Zustand + React Query

**Rationale**:
- Zustand: Lightweight, simple, no boilerplate
- React Query: Server state management, caching, optimistic updates
- No Redux complexity for this scale
- TypeScript-first with excellent devtools

**Alternatives Considered**:
- Redux Toolkit: Overkill for this app size
- Jotai: Atomic model less intuitive for this use case
- MobX: Less popular, smaller ecosystem

## Decision 7: UI Component Library

**Decision**: shadcn/ui + Tailwind CSS

**Rationale**:
- shadcn/ui: Copy-paste components, full control
- Tailwind: Utility-first, consistent design system
- No runtime overhead (unlike Material UI, Chakra)
- Excellent accessibility (WCAG 2.1 AA compliant)
- Customizable with CSS variables

**Alternatives Considered**:
- Material UI: Heavier bundle, less customizable
- Chakra UI: Good but more opinionated
- Ant Design: Enterprise-focused, not mobile-first

## Decision 8: Testing Strategy

**Decision**: Vitest + Playwright + MSW

**Rationale**:
- Vitest: Fast, Vite-native, Jest-compatible
- Playwright: Cross-browser e2e testing
- MSW: API mocking without network calls
- 80% coverage target for business logic

**Alternatives Considered**:
- Jest: Slower, less Vite integration
- Cypress: Single-browser, paid features
- Testing Library: Good for components, not e2e

## Decision 9: Authentication Strategy

**Decision**: Supabase Auth + Next.js middleware

**Rationale**:
- Supabase Auth: Built-in OAuth, magic links, MFA
- Row Level Security (RLS) for data isolation
- Next.js middleware for route protection
- Session management with HTTP-only cookies

**Alternatives Considered**:
- NextAuth.js: More setup, less Supabase integration
- Auth0: Additional cost, vendor lock-in
- Firebase Auth: Less SQL flexibility

## Decision 10: Deployment Strategy

**Decision**: Vercel + Supabase Cloud

**Rationale**:
- Vercel: Zero-config Next.js deployment
- Supabase Cloud: Managed PostgreSQL + all features
- Preview deployments for PRs
- Edge functions for low-latency APIs

**Alternatives Considered**:
- AWS: More control, higher complexity
- Netlify: Good but less Next.js optimization
- Self-hosted: Higher maintenance burden

## Decision 11: Offline Support Strategy

**Decision**: Service Workers + IndexedDB

**Rationale**:
- Next.js PWA support with next-pwa
- IndexedDB for local storage of saved knowledge
- Background sync for offline extractions
- Cache-first strategy for static assets

**Alternatives Considered**:
- LocalStorage: Limited storage capacity
- Cache API: Less structured data storage
- Native apps: Higher development cost

## Decision 12: Video Platform Integration

**Decision**: Platform-specific adapters

**Rationale**:
- YouTube: Official Data API v3 + youtube-transcript
- X/TikTok: Unofficial APIs + web scraping
- Common interface for unified extraction
- Rate limiting and error handling per platform

**Alternatives Considered**:
- Unified API: Not available for all platforms
- Third-party services: Additional cost
- Browser extensions: Less scalable

## Summary

| Decision | Choice | Confidence |
|----------|--------|------------|
| Framework | Next.js 14+ App Router | High |
| Database | Supabase Local CLI | High |
| Video Extraction | Multi-source pipeline | High |
| PDF/HTML Export | Hybrid React-PDF + Puppeteer | High |
| AI Integration | OpenAI + Claude fallback | High |
| State Management | Zustand + React Query | High |
| UI Components | shadcn/ui + Tailwind | High |
| Testing | Vitest + Playwright + MSW | High |
| Authentication | Supabase Auth | High |
| Deployment | Vercel + Supabase Cloud | High |
| Offline Support | Service Workers + IndexedDB | Medium |
| Video Integration | Platform-specific adapters | Medium |

**Overall Confidence**: High (10/12 decisions with high confidence)
