# Implementation Plan: Knowledge Extraction & Reporting

**Branch**: `001-knowledge-extraction` | **Date**: 2026-05-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-knowledge-extraction/spec.md`

## Summary

A fullstack web application built with Next.js that extracts knowledge from YouTube, X.com, and TikTok videos, generating insightful reports for individual learners. Features multi-profile support, knowledge management, and export capabilities (HTML/PDF). Backend powered by Supabase local CLI for development.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20 LTS

**Primary Dependencies**:
- **Framework**: Next.js 14+ (App Router)
- **UI**: React 18+, Tailwind CSS, shadcn/ui
- **State**: Zustand (client), React Query (server state)
- **Forms**: React Hook Form + Zod validation
- **Video Processing**: youtube-transcript, cheerio (scraping)
- **PDF Generation**: Puppeteer / @react-pdf/renderer
- **AI/ML**: OpenAI API / Anthropic Claude API

**Storage**: Supabase Local CLI (PostgreSQL 15+, Auth, Realtime, Storage)

**Testing**: Vitest (unit), Playwright (e2e), MSW (API mocking)

**Target Platform**: Web (mobile-first responsive design), Progressive Web App

**Project Type**: Fullstack web application (Next.js monolith with Supabase backend)

**Performance Goals**:
- <2s initial page load (LCP)
- <100ms API response (p95)
- 95% video extraction success rate
- 10,000 concurrent users

**Constraints**:
- Mobile-first design (320px - 428px primary viewport)
- Offline access for saved knowledge
- GDPR compliance required
- Supabase local for development (production-ready for deployment)

**Scale/Scope**:
- 10,000 concurrent users
- 5GB storage per user
- 50+ screens/pages
- 3 video platforms (YouTube, X.com, TikTok)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Knowledge-First Design | ✅ PASS | Core feature is knowledge extraction |
| II. Learning Framework Integration | ✅ PASS | Reports follow pedagogical frameworks |
| III. Mobile-First Experience | ✅ PASS | Next.js with responsive design |
| IV. Actionable Knowledge | ✅ PASS | Reports include implementation guides |
| V. Structured Knowledge Architecture | ✅ PASS | Hierarchical taxonomy with categories |
| VI. Standard Application Architecture | ✅ PASS | Next.js App Router + Supabase |
| VII. High-Quality Coding Standards | ✅ PASS | TypeScript, ESLint, Prettier, 80% coverage |
| VIII. UX/UI Excellence | ✅ PASS | shadcn/ui + Tailwind, <5min onboarding |
| IX. Agentic Coding Integration | ✅ PASS | AI-assisted knowledge extraction |
| Security & Privacy | ✅ PASS | Supabase Auth + RLS + encryption |

**All gates PASSED** - Ready to proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-knowledge-extraction/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Dashboard routes
│   │   ├── layout.tsx      # Dashboard layout
│   │   ├── page.tsx        # Main dashboard
│   │   ├── knowledge/      # Knowledge library
│   │   ├── extract/        # Extraction page
│   │   └── profiles/       # Profile management
│   ├── api/                # API routes
│   │   ├── extract/        # Video extraction endpoints
│   │   ├── export/         # PDF/HTML export
│   │   └── webhooks/       # Webhook handlers
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── knowledge/          # Knowledge-related components
│   ├── extraction/         # Extraction flow components
│   ├── profiles/           # Profile components
│   └── reports/            # Report display components
├── lib/                    # Utilities and configurations
│   ├── supabase/           # Supabase client setup
│   ├── ai/                 # AI/ML integration
│   ├── video/              # Video platform integrations
│   ├── pdf/                # PDF generation
│   └── utils/              # Helper functions
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand stores
└── types/                  # TypeScript types

tests/
├── unit/                   # Vitest unit tests
├── integration/            # Integration tests
├── e2e/                    # Playwright e2e tests
└── fixtures/               # Test fixtures

supabase/
├── migrations/             # Database migrations
├── seed.sql                # Seed data
└── config.toml             # Supabase local config

public/
└── assets/                 # Static assets
```

**Structure Decision**: Next.js App Router monolith with Supabase backend. This structure follows the Next.js recommended patterns while maintaining clear separation of concerns. The `src/` directory contains all application code, with `app/` for routing, `components/` for UI, `lib/` for business logic, and `tests/` for test files.

## Complexity Tracking

> No constitution violations - all principles satisfied.

| Principle | How Satisfied |
|-----------|---------------|
| Mobile-First | Responsive design with Tailwind, PWA support |
| High-Quality Coding | TypeScript strict mode, 80% test coverage, ESLint + Prettier |
| UX/UI Excellence | shadcn/ui components, consistent design system |
| Security & Privacy | Supabase RLS, Auth, encrypted data at rest |
| Agentic Coding | AI-powered knowledge extraction and analysis |
